import { Component, OnChanges, OnInit } from '@angular/core';
import { Answer, Question, Quiz } from '../types/quiz.type';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { QuizService } from '../services/quiz.service';
import { BaseService } from '../services/base.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-edit-quiz',
  templateUrl: './create-edit-quiz.component.html',
  styleUrls: ['./create-edit-quiz.component.css']
})
export class CreateEditQuizComponent implements OnInit, OnChanges {

  private _isUpdateMode: boolean;
  private _quiz: Quiz;
  private _quizId: string;
  private _form: FormGroup;

  constructor(private _quizService: QuizService, private _activatedRoute: ActivatedRoute, private _baseService: BaseService, private _router: Router) {
    this._quiz = {} as Quiz;
    this._isUpdateMode = false;
    this._quizId = "";
    this._form = this._buildForm();
  }

  ngOnInit() {
    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }

    //Vérifie si on est en mode édition
    const editableParam = this._activatedRoute.snapshot.queryParamMap.get('editable');
    this._isUpdateMode = editableParam !== null ? true : false;

    //Récupère l'id du quiz à modifier
    const quizIdParam = this._activatedRoute.snapshot.queryParamMap.get('quizId');
    this._quizId = quizIdParam !== null ? quizIdParam : '';

    if (this._isUpdateMode) {
      this._quizService.fetchOne(this._quizId).subscribe({
        next: (quiz: Quiz) => {
          this._quiz = quiz,
            this._form = this._buildFormEditable()
        },
        error: () => {
          // manage error when quiz doesn't exist in DB
          this._quiz = this._quizService.defaultQuiz;
        }
      });
    }
  }

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

  private _buildFormEditable(): FormGroup {
    const form = new FormGroup({
      title: new FormControl(this._quiz.title, Validators.compose([Validators.required, Validators.minLength(2)])),
      questions: new FormArray(this._quiz.questions.map((question) => this.buildQuestionFormGroup(question)), [CustomValidators.arrayContainsAtLeast(1)])
    });
    return form;
  }

  private buildQuestionFormGroup(question: Question): FormGroup {
    return new FormGroup({
      textQuestion: new FormControl(question.textQuestion, Validators.compose([Validators.required, Validators.minLength(5)])),
      answers: new FormArray(question.answers.map((answer) => this.buildAnswerFormGroup(answer)), [CustomValidators.arrayContainsAtLeast(2), CustomValidators.atLeastOneCheckboxChecked()])
    });
  }

  private buildAnswerFormGroup(answer: Answer): FormGroup {
    return new FormGroup({
      textAnswer: new FormControl(answer.textAnswer, Validators.compose([Validators.required, Validators.minLength(1)])),
      isCorrect: new FormControl(answer.isCorrect)
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
    if (this.isUpdateMode) {
      this._quizService.change(this._form.value as Quiz, this._quizId);
      this._router.navigateByUrl("/my-quizzes");
    } else {
      this._quizService.create(this._form.value as Quiz);
    }
    this._form = this._buildForm();
  }
}