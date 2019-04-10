import { AuthService } from './../../shared/services/auth.service';
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
  coupons: Coupon[] = [];
  sub: any;
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private couponService: CouponService,
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
  }

  downloadCoupon(couponKey) {
    console.log(couponKey);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
