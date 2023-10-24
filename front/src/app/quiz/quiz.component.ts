import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  questions = [
    'Capitale de la france',
    'Face dun dé',
    'Nombre de semaine',
    // Ajoutez autant de questions que vous le souhaitez
  ];
}


