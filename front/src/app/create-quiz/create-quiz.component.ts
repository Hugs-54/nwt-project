import { Component, OnChanges, OnInit } from '@angular/core';
import { Quiz } from '../types/quiz.type';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { QuizService } from '../services/quiz.service';
import { BaseService } from '../services/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent implements OnInit, OnChanges {

  private _isUpdateMode: boolean;
  private _quiz: Quiz;
  //private readonly _cancel$: EventEmitter<void>;
  //private readonly _submit$: EventEmitter<Quiz>;
  private readonly _form: FormGroup;

  constructor(private _quizService: QuizService, private _baseService: BaseService, private _router: Router) {
    this._quiz = {} as Quiz;
    this._isUpdateMode = false;
    //this._submit$ = new EventEmitter<Quiz>();
    //this._cancel$ = new EventEmitter<void>();
    this._form = this._buildForm();
  }

  ngOnInit() {
    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }
  }
  /*
    @Input()
    set quiz(quiz: Quiz) {
      this._quiz = quiz;
    }
  */
  get quiz(): Quiz {
    return this._quiz;
  }

  get form(): FormGroup {
    return this._form;
  }

  questions() {
    return (this._form.get('questions') as FormArray).controls;
  }

  answers(indexQ: number) {
    return (this._form.get('questions.' + indexQ + '.answers') as FormArray).controls;
  }

  get isUpdateMode(): boolean {
    return this._isUpdateMode;
  }

  addQuestion() {
    this.questions().push(this.newQuestion());
    this.checkValidation();
  }

  addAnswerToQuestion(indexQ: number) {
    this.answers(indexQ).push(this.newAnswer());
    this.checkValidation();
  }

  deleteAnswer(indexQ: number, indexA: number) {
    (this._form.get('questions.' + indexQ + '.answers') as FormArray).removeAt(indexA);
    this.checkValidation();
  }

  deleteQuestion(indexQ: number) {
    (this._form.get('questions') as FormArray).removeAt(indexQ);
    this.checkValidation();
  }

  updateAnswerIsCorrect(indexQ: number, indexA: number) {
    let b = this.answers(indexQ).at(indexA)?.get('isCorrect')?.value;
    this.answers(indexQ).at(indexA)?.patchValue({ isCorrect: !b });
    this.checkValidation();
  }

  answerHasCorrectAnswer(indexQ: number): boolean {
    for (const answer of this.answers(indexQ)) {
      if (answer.get('isCorrect')?.value === true) {
        return true;
      }
    }
    return false;
  }

  /**
   * Refresh la validation. Nécessaire car l'ajout de FormGroup/Array ne déclenche pas forcément la validation
   */
  checkValidation() {
    for (let i = 0; i < this.questions().length; i++) {
      (this._form.get('questions.' + i + '.answers') as FormArray).updateValueAndValidity();
    }
    (this._form.get('questions') as FormArray).updateValueAndValidity();
  }

  /**
   * FormGroup d'une nouvelle question
   */
  newQuestion(): FormGroup {
    return new FormGroup({
      textQuestion: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(5)
      ])),
      answers: new FormArray([
        this.newAnswer(),
        this.newAnswer()
      ], [CustomValidators.arrayContainsAtLeast(2), CustomValidators.atLeastOneCheckboxChecked()])
    })
  }

  /**
   * FormGroup d'une nouvelle réponse
   */
  newAnswer(): FormGroup {
    return new FormGroup({
      textAnswer: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1)
      ])),
      isCorrect: new FormControl(false)
    })
  }

  /**
   * FormGroup d'un quiz de base
   */
  private _buildForm(): FormGroup {
    return new FormGroup({
      title: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(2)
      ])),
      questions: new FormArray([
        this.newQuestion()
      ], CustomValidators.arrayContainsAtLeast(1))
    });
  }

  ngOnChanges(record: any): void {
    if (record.quiz && record.quiz.currentValue) {
      this._quiz = record.quiz.currentValue;
      this._isUpdateMode = true;
    } else {
      this._quiz = {
        title: '',
        questions: [
          {
            textQuestion: '',
            answers: [
              {
                textAnswer: '',
                isCorrect: false
              },
              {
                textAnswer: '',
                isCorrect: false
              }
            ]
          }
        ]
      };
      this._isUpdateMode = false;
    }
    this._form.patchValue(this._quiz);
  }

  onSubmit(): void {
    this._quizService.create(this._form.value as Quiz);
    this._form.reset();
  }
}