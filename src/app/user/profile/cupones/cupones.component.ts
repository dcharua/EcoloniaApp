import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../shared/services/coupon.service';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { Coupon } from './../../../shared/models/coupon';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.scss'],
})

export class CuponesComponent implements OnInit {
  user: any;
  userKey: any;
  couponsUser: Coupon[] = [];

  constructor(
    public couponService: CouponService,
    public authService: AuthService,
    public userService: UserService
  ) {
    this.couponService.getCoupons().subscribe((coupons) => {
      this.authService.getLocalUser().then(data => {
        this.userService.getUser(data.$key).subscribe(user => {
          this.user = user;
          coupons.forEach((couponOfAll, indexAll) => {
            this.user.coupons.forEach((couponOfUser, indexUser) => {
              if (couponOfAll.$key === couponOfUser) {
                this.couponsUser.push(couponOfAll);
              } else {
                coupons.slice(indexAll, 1);
              }
            });
          });
        });
      });
    });
  }

  ngOnInit() { }

}
