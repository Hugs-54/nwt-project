import { Injectable } from '@angular/core';
import { Quiz } from '../types/quiz.type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, defaultIfEmpty, filter } from 'rxjs';
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
    return this._http.get<Quiz[]>(this._baseService.backenURL.allQuiz)
      .pipe(
        filter((quiz: Quiz[]) => !!quiz),
        defaultIfEmpty([])
      );
  }

  /**
   * Function to return one quiz for current id
   */
  fetchOne(id: string): Observable<Quiz> {
    return this._http.get<Quiz>(this._baseService.backenURL.oneQuiz.replace(':id', id));
  }
}
