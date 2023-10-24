import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  quiz = [ 
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
    }
  ]
}


