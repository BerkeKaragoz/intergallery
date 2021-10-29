import { UserAuth } from './../../core/user/user.entity';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import URL from 'src/app/core/consts/url';
import sameValidatorFactory from 'src/app/core/form/validator/same.validator';
import { Location } from '@angular/common';

enum ModalTab {
  LOGIN = 0,
  REGISTER = 1,
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentUser$ = this._authService.user$;
  users: Observable<any> = new Observable();
  @Input() loginForm!: FormGroup;
  @Input() registerForm!: FormGroup;

  modalTab = ModalTab.LOGIN;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private _authService: AuthService
  ) {
    this.currentUser$.subscribe((data) => {
      if (data) {
        this.router.navigateByUrl('/browse');
      }
    });

    switch (router.url.substr(1).toUpperCase()) {
      case ModalTab[ModalTab.REGISTER]:
        this.modalTab = ModalTab.REGISTER;
        break;
      default:
        this.modalTab = ModalTab.LOGIN;
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: sameValidatorFactory('password', 'confirmPassword') }
    );

    //this.authForm.valueChanges.subscribe(console.log);
  }

  async loginHandler() {
    if (this.loginForm.valid) {
      this.loginForm.disable();

      console.log('Sent', this.loginForm.value);

      this._authService.loginUser(this.loginForm.value).subscribe(
        (res) => {
          console.log('Received User', res);
          this.loginForm.enable();
        },
        (err) => {
          console.error('Form', err);
          this.loginForm.enable();
        }
      );
    } else {
      console.error('The form is not valid!');
    }
  }

  async registerHandler() {
    if (this.registerForm.valid) {
      this.registerForm.disable();

      console.log('Sent', this.registerForm.value);

      const newUser: UserAuth = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
      };

      this._authService.registerUser(newUser).subscribe(
        (res) => {
          console.log('Received User', res);
          this.registerForm.enable();
        },
        (err) => {
          console.error('Form', err);
          this.registerForm.enable();
        }
      );
    } else {
      console.error('The form is not valid!');
    }
  }

  getAllUsers() {
    this.users = this.http.get(URL.BASE + '/user/all', {
      withCredentials: true,
    });
  }

  goToRegister() {
    this.location.replaceState('/register');
    this.modalTab = ModalTab.REGISTER;
  }

  goToLogin() {
    this.location.replaceState('/login');
    this.modalTab = ModalTab.LOGIN;
  }
}
