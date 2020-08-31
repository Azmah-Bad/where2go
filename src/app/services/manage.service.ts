import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Relationship } from '../interfaces/relationship';
import { map, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ManageService {
  CSRF_TOKEN: string = '';
  API = 'http://localhost:8000/api/relationships/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + this._auth.getToken(),
    }),
    // withCredentials:true,
  };

  constructor(private _auth: AuthService, private http: HttpClient) {}

  test() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this._auth.getToken(),
      }),
      // withCredentials:true,
    };
    console.log(this._auth.getToken());

    return this.http.post('http://127.0.0.1:8000/test/', {}, this.httpOptions);
  }

  isLoggedIn() {
    return this._auth.isLoggedIn();
  }

  logout() {
    return this._auth.logout(this.httpOptions);
  }

  /**
   * submits a relationship to the server
   */
  submit(relationship: Relationship) {
    relationship.toISOname();

    return this.http
      .post<Relationship>(this.API, relationship, this.httpOptions)
      .pipe(
        map((resp) => {
          return resp == relationship;
        }),
        catchError((_) => of(false))
      );
  }

  delete(relationship: Relationship) {
    relationship.toISOname();
    return this.http.delete(
      this.API +
        `?departure_country=${relationship.departure_country}&arrival_country=${relationship.arrival_country}`,
      this.httpOptions
    );
  }

  /**
   * fetch relationship from backend
   */
  getRelationship(country: string): Observable<Relationship[]> {
    let iso = Relationship.countryNameToISO(country);
    return this.http
      .get<QueryResult>(
        this.addQueryParam({ departure_country: iso }),
        this.httpOptions
      )
      .pipe(map<QueryResult, Relationship[]>((res) => res.results));
  }

  addQueryParam(queryParams: { departure_country: string }): string {
    return this.API + '?departure_country=' + queryParams.departure_country;
  }
}

export interface QueryResult {
  count: number;
  next: string;
  previous: string;
  results: Relationship[];
}
