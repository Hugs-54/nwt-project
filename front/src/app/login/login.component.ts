import { Component } from '@angular/core';
import { LoginRegister } from '../types/login-register.type';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../create-quiz/custom-validators';
import { LoginRegisterService } from '../services/login-register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private _loginRegister: LoginRegister;
  private readonly _form: FormGroup;
  private _wantToLogin: boolean = true;

  constructor(private _loginRegisterService: LoginRegisterService) {
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

  setWantToLogin(isLogging: boolean) {
    this._wantToLogin = isLogging;
  }

  onSubmit(): void {
    if (this.wantToLogin) {
      this._loginRegisterService.login(this._form.value as LoginRegister);
    } else {
      this._loginRegisterService.register(this._form.value as LoginRegister);
    }
  }
}
