import { Component } from '@angular/core';
import { BaseService } from './services/base.service';
import { LoginRegisterService } from './services/login-register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private _baseService: BaseService, private _loginRegisterService: LoginRegisterService) {

  }

  isLogged() {
    return this._baseService.isConnected();
  }

  disconnect() {
    this._loginRegisterService.logout();
  }
}
