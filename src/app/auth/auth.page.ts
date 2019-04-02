import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLogin = true;

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  onSwitchAuthMode(event) {
    this.isLogin = !this.isLogin;
  }
}
