import { AuthService } from './../../../core/auth/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/user/user.entity';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: User | null;
  isMenuOpen: boolean;
  @Input() title: string;

  constructor(authService: AuthService) {
    this.title = 'Title';
    this.currentUser = new User();
    authService.user$.subscribe((u) => {
      this.currentUser = u;
    });
    this.isMenuOpen = false;
  }

  ngOnInit(): void {}
}
