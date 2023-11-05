import { Component } from '@angular/core';
import { BaseService } from './services/base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private _baseService: BaseService) {

  }

  isLogged() {
    return this._baseService.isConnected();
  }

  disconnect() {
    this._baseService.clearToken();
  }
}
