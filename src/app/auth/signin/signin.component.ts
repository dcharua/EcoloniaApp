import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../shared/services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../auth.page.scss'],
})
export class SigninComponent implements OnInit {
  user: {
    name: string;
    mail: string;
    mailConfirmation: string;
    password: string;
    passwordConfirmation: string;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  registrar() {
    if (this.user.name, this.user.mail, this.user.mailConfirmation, this.user.password, this.user.passwordConfirmation) {
      if (this.user.mail != this.user.mailConfirmation) {
        console.log("Los correos no coiciden");
        this.showAlert("Los correos no coiciden");
      } else {
        if (!this.authService.validateEmail(this.user.mail)) {
          console.log("Ingresa un mail valido");
        } else {
          if (this.user.password != this.user.passwordConfirmation) {
            console.log("Las contraseñas no coinciden");
          } else {
            console.log("USUARIO REGISTRADO CORRECTAMENTE", this.user.name, this.user.mail, this.user.password);
            this.authService.SignUp(this.user);
            this.user = null;
          }
        }
      }
    } else {
      console.log("Llene todos los campos requeridos");
      this.showAlert("Llene todos los campos requeridos");
    }
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
