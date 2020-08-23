import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from "./auth.service";
import { CookieService } from 'ngx-cookie-service';
import { Relationship } from '../interfaces/relationship';



@Injectable({
  providedIn: 'root'
})
export class ManageService {
  CSRF_TOKEN: string = '';
  API = "http://localhost:8000/api/relationships/"

  constructor(
    private _auth: AuthService,
    private http: HttpClient,
  ) {}


  test() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this._auth.getToken(),
      }),
      // withCredentials:true,
    };
    console.log(this._auth.getToken());

    return this.http.post('http://127.0.0.1:8000/test/',{}, httpOptions);
  }

  isLoggedIn() {
    return this._auth.isLoggedIn();
  }

  /**
   * submits a relationship to the server
   */
  submit(relationship: Relationship) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this._auth.getToken(),
      }),
      // withCredentials:true,
    };
    relationship.toISOname();

    return this.http.post<Relationship>(this.API,relationship,httpOptions)
  }

}
