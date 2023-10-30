import { Component } from '@angular/core';
import { Answer, Question, Quiz } from '../types/question.type';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent {

  private _quiz: Quiz;

  constructor(private _router: Router, private _httpClient: HttpClient) {
    this._quiz = {} as Quiz;
    this.generateDefaultQuiz();
    this.printQuiz();
  }

  private generateDefaultQuiz() {
    this._quiz = {
      title: "Nom du quiz",
      questions: [] 
    };
  
    this.addQuestion();
  }

  /**
   * Ajoute une question au quiz avec deux réponses.
   */
  addQuestion(){
    this._quiz.questions.push(
      {
        textQuestion: "",
        answers: []
      }
    );
    let index = this._quiz.questions.length - 1;
    this.addAnswerToQuestion(index);
    this.addAnswerToQuestion(index);
    this.printQuiz();
  }

  addAnswerToQuestion(questionId: number){
    this._quiz.questions.at(questionId)?.answers.push(
      {
        textAnswer: "",
        isCorrect: false
      }
    );
  }

  printQuiz(){
    console.log(this._quiz);
  }

  get quiz(): Quiz {
    return this._quiz;
  }

  /**
   * Get les réponses de la question à l'index
   * @param index de la question
   * @returns toutes les réponses associées
   */
  answers(index: number): Answer[]{
    return this._quiz.questions[index].answers;
  }

  updateQuestion(event: any, index: number){
    this.quiz.questions[index].textQuestion = event.target.value;
    this.printQuiz();
  }

  updateAnswer(event: any, indexQ: number, indexA: number){
    this.quiz.questions[indexQ].answers[indexA].textAnswer = event.target.value;
    this.printQuiz();
  }

  generateQuiz(){
    let quizData = {
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
    this._httpClient.post("http://localhost:3000/quiz",quizData).subscribe(response => {
      console.log('Réponse du serveur :', response);
    });
  }
}
