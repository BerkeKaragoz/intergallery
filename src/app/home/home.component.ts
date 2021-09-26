import { AuthService } from './../auth/auth.service';
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
  currentUser = this._authService.getUser();
  users: Observable<any> = new Observable();
  @Input() authForm!: FormGroup;

  isFormLoading = false;
  isFormSuccess = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    //this.authForm.valueChanges.subscribe(console.log);
  }

  async submitHandler() {
    if (this.authForm.valid) {
      this.isFormLoading = true;

      const formValue = this.authForm.value;

      try {
        this.isFormSuccess = true;
        console.log('Sent: ', formValue);

        this.currentUser = this._authService.loginUser(formValue);

        console.log(this.currentUser);
      } catch (err) {
        this.isFormSuccess = false;
        console.error(err);
      }

      this.isFormLoading = false;
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
