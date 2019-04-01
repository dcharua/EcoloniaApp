import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../auth.page.scss'],
})
export class SigninComponent implements OnInit {
  name: string;
  mail: string;
  mailConfirmation: string;
  password: string;
  passwordConfirmation: string;

  constructor() { }

  ngOnInit() { }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  registrar() {
    if (this.name, this.mail, this.mailConfirmation, this.password, this.passwordConfirmation) {
      if (this.mail != this.mailConfirmation) {
        console.log("Los correos no coiciden");
      } else {
        if (!this.validateEmail(this.mail)) {
          console.log("Ingresa un mail valido");
        } else {
          if (this.password != this.passwordConfirmation) {
            console.log("Las contraseñas no coinciden");
          } else {
            console.log("USUARIO REGISTRADO CORRECTAMENTE", this.name, this.mail, this.password);
          }
        }
      }
    } else {
      console.log("Llene todos los campos requeridos");
    }
  }

}
