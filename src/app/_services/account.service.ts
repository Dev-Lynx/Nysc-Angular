import { Injectable } from '@angular/core';
import {User} from '../_models/user';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  user: User;
  baseUrl = environment.apiBase + 'account/';

  constructor(private http: HttpClient, private auth: AuthService) { }


  getUser(): Observable<User> {
    if (!this.auth.loggedIn()) {
      return null;
      // throw new Exception('The current user does not'
      // + ' have the required credentials to continue.');
    }

    return this.http.get<User>(this.baseUrl + 'user').pipe(
      map((response) => {
        console.log(response);
        response.dateOfBirth = new Date(response.dateOfBirth);
        this.user = response;
        return response;
      })
    );
  }

  updateUser(user: User) {
    return this.http.post(this.baseUrl + 'updateUser', user);
  }
}
