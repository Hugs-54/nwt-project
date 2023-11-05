import { Component } from '@angular/core';
import { LoginRegister, TokenResponse } from '../types/login-register.type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRegisterService } from '../services/login-register.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../services/base.service';
import { catchError, throwError } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  private _loginRegister: LoginRegister;
  private readonly _form: FormGroup;
  private _wantToLogin: boolean = true;
  private _accountCreatedWithSucess: boolean = false;
  private _thereIsProblem: boolean = false;
  private _problemText: string = "";

  constructor(private _loginRegisterService: LoginRegisterService, private _activatedRoute: ActivatedRoute, private _router: Router, private _baseService: BaseService) {
    this._loginRegister = {} as LoginRegister;
    this._form = this._buildForm();
  }

  private _buildForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(3)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8)
      ]))
    });
  }

  get login(): LoginRegister {
    return this._loginRegister;
  }

  get form(): FormGroup {
    return this._form;
  }

  get wantToLogin(): boolean {
    return this._wantToLogin;
  }

  get accountCreatedWithSucess(): boolean {
    return this._accountCreatedWithSucess;
  }

  get thereIsProblem(): boolean {
    return this._thereIsProblem;
  }

  get problemText(): string {
    return this._problemText;
  }

  setWantToLogin(isLogging: boolean) {
    this._wantToLogin = isLogging;
  }

  showSucessAccountCreated() {
    this._accountCreatedWithSucess = true;
    this._thereIsProblem = false;
    setTimeout(() => {
      this._accountCreatedWithSucess = false;
    }, 8000);
  }

  showProblem(text: string) {
    this._problemText = text;
    this._thereIsProblem = true;
    setTimeout(() => {
      this._thereIsProblem = false;
    }, 8000);
  }

  onSubmit(): void {
    if (this.wantToLogin) {
      this._loginRegisterService.login(this._form.value as LoginRegister)
        .pipe(
          catchError((error) => {
            if (error.status === 401) {
              this.showProblem("Mot de passe incorrect.");
            } else if (error.status === 404) {
              this.showProblem("L'utilisateur n'existe pas.");
            } else {
              console.error('Erreur inattendue:', error);
            }
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (event: any) => {
            this._baseService.storeToken(event.access_token);
            this._baseService.storeName(this._form.value.username);
            this._router.navigateByUrl("/my-quizzes");
          },
          complete: () => console.info('Connexion effectuée avec succès'),
        });

    } else {
      this._loginRegisterService.register(this._form.value as LoginRegister)
        .subscribe({
          error: (e) => { console.error(e), this.showProblem("Problème lors de la création du compte.") },
          complete: () => console.info('Profil créé avec succès'),
          next: () => this.showSucessAccountCreated()
        });
    }
  }
}
