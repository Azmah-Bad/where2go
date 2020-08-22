import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { tap, shareReplay } from 'rxjs/operators';


const AUTH_API = 'http://127.0.0.1:8000/';

const OBTAIN_TOKEN_URL = AUTH_API.concat('token/');
const REFRESH_TOKEN_URL = AUTH_API.concat('refresh-token/');

const COOKIE_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // http options used for making API calls
  private httpOptions: any;

  // the actual JWT token
  public token: string;

  // the token expiration date
  public token_expires: Date;

  // the username of the logged in user
  public username: string;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient, private cookie: CookieService) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }


  getToken(): string {
    return this.cookie.get(COOKIE_KEY);
  }

  login(username: string, password: string) {
    return this.http
      .post(OBTAIN_TOKEN_URL, {
        username: username,
        password: password,
      })
      .pipe(
        tap((response) => {

          this.cookie.set('token', response.token);
          console.log('token cookie set');
        })
      );
  }



  logout() {
    this.cookie.delete('token')
  }


  isLoggedIn() {
    return this.cookie.check(COOKIE_KEY);
  }

  isLoggedOut() {
    return !this.cookie.check(COOKIE_KEY);
  }
}
