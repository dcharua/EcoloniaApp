import { AuthService } from './../../shared/services/auth.service';
import { UserService } from './../../shared/services/user.service';
import { Coupon } from './../../shared/models/coupon';
import { LoadingController, AlertController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CouponService } from '../../shared/services/coupon.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.page.html',
  styleUrls: ['./coupon.page.scss'],
})
export class CouponPage implements OnInit {
  user: any;
  coupons: Coupon[] = [];
  sub: any;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private couponService: CouponService,
    private userService: UserService,
    public authService: AuthService
  ) {
    this.authService.getLocalUser().then(data => {
      this.userService.getUser(data.$key).subscribe(user => {
        this.user = user;
      });
    });

    this.loadingCtrl.create({ message: '¿Donde estan?' }).then(loadingEl => {
      loadingEl.present();
      this.sub = this.couponService.getCoupons().subscribe(coupons => {
        this.coupons = coupons;
        loadingEl.dismiss();
      });
    });
  }

  ngOnInit() {
  }

  // CHECK IF THE USER HAS POINTS TO CONSUME AND THE QUERY OF THE ARRAY TO UPLOAD CORRECTLY THE KEY OF THE COUPON

  downloadCoupon(couponKey) {
    this.userService.updateCoupons(this.user.$key, couponKey);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
