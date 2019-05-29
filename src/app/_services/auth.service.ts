import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiBase + 'auth/';
  accessToken: any;
  jwtHelper = new JwtHelperService();
  initialized = false;
  justLoggedIn = false;


  constructor(private http: HttpClient, private router: Router) { }

  getToken(): string {
    return JSON.parse(localStorage.getItem('access_token'));
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem('access_token', JSON.stringify(response.access_token));
            this.accessToken = this.jwtHelper.decodeToken(response.access_token);
            this.justLoggedIn = true;
          }
        }));
  }

  async logout() {
    localStorage.removeItem('access_token');
    await this.router.navigate(['login']);
  }

  sendVerification() {
    return this.http.post(this.baseUrl + 'phone-verification', null);
  }

  verifyCode(code: string) {
    console.log(this.baseUrl + 'verify/' + code);
    return this.http.post(this.baseUrl + 'verify/' + code, null).pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('access_token', JSON.stringify(response.access_token));
          this.initialized = false;
          this.init();
        }
      })
    );
  }

  userVerified() {
    if (!this.initialized) { this.init(); }
    return this.accessToken.ver === 'True';
  }

  loggedIn() {
    if (!this.initialized) { this.init(); }
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  init() {
    if (this.initialized) { return; }
    this.initialized = true;
    const token = localStorage.getItem('access_token');
    if (token) {
      this.accessToken = this.jwtHelper.decodeToken(token);
    }
  }


}
