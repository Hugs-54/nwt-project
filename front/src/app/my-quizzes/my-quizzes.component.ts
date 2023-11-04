import { Component } from '@angular/core';
import { BaseService } from '../services/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-quizzes',
  templateUrl: './my-quizzes.component.html',
  styleUrls: ['./my-quizzes.component.css']
})
export class MyQuizzesComponent {

  constructor(private _baseService: BaseService, private _router: Router) {

  }

  ngOnInit() {
    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }
  }
}
