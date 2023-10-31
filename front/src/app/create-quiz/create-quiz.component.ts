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

  updateTitle(event: any){
    this.quiz.title = event.target.value;
    this.printQuiz();
  }

  updateQuestion(event: any, index: number){
    this.quiz.questions[index].textQuestion = event.target.value;
    this.printQuiz();
  }

  updateAnswer(event: any, indexQ: number, indexA: number){
    this.quiz.questions[indexQ].answers[indexA].textAnswer = event.target.value;
    this.printQuiz();
  }

  updateAnswerIsCorrect(event: any, indexQ: number, indexA: number){
    let b = this.quiz.questions[indexQ].answers[indexA].isCorrect;
    this.quiz.questions[indexQ].answers[indexA].isCorrect = !b;
    this.printQuiz();
  }

  deleteAnswer(indexQ: number, indexA: number){
    this.quiz.questions[indexQ].answers.splice(indexA, 1);
  }

  deleteQuestion(indexQ: number){
    this.quiz.questions.splice(indexQ, 1);
  }

  generateQuiz(){
    this._httpClient.post("http://localhost:3000/quiz",this._quiz).subscribe(response => {
      console.log('Réponse du serveur :', response);
    });
  }
}
