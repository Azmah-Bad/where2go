import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service'
import {Router} from "@angular/router"

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
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this._authService.login(this.form.value.username, this.form.value.password).subscribe(
      (resp) => {
        console.log(resp);
        this.router.navigate(['manage/']);
      }
    );

  }


  logout() {
    this._authService.logout();
  }

}
