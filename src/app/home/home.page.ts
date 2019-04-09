import { User } from './../shared/models/user';
import { AuthService } from './../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.getLoggedInUser().then(user => {
      if (user) {
        if (user.admin) {
          this.router.navigate(['/admin-home'])
        } else if (!user.admin) {
          this.router.navigate(['/user-home'])
        }
      } else {
        console.log("There is no user logged");
      }
    })
  }

  ngOnInit() {
  }

}
