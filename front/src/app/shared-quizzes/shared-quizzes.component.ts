import { Component } from '@angular/core';
import { Quiz } from '../types/quiz.type';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-shared-quizzes',
  templateUrl: './shared-quizzes.component.html',
  styleUrls: ['./shared-quizzes.component.css']
})
export class SharedQuizzesComponent {
  private _quizzes: Quiz[];

  constructor(private _quizService: QuizService, private _baseService: BaseService, private _router: Router) {
    this._quizzes = [] as Quiz[];
  }

  ngOnInit() {
    this._quizService
      .fetch()
      .subscribe({ next: (quiz: Quiz[]) => this._quizzes = quiz });

    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }
  }

  ngOnChange() {

  }

  get quizzes(): Quiz[] {
    return this._quizzes;
  }
}
