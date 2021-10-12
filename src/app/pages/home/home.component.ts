import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import URL from 'src/app/core/consts/url';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentUser$ = this._authService.user$;
  users: Observable<any> = new Observable();
  @Input() authForm!: FormGroup;

  isFormLoading = false;
  isFormSuccess = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private _authService: AuthService
  ) {
    this.currentUser$.subscribe((data) => {
      if (data) {
        this.router.navigateByUrl('/browse');
      }
    });
  }

  ngOnInit(): void {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    //this.authForm.valueChanges.subscribe(console.log);
  }

  async submitHandler() {
    if (this.authForm.valid) {
      this.authForm.disable();

      console.log('Sent', this.authForm.value);

      this._authService.loginUser(this.authForm.value).subscribe(
        (res) => {
          console.log('Received User', res);
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
    this.users = this.http.get(URL.BASE + '/user/all', {
      withCredentials: true,
    });
  }
}
