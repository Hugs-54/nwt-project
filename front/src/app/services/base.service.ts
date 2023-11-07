import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  storeName(username: string) {
    localStorage.setItem('username', username);
  }

  getToken() {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      return tokenString;
    }
    return null;
  }

  getName() {
    const nameString = localStorage.getItem('username');
    if (nameString) {
      return nameString;
    }
    return "";
  }

  clearToken() {
    localStorage.removeItem('token');
    this.clearName();
  }

  clearName() {
    localStorage.removeItem('username');
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
