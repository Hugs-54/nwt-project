import { HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRegister } from '../types/login-register.type';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  // private property to store all backend URLs
  private readonly _backendURL: any;

  constructor() {
    this._backendURL = {};

    // build backend base url
    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }

    // build all backend urls
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[k] = `${baseUrl}${environment.backend.endpoints[k]}`);
  }

  get backenURL() {
    return this._backendURL;
  }

  storeToken(token: HttpEvent<LoginRegister>) {
    localStorage.setItem('token', JSON.stringify(token));
  }

  getToken() {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      return JSON.parse(tokenString);
    }
    return null;
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  isConnected(): boolean {
    return this.getToken() === null ? false : true;
  }

  /**
 * Function to return request options
 */
  options(withToken: boolean, headerList: object = {}): any {
    if (withToken) {
      return {
        headers: new HttpHeaders(Object.assign(
          {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          },
          headerList))
      };
    }
    return {
      headers: new HttpHeaders(Object.assign(
        {
          'Content-Type': 'application/json',
        },
        headerList))
    };
  }
}
