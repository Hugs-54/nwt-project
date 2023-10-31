import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Quiz } from '../types/question.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared-quizzes',
  templateUrl: './shared-quizzes.component.html',
  styleUrls: ['./shared-quizzes.component.css']
})
export class SharedQuizzesComponent {
  private _quizzes : Quiz[];

  constructor(private _router: Router, private _httpClient: HttpClient) {
    this._quizzes = [] as Quiz[];
  }

  ngOnInit() {
    this.fetchQuiz();
  }

  fetchQuiz() {
    const apiUrl = 'http://localhost:3000/quiz';
    this._httpClient.get<Quiz[]>(apiUrl).subscribe(
      (response) => {
        this._quizzes = response;
        console.log(this.quizzes);
      },
      (error) => {
        console.error('Erreur lors de la récupération des quiz :', error);
      }
    );
  }
  
  get quizzes(): Quiz[] {
    return this._quizzes;
  }
}
