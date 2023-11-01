import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Answer, Question, Quiz } from '../types/question.type';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent implements OnInit, OnChanges {

  private _isUpdateMode: boolean;
  private _quiz: Quiz;
  // private property to store cancel$ value
  private readonly _cancel$: EventEmitter<void>;
  // private property to store submit$ value
  private readonly _submit$: EventEmitter<Quiz>;
  // private property to store form value
  private readonly _form: FormGroup;

  constructor(private _router: Router, private _httpClient: HttpClient) {
    this._quiz = {} as Quiz;
    this._isUpdateMode = false;
    this._submit$ = new EventEmitter<Quiz>();
    this._cancel$ = new EventEmitter<void>();
    this._form = this._buildForm();
  }

  /**
   * OnInit implementation
   */
  ngOnInit(): void {
  }

  @Input()
  set quiz(quiz: Quiz) {
    this._quiz = quiz;
  }

  /**
   * Returns private property _quiz
   */
  get quiz(): Quiz {
    return this._quiz;
  }

  /**
   * Returns private property _form
   */
  get form(): FormGroup {
    return this._form;
  }

  questions(){
    return (this._form.get('questions') as FormArray).controls;
  }

  answers(questionIndex: number){
    return (this._form.get('questions.'+questionIndex+'.answers') as FormArray).controls;
  }

  /**
   * Returns private property _isUpdateMode
   */
  get isUpdateMode(): boolean {
    return this._isUpdateMode;
  }

  addQuestion(){
    this.questions().push(this.newQuestion());
  }

  addAnswerToQuestion(questionId: number){
    this.answers(questionId).push(this.newAnswer());
  }

  deleteAnswer(indexQ: number, indexA: number){
    (this._form.get('questions.'+indexQ+'.answers') as FormArray).removeAt(indexA);
  }

  deleteQuestion(indexQ: number){
    (this._form.get('questions') as FormArray).removeAt(indexQ);
  }

  updateAnswerIsCorrect(indexQ: number, indexA: number){
    let b = this.answers(indexQ).at(indexA)?.get('isCorrect')?.value;
    this.answers(indexQ).at(indexA)?.patchValue({isCorrect:!b});
    //this.answers(indexQ).at(indexA)?.setErrors({'incorrect':b});
  }

  answerHasCorrectAnswer(indexQ: number): boolean{
    for (const answer of this.answers(indexQ)) {
      if (answer.get('isCorrect')?.value === true) {
        return true;
      }
    }
    return false;
  }

  newQuestion(): FormGroup{
    return new FormGroup({
      textQuestion: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(5)
      ])),
      answers: new FormArray([
        this.newAnswer(),
        this.newAnswer()
      ],CustomValidators.arrayContainsAtLeast(2))
    })
  }

  newAnswer(): FormGroup{
    return new FormGroup({
      textAnswer: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1)
      ])),
      isCorrect: new FormControl(false)
    })
  }

   /**
   * Function to build our form
   */
   private _buildForm(): FormGroup {
    return new FormGroup({
      title: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(2)
      ])),
      questions: new FormArray([
        this.newQuestion()
      ],CustomValidators.arrayContainsAtLeast(1))
    });
  }

  /**
   * Returns private property _cancel$
   */
  @Output('cancel')
  get cancel$(): EventEmitter<void> {
    return this._cancel$;
  }

  /**
   * Returns private property _submit$
   */
  @Output('submit')
  get submit$(): EventEmitter<Quiz> {
    return this._submit$;
  }

  /**
   * Function to handle component update
   */
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

    // update form's values with quiz
    this._form.patchValue(this._quiz);
  }

  /**
   * Function to emit event to cancel process
   */
  cancel(): void {
    this._cancel$.emit();
  }

  /**
   * Function to emit event to submit form and person
   */
  submit(quiz: Quiz): void {
    //this._submit$.emit(quiz);
    this._httpClient.post("http://localhost:3000/quiz",this._form.value).subscribe(response => {
      console.log('Réponse du serveur :', response);
    });
  }
}