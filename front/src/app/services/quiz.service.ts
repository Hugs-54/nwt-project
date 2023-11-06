import { Injectable } from '@angular/core';
import { Quiz, SubmitQuiz } from '../types/quiz.type';
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, defaultIfEmpty, filter, map } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // private property to store default person
  private _defaultQuiz: Quiz;

  constructor(private _http: HttpClient, private _baseService: BaseService) {
    this._defaultQuiz = {
      title: "Quiz par défaut",
      questions: [
        {
          textQuestion: "Quelle est la réponse en deuxième position ?",
          answers: [
            {
              textAnswer: "Ici",
              isCorrect: false
            },
            {
              textAnswer: "Là",
              isCorrect: true
            }
          ]
        },
        {
          textQuestion: "Les réponses sont-elles simples ?",
          answers: [
            {
              textAnswer: "Oui",
              isCorrect: true
            },
            {
              textAnswer: "Non",
              isCorrect: false
            }
          ]
        }
      ]
    };

  }

  /**
   * Returns private property _defaultQuiz
   */
  get defaultQuiz(): Quiz {
    return this._defaultQuiz;
  }

  /**
   * Function to create a new person
   */
  create(quiz: Quiz) {
    this._http.post<Quiz>(this._baseService.backenURL.createQuiz, quiz, this._baseService.options(true))
      .subscribe({
        error: (e) => console.error(e),
        complete: () => console.info('Quiz créé avec succès')
      });
  }

  /**
   * Function to return list of quiz
   */
  fetch(): Observable<Quiz[]> {
    return this._http.get<Quiz[]>(this._baseService.backenURL.allQuiz, this._baseService.options(true))
      .pipe(
        filter((quiz: any) => !!quiz),
        defaultIfEmpty([])
      );
  }

  /**
   * Function to return list of quiz of a user
   */
  fetchByUser(): Observable<Quiz[]> {
    return this._http.get<Quiz[]>(this._baseService.backenURL.myQuiz, this._baseService.options(true))
      .pipe(
        filter((quiz: any) => !!quiz),
        defaultIfEmpty([])
      );
  }

  /**
   * Function to return one quiz for current id
   */
  fetchOne(id: string): Observable<Quiz> {
    return this._http.get<Quiz>(this._baseService.backenURL.oneQuiz.replace(':id', id));
  }

  delete(id: string) {
    return this._http.delete<any>(this._baseService.backenURL.oneQuiz.replace(':id', id));
  }

  /**
   * Obtenir le score d'un utilisateur pour un quiz donné
   */
  fetchScore(quizId: string) {
    return this._http.get<string>(this._baseService.backenURL.score.replace(':quizId', quizId), this._baseService.options(true));
  }

  submitQuiz(quiz: SubmitQuiz) {
    return this._http.post<string>(this._baseService.backenURL.submitQuiz, quiz, this._baseService.options(true))
  }

  change(quiz: Quiz, quizId: string) {
    this._http.put<Quiz>(this._baseService.backenURL.oneQuiz.replace(':id', quizId), quiz, this._baseService.options(true))
      .subscribe({
        error: (e) => console.error(e),
        complete: () => console.info('Quiz modifié avec succès')
      });
  }
}
