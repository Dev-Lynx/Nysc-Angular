import { Injectable } from '@angular/core';
import {User} from '../_models/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import { IPagedResult, PackageAuthViewModel, SieveModel } from "../_models/misc";
import { DataPackageViewModel } from "../_models/package";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  user: User;
  baseUrl = environment.apiBase + 'account/';

  identities: IPagedResult<User>;
  // identities: 

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

        this.resolveUser(response);
        return response;
      })
    );

    // fn.subscribe(x => this.resolveUser(x));

    // return fn;
  }

  private async resolveUser(user: User) {
    user.passport = await this.acquireResource(user.passport, (url) => user.passport = url);
    user.signature = await this.acquireResource(user.signature, (url) => user.signature = url);
    // console.log("Resolved passport", user.passport, user.signature);
    this.user = user;
  }

  private async acquireResource(url: string, callback: (url: string) => void) {
    if (!url) return null;

    try {
      url = environment.apiBase + url;
      const blob = await this.http.get(url, { responseType: "blob" }).toPromise();

      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = function() {
        callback(reader.result as string);
        console.log(reader.result);
        // result includes identifier 'data:image/png;base64,' plus the base64 data
        // reader.result;     
      }
    } catch (err) {
      console.error(err);
      return null;  
    }
    
    // try {
    //   url = environment.apiBase + url;
    //   console.log("Resolving ", url);
    //   const res = await this.http.get(url, { responseType: "blob" }).toPromise();
    //   console.log(res);
    //   return URL.createObjectURL(res);
    // } catch (err) {
    //   console.error(err);
    //   return null;
    // }
  }

  updateUser(user: User) {
    return this.http.post(this.baseUrl + 'update', user);
  }

  queryIdentities(sieve: SieveModel): Observable<IPagedResult<User>> {
    const url = environment.apiBase + "identity";

    let httpParams = new HttpParams();
    if (sieve) {
      Object.keys(sieve).forEach(function (key) {
        httpParams = httpParams.append(key, sieve[key]);
      });
    }

    return this.http.get<IPagedResult<User>>(url, { params: httpParams})
      .pipe(map((res) => {
        this.identities = res;
        console.log(res);
        return res;
      }));
  }

  uploadPackage(data: FormData) {
    const url = environment.apiBase + "identity/upload/package";
    return this.http.post<DataPackageViewModel>(url, data, { reportProgress: true, observe: "events" });
  }

  unlockPackage(model: PackageAuthViewModel) {
    const url = environment.apiBase + "identity/import/package";
    return this.http.post(url, model);
  }
}
