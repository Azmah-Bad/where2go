import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from "./auth.service";
import { CookieService } from 'ngx-cookie-service';



@Injectable({
  providedIn: 'root'
})
export class ManageService {

  CSRF_TOKEN: string = '';

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
}
