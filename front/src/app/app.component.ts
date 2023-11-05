import { Component } from '@angular/core';
import { BaseService } from './services/base.service';
import { LoginRegisterService } from './services/login-register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private _name: string = "";

  constructor(private _baseService: BaseService, private _loginRegisterService: LoginRegisterService) { }

  ngDoCheck() {
    if (this.isLogged()) {
      this._name = this._baseService.getName();
    }
  }

  get name() {
    return this._name;
  }

  isLogged() {
    return this._baseService.isConnected();
  }

  disconnect() {
    this._loginRegisterService.logout();
  }
}
