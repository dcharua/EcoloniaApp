import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.page.scss'],
})
export class LoginComponent implements OnInit {
  mail: string;
  password: string;

  constructor() { }

  ngOnInit() { }

  login() {
    console.log(this.mail, this.password);
  }

  change() {
    console.log("He cambiado");
  }

}
