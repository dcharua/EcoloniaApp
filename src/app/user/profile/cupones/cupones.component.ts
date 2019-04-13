import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../shared/services/coupon.service';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { Coupon } from './../../../shared/models/coupon';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.scss'],
})

export class CuponesComponent implements OnInit {
  user: any;
  userKey: any;
  couponsUser: Coupon[] = [];
  web = false;

  constructor(
    public couponService: CouponService,
    public authService: AuthService,
    public userService: UserService,
    private transfer: FileTransfer,
    private file: File,
    private platform: Platform
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

  ngOnInit() { 
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) ||this.platform.is('desktop')) {
      this.web = true;
    }
  }



  downloadCoupon(coupon: Coupon) {
    if (this.web) {
      let a: any = document.createElement('a');
      a.href = coupon.src;
      a.download = coupon.title + '.jpg';
      document.body.appendChild(a);
      a.click();
      a.style = 'display: none';
      a.remove();
    } else {
      this.transfer.create().download(coupon.src, this.file.dataDirectory + coupon.title + '.jpg');
    }
  }
}
