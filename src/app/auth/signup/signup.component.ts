import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../shared/services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.page.scss'],
})
export class SignupComponent implements OnInit {
  public user: User = new User();
  public mailConfirmation: string;
  public passwordConfirmation: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  registrar() {
    if (this.user.name, this.user.email, this.mailConfirmation, this.user.password, this.passwordConfirmation) {
      if (this.user.email != this.mailConfirmation) {
        this.showAlert("Los correos no coiciden");
      } else {
        if (!this.authService.validateEmail(this.user.email)) {
          this.showAlert("Ingresa un mail valido");
        } else {
          if (this.user.password != this.passwordConfirmation) {
            this.showAlert("Las contraseñas no coinciden");
          } else {
            this.showAlert("USUARIO REGISTRADO CORRECTAMENTE!");
            // console.log("USUARIO REGISTRADO CORRECTAMENTE", this.user.name, this.user.email, this.user.password);
            this.authService.SignUp(this.user);
            this.user.name = "";
            this.user.email = "";
            this.user.password = "";
            this.mailConfirmation = "";
            this.passwordConfirmation = "";
          }
        }
      }
    } else {
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
