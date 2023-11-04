import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { LoginRegister } from '../types/login-register.type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {
  constructor(private _http: HttpClient, private _baseService: BaseService) { }

  login(user: LoginRegister) {
    return this._http.post<LoginRegister>(this._baseService.backenURL.login, user, this._baseService.options(false))
  }

  register(user: LoginRegister) {
    return this._http.post<LoginRegister>(this._baseService.backenURL.register, user);
  }

  logout() {
    this._http.post<LoginRegister>(this._baseService.backenURL.logout, this._baseService.options(true));
    this._baseService.clearToken();
  }

}
