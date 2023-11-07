import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-show-stats',
  templateUrl: './show-stats.component.html',
  styleUrls: ['./show-stats.component.css']
})
export class ShowStatsComponent {
  private _isCreator: boolean = false;

  constructor(private _activatedRoute: ActivatedRoute, private _baseService: BaseService, private _router: Router) {
  }

  ngOnInit() {
    if (!this._baseService.isConnected()) {
      this._router.navigate(['/login']);
    }

    const isCreatorParam = this._activatedRoute.snapshot.queryParamMap.get('isCreator');
    this._isCreator = isCreatorParam === 'true';
  }

  get isCreator() {
    return this._isCreator;
  }

}
