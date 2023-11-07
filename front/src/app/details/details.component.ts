import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, filter, mergeMap } from 'rxjs';
import { BaseService } from '../services/base.service';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  private _questions: any[] = [];

  constructor(private _activatedRoute: ActivatedRoute, private _quizService: QuizService, private _baseService: BaseService, private _router: Router) {
  }

  ngOnInit() {
    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }
    merge(
      this._activatedRoute.params.pipe(
        filter((params: any) => !!params.id),
        mergeMap((params: any) => this._quizService.fetchDetails(params.id))
      )
    )
      .subscribe({
        next: (quizDetails: any) => {
          this._questions = quizDetails,
            console.log(quizDetails)
        },
        error: (e) => {
          console.error(e);
        }
      });
  }

  get questions() {
    return this._questions;
  }
}
