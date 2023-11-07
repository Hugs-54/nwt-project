import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../types/quiz.type';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {

  private _questionId: number;
  private _question: Question;
  @Output() setSelected = new EventEmitter<{ questionId: number, answerId: number }>();

  constructor() {
    this._question = {} as Question;
    this._questionId = 0;
  }

  @Input()
  set question(question: Question) {
    this._question = question;
  }

  get question(): Question {
    return this._question;
  }

  @Input()
  set questionId(questionId: number) {
    this._questionId = questionId;
  }

  get questionId(): string {
    return this._questionId + "";
  }

  onAnswerChange(answer: number) {
    this.setSelected.emit({ questionId: this._questionId, answerId: answer });
  }

}


