import { Component } from '@angular/core';
import { BaseService } from '../services/base.service';
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../types/quiz.type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent {

  private _quizzes: Quiz[];
  private _isCreator: boolean = false;

  constructor(private _quizService: QuizService, private _activatedRoute: ActivatedRoute, private _baseService: BaseService, private _router: Router) {
    this._quizzes = [] as Quiz[];
  }

  ngOnInit() {
    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }

    if (this._activatedRoute.snapshot.url[0].path === "my-quizzes") {
      this._isCreator = true;
      /* this._quizService
      .fetchByUser()
      .subscribe({ next: (quiz: Quiz[]) => this._quizzes = quiz }); */
      this._quizService
        .fetch()
        .subscribe({ next: (quiz: Quiz[]) => this._quizzes = quiz });
    } else {
      this._quizService
        .fetch()
        .subscribe({ next: (quiz: Quiz[]) => this._quizzes = quiz });
    }
  }

  get quizzes(): Quiz[] {
    return this._quizzes;
  }

  get isCreator() {
    return this._isCreator;
  }

  deleteQuizArray(event: { quizId: string }) {
    const index = this._quizzes.findIndex(quiz => quiz._id === event.quizId);
    if (index > -1) {
      this._quizzes.splice(index, 1);
    }
  }
}
