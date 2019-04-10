import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  viewCupones: boolean = false;
  viewImagenes: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.authService.getLocalUser().then(data => {
      this.userService.getUser(data.$key).subscribe(user => {
        this.user = user;
      });
    });
  }

  cupones() {
    if (this.viewCupones) {
      this.viewCupones = false;
    } else {
      this.viewCupones = true;
    }
  }

  imagenes() {
    if (this.viewImagenes) {
      this.viewImagenes = false;
    } else {
      this.viewImagenes = true;
    }
  }

  logout() {
    this.authService.SignOut();
  }


}
