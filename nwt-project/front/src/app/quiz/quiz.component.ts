import { Component } from '@angular/core';
import { Question, Quiz } from '../types/quiz.type';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { filter, merge, mergeMap } from 'rxjs';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  private _quiz: Quiz;

  constructor(private _route: ActivatedRoute, private _quizService: QuizService, private _baseService: BaseService, private _router: Router) {
    this._quiz = {} as Quiz;
  }

  ngOnInit() {
    merge(
      this._route.params.pipe(
        filter((params: any) => !!params.id),
        mergeMap((params: any) => this._quizService.fetchOne(params.id))
      )
    )
      .subscribe({
        next: (quiz: Quiz) => this._quiz = quiz,
        error: () => {
          // manage error when quiz doesn't exist in DB
          this._quiz = this._quizService.defaultQuiz;
        }
      });
    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }
  }

  get quiz(): Question[] {
    return this._quiz.questions;
  }

  get title(): string {
    return this._quiz.title;
  }

  /**
   * Rajoute un attribut isSelected : boolean à toutes les réponses
   * Ce champ sert à enregistrer les réponses de l'utilisateur
   * Cette donnée n'a pas besoin d'être enregistrer sur la bdd
   */
  addIsSelectedToAnswers() {
    this._quiz.questions.forEach((question) => {
      question.answers.forEach((answer) => {
        answer.isSelected = false;
      });
    });
  }

  changeAnswerSelected(event: { questionId: number; answerId: number }) {
    var isSelected = this._quiz.questions[event.questionId].answers[event.answerId].isSelected;
    this._quiz.questions[event.questionId].answers[event.answerId].isSelected = !isSelected;
  }

  validateQuiz() {
    let score: number = 0.00;

    this._quiz.questions.forEach((question) => {
      const selectedAnswers = question.answers.filter((answer) => answer.isSelected);
      const correctAnswers = question.answers.filter((answer) => answer.isCorrect);

      if (selectedAnswers.length === correctAnswers.length && selectedAnswers.every((answer) => correctAnswers.includes(answer))) {
        // Toutes les réponses sélectionnées sont correctes
        score += correctAnswers.length;
      }

      //S'il y a plus de réponses selectionnées que de bonne réponse, 
      //le score équivaut au nombre de bonne réponse divisé par le nombre de réponse selectionnées
      //1 bonne réponse, 2 réponses sélectionnées (1 bonne 1 fausse) : 0.50
      //1 bonne réponse, 3 réponses sélectionnées (1 bonne 2 fausses): 0.33
      /*if (selectedAnswers.length > correctAnswers.length && selectedAnswers.find((answer) => correctAnswers.includes(answer))) {
        score += correctAnswers.length/selectedAnswers.length;
        //A revoir car si 3 bonnes réponses en selectionnant 4 réponses : 0.75/3
      }*/

      /*
      if (selectedAnswers.length < correctAnswers.length && selectedAnswers.every((answer) => correctAnswers.includes(answer))) {
        score += selectedAnswers.length;
      }*/
    });
    alert(`Score: ${score.toFixed(2)}/${this._quiz.questions.length}`);
    //console.log(this._quiz);

  }
}


