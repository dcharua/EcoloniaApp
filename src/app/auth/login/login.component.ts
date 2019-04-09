import { LoadingController } from '@ionic/angular';
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
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  login() {
    this.loadingCtrl.create({message: 'Redirigiendo...'}).then(loadingEl => {
      loadingEl.present();
      this.authService.SignIn(this.user).then(() => {
        loadingEl.dismiss();
      });
    });
   
  }

  changeLogin() {
    this.emitLogin.emit(true);
  }

}
