import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, filter, mergeMap } from 'rxjs';
import { BaseService } from '../services/base.service';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {

  private _leaderboard: { leaderboard: any[], totalScore: number } = { leaderboard: [], totalScore: 0 };

  constructor(private _activatedRoute: ActivatedRoute, private _quizService: QuizService, private _baseService: BaseService, private _router: Router) {
  }

  ngOnInit() {
    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }
    merge(
      this._activatedRoute.params.pipe(
        filter((params: any) => !!params.id),
        mergeMap((params: any) => this._quizService.fetchLeaderboard(params.id))
      )
    )
      .subscribe({
        next: (quizLeaderboard: any) => {
          this._leaderboard = quizLeaderboard,
            console.log(this._leaderboard);
        },
        error: (e) => {
          console.error(e);
        }
      });
  }

  get leaderboard() {
    return this._leaderboard.leaderboard;
  }

  get totalScore() {
    return this._leaderboard.totalScore;
  }

  noOneRespond(): boolean {
    return this._leaderboard.leaderboard.length === 0;
  }
}
