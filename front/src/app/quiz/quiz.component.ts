import { Component } from '@angular/core';
import { Question, Quiz } from '../types/question.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  private _quiz = {
    title : "Culture G",
    questions : [ 
      {
        textQuestion: "Quelle est la capitale de la france ?",
        answers : [
          {
            textAnswer : "Paris",
             isCorrect : true
          },
          {
            textAnswer : "Madrid",
             isCorrect : false
          },
          {
            textAnswer : "Berlin",
             isCorrect : false
          }
        ]
      },
      {
        textQuestion: "Quelle est la valeur de PI ?",
        answers : [
          {
            textAnswer : "3.74",
              isCorrect : false
          },
          {
            textAnswer : "3.14",
              isCorrect : true
          }
        ]
      },
      {
        textQuestion: "Parmis ces planètes, lesquelles sont gazzeuses ?",
        answers : [
          {
            textAnswer : "Mercure",
              isCorrect : false
          },
          {
            textAnswer : "Jupiter",
              isCorrect : true
          },
          {
            textAnswer : "Saturne",
              isCorrect : true
          },
          {
            textAnswer : "Mars",
              isCorrect : false
          }
        ]
      },
      {
        textQuestion: "Quels sont les chiffres plus grands que 5",
        answers : [
          {
            textAnswer : "3",
              isCorrect : false
          },
          {
            textAnswer : "8",
              isCorrect : true
          },
          {
            textAnswer : "7",
              isCorrect : true
          },
          {
            textAnswer : "12",
              isCorrect : true
          }
        ]
      }
    ]
  } as Quiz;

  constructor(private _router: Router) {
    //this._quiz = {} as Quiz;
    this.addIsSelectedToAnswers();
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
    console.log(`Score: ${score.toFixed(2)}/${this._quiz.questions.length}`);
    
  }
}


