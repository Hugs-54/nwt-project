import { Component } from '@angular/core';
import { Question, Quiz } from '../types/question.type';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  private _quiz : Quiz;

  constructor(private _router: Router, private _httpClient: HttpClient) {
    this._quiz = {} as Quiz;
  }

  ngOnInit() {
    let id = "653fe823630cd7609fc7d4a2";
    this.fetchQuiz(id);
  }

  fetchQuiz(quizId: string) {
    const apiUrl = `http://localhost:3000/quiz/${quizId}`;

    this._httpClient.get<Quiz>(apiUrl).subscribe(
      (response) => {
        this._quiz = response;
        this.addIsSelectedToAnswers();
      },
      (error) => {
        console.error('Erreur lors de la récupération du quiz :', error);
      }
    );
  }
  
  get quiz(): Question[] {
    return this._quiz.questions;
  }

  get title(): string{
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

  changeAnswerSelected(event: { questionId: number; answerId: number }){
    var isSelected = this._quiz.questions[event.questionId].answers[event.answerId].isSelected;
    this._quiz.questions[event.questionId].answers[event.answerId].isSelected = !isSelected;
  }

  validateQuiz(){
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
    
  }
}


