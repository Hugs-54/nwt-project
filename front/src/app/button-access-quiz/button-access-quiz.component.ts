import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-button-access-quiz',
  templateUrl: './button-access-quiz.component.html',
  styleUrls: ['./button-access-quiz.component.css']
})
export class ButtonAccessQuizComponent {

  private _title: string;
  private _quizId: string;
  private _isCreator: boolean;
  private _score: string; //score pour chaque quiz déjà répondu. Finalement pas utilisé par manque de compréhension
  private _totalScore: string; //score total pour chaque quiz déjà répondu. Finalement pas utilisé par manque de compréhension
  private _hasAlreadyRespond: boolean = false;
  @Output() quizDeleted = new EventEmitter<{ quizId: string }>();

  constructor(private _quizService: QuizService) {
    this._title = "";
    this._quizId = "";
    this._score = "";
    this._totalScore = "";
    this._isCreator = false;
  }

  ngOnInit() {
    if (!this._isCreator) {
      this._quizService.fetchScore(this._quizId)
        .subscribe({
          next: (response: any) => {
            this._score = response.userScore;
            this._totalScore = response.totalScore;
            this._hasAlreadyRespond = response.userScore === null ? false : true;
          }
        });
    }
  }

  @Input()
  set title(title: string) {
    this._title = title;
  }

  @Input()
  set id(id: string | undefined) {
    this._quizId = !!id ? id : "";
  }

  @Input()
  set isCreator(isCreator: boolean) {
    this._isCreator = isCreator;
  }

  get title() {
    return this._title;
  }

  get id() {
    return this._quizId;
  }

  get hasAlreadyRespond() {
    return this._hasAlreadyRespond;
  }

  get isCreator() {
    return this._isCreator;
  }

  get score() {
    return this._score;
  }

  get totalScore() {
    return this._totalScore;
  }

  deleteQuiz() {
    this._quizService.delete(this._quizId).subscribe({
      error: (e) => console.error(e),
      complete: () => console.info("Quiz supprimé avec succès.")
    });
    this.quizDeleted.emit({ quizId: this._quizId });
  }
}
