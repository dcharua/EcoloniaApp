import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getLocalUser().then(data => {
      this.user = data;
      console.log(this.user);
    });
  }
}
