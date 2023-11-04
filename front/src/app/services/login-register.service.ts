import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { LoginRegister } from '../types/login-register.type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {

  constructor(private _http: HttpClient, private _router: Router, private _baseService: BaseService) { }

  login(user: LoginRegister) {
    this._http.post<LoginRegister>(this._baseService.backenURL.login, user, this._baseService.options(false))
      .subscribe({
        error: (e) => console.error(e),
        complete: () => console.info('Connexion effectuée avec succès'),
        next: (token) => { this._baseService.storeToken(token), this._router.navigateByUrl("/my-quizzes") }
      });
  }

  register(user: LoginRegister) {
    this._http.post<LoginRegister>(this._baseService.backenURL.register, user)
      .subscribe({
        error: (e) => console.error(e),
        complete: () => console.info('Profil créé avec succès')
      });
  }
}
