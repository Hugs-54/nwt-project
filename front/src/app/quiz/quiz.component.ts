import { Component } from '@angular/core';
import { Question, Quiz, SubmitQuiz } from '../types/quiz.type';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { filter, merge, mergeMap } from 'rxjs';
import { BaseService } from '../services/base.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  private _quiz: Quiz;
  private _form: FormGroup;
  private _score: string = "";

  constructor(private _route: ActivatedRoute, private _formBuilder: FormBuilder, private _quizService: QuizService, private _baseService: BaseService, private _router: Router) {
    this._quiz = {} as Quiz;
    this._form = {} as FormGroup;
  }

  ngOnInit() {
    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }

    merge(
      this._route.params.pipe(
        filter((params: any) => !!params.id),
        mergeMap((params: any) => this._quizService.fetchOne(params.id))
      )
    )
      .subscribe({
        next: (quiz: Quiz) => {
          this._quiz = quiz,
            this._form = this._buildForm()
        },
        error: () => {
          // manage error when quiz doesn't exist in DB
          this._quiz = this._quizService.defaultQuiz;
        }
      });
  }



  private _buildForm(): FormGroup {
    return new FormGroup({
      quizId: new FormControl(this._quiz._id, Validators.required),
      questions: new FormArray(this.createAllQuestionForm())
    });
  }

  /**
   * Assigne les id de chaque questions
   */
  createAllQuestionForm(): FormGroup[] {
    let array = new Array(this.quiz.length);
    for (let i = 0; i < this.quiz.length; i++) {
      array[i] = new FormGroup({
        questionId: new FormControl(this.quiz[i]._id, Validators.required),
        selectedAnswers: new FormArray([])
      });
    }
    return array;
  }

  changeAnswerSelected(indexQ: number, indexA: number) {
    let selectedAnswers = (this._form.get('questions.' + indexQ + '.selectedAnswers') as FormArray);
    let idAnswer = this._quiz.questions[indexQ].answers[indexA]._id;
    let foundIndex = selectedAnswers.controls.findIndex(answer => answer.value === idAnswer)
    if (foundIndex !== -1) {
      //Si la question est déjà présente, on l'enleve
      selectedAnswers.removeAt(foundIndex);
    } else {
      //Sinon on l'ajoute
      selectedAnswers.push(new FormControl(idAnswer));
    }
  }

  get quiz(): Question[] {
    return this._quiz.questions;
  }

  get form(): FormGroup {
    return this._form;
  }

  get title(): string {
    return this._quiz.title;
  }

  get score(): string {
    return this._score;
  }

  sendForm() {
    this._quizService.submitQuiz(this._form.value as SubmitQuiz)
      .subscribe({
        error: (e) => console.error(e),
        next: (response: any) => this._score = response,
        complete: () => console.info('Résultat du quiz reçu.')
      });;
  }
}