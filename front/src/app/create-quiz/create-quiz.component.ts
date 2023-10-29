import { Component } from '@angular/core';
import { Answer, Question, Quiz } from '../types/question.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent {

  private _quiz: Quiz;

  constructor(private _router: Router) {
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
        textQuestion: "Ecrivez votre question",
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
        textAnswer: "Ecrivez votre réponse",
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
    this.quiz.questions[indexQ].answers[indexA] = event.target.value;
    this.printQuiz();
  }
}
