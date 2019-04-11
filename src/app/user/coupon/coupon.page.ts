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
export class CouponPage implements OnInit, OnDestroy {
  user: any;
  coupons: Coupon[] = [];
  sub: any;
  subProfile: any;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private couponService: CouponService,
    private userService: UserService,
    public authService: AuthService
  ) {
    this.loadingCtrl.create({ message: '¿Donde estan?' }).then(loadingEl => {
      loadingEl.present();
      this.sub = this.couponService.getCoupons().subscribe(coupons => {
        this.coupons = coupons;
        loadingEl.dismiss();
      });
    });
  }

  ngOnInit() {
    this.authService.getLocalUser().then(data => {
      this.subProfile = this.userService.getUser(data.$key).subscribe(user => {
        this.user = user;
      });
    });
  }

  downloadCoupon(coupon) {
    if (this.user.points < coupon.cost) {
      console.log("No tienes los puntos necesarios");
    } else {
      this.user.coupons.push(coupon.$key);
      this.user.points -= coupon.cost;
      this.authService.SetLocalEdit(this.user);
      this.userService.updateUser(this.user);
    }
    this.ngOnInit();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subProfile.unsubscribe();
  }
}
