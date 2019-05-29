import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IState } from '../_interfaces/iState';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  stateSource = 'http://locationsng-api.herokuapp.com/api/v1/states';


  constructor(private http: HttpClient) { }

  getNigerianStates(): Observable<IState[]> {
    return this.http.get(this.stateSource)
      .pipe(
        map((res: any) => {
          return res as IState[];
        })
      );
  }
}
