
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router';

export type AppRole = "RegularUser" | "Coordinator" | "Administrator";

interface AuthToken {
  rol: AppRole;
  ver: 'True' | 'False';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiBase + 'auth/';
  accessToken: AuthToken;
  private jwtHelper = new JwtHelperService();
  initialized = false;
  justLoggedIn = false;
  verificationSent = false;
  
  get role() {
    return !!this.accessToken ? this.accessToken.rol : "RegularUser";
  }

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
            
            console.log(this.role);
            console.log(this.accessToken);

            this.justLoggedIn = true;
          }
        }));
  }

  async logout() {
    localStorage.removeItem('access_token');
    await this.router.navigate(['login']);
  }

  sendVerification(phoneNumber?: string) {
    this.verificationSent = true;
    const phoneRoute = (phoneNumber ? `/${phoneNumber}` : '');
    const url = this.baseUrl + 'phone-verification' + phoneRoute;
    console.log("Sending Verification", phoneNumber, url);
    return this.http.post(url, null);
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
    return this.accessToken.ver === "True";
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
