import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() emitLogin = new EventEmitter<boolean>();

  public user: User = new User();
  public passwordConfirmation: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loading: LoadingController
  ) { }

  ngOnInit() { }

  registrar() {
    if (this.user.name, this.user.email,this.user.password, this.passwordConfirmation) {
      if (!this.authService.validateEmail(this.user.email)) {
        this.showAlert("Error", "Ingresa un mail valido");
        return;
      }
      if (this.user.password != this.passwordConfirmation) {
        this.showAlert("Error", "Las contraseñas no coinciden");
        return;
      }
      this.loading.create({message: 'Registrando...'}).then(loadingEl => {
        loadingEl.present();
        this.authService.SignUp(this.user).then(() => {loadingEl.dismiss()})
      });
    } else {
      this.showAlert("Error", "Llene todos los campos requeridos");
    }
  }


  private showAlert(title: string, message: string) {
    this.alertCtrl
      .create({
        header: title,
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  changeLogin() {
    this.emitLogin.emit(true);
  }

}
