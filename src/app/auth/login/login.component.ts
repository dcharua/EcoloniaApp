import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from './../../shared/services/auth.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.page.scss'],
})
export class LoginComponent implements OnInit {
  @Output() emitLogin = new EventEmitter<boolean>();
  public user: User = new User();


  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() { }

  login() {
    this.authService.SignIn(this.user);
  }

  changeLogin() {
    this.emitLogin.emit(true);
  }

}
