import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {

  private _question: string;
  private _questionId: number;

  constructor(private _router: Router) {
    this._question = "Question";
    this._questionId = 0;
  }

  @Input()
  set question(question: string) {
    this._question = question;
  }

  get question(): string {
    return this._question;
  }

  @Input()
  set questionId(questionId: number) {
    this._questionId = questionId;
  }

  get questionId(): number {
    return this._questionId;
  }

}


