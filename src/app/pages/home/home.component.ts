import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  readonly BASE_URL = 'http://localhost:3000';
  currentUser = this._authService.getUser$();
  users: Observable<any> = new Observable();
  @Input() authForm!: FormGroup;

  isFormLoading = false;
  isFormSuccess = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    //this.authForm.valueChanges.subscribe(console.log);
    this.redirectAuthorized();
  }

  redirectAuthorized() {
    this.currentUser.subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/browse');
      }
    });
  }

  async submitHandler() {
    if (this.authForm.valid) {
      this.authForm.disable();

      console.log('Sent: ', this.authForm.value);

      //I know
      this.currentUser = this._authService.loginUser(this.authForm.value);

      this.currentUser.subscribe(
        (res) => {
          console.log(res);
          this.redirectAuthorized();
          this.authForm.enable();
        },
        (err) => {
          this.isFormSuccess = false;

          console.error('Form', err);
          this.authForm.enable();
        }
      );
    } else {
      console.error('The form is not valid!');
    }
  }

  getAllUsers() {
    this.users = this.http.get(this.BASE_URL + '/user/all', {
      withCredentials: true,
    });
  }
}
