import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-button-access-quiz',
  templateUrl: './button-access-quiz.component.html',
  styleUrls: ['./button-access-quiz.component.css']
})
export class ButtonAccessQuizComponent {

  private _title: string;
  private _id: string;
  private _isCreator: boolean;
  @Output() quizDeleted = new EventEmitter<{ quizId: string }>();

  constructor(private _quizService: QuizService) {
    this._title = "";
    this._id = "";
    this._isCreator = false;
  }

  @Input()
  set title(title: string) {
    this._title = title;
  }

  @Input()
  set id(id: string | undefined) {
    this._id = !!id ? id : "";
  }

  @Input()
  set isCreator(isCreator: boolean) {
    this._isCreator = isCreator;
  }

  get title() {
    return this._title;
  }

  get id() {
    return this._id;
  }

  get isCreator() {
    return this._isCreator;
  }

  deleteQuiz() {
    this._quizService.delete(this._id).subscribe({
      error: (e) => console.error(e),
      complete: () => console.info("Quiz supprimé avec succès.")
    });
    this.quizDeleted.emit({ quizId: this._id });
  }
}
