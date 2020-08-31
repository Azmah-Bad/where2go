import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service'
import {Router} from "@angular/router"
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this._authService.login(this.form.value.username, this.form.value.password).pipe(
      tap(
        _ => {
          this._snackBar.open("Logged in 🎉", "dismiss", { duration: 2000, })
          this.router.navigate(['manage/']);
        }
      ),
      catchError(_ => {
        this._snackBar.open("Authentification failed", "dismiss", { duration: 2000, });
        return of()
      })
    ).subscribe();

  }


}
