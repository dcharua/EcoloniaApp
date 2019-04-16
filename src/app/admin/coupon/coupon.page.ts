import { AuthService } from './../../shared/services/auth.service';
import { Coupon } from './../../shared/models/coupon';
import { LoadingController, AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { CouponService } from '../../shared/services/coupon.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.page.html',
  styleUrls: ['./coupon.page.scss'],
})
export class CouponPage  {
  coupons: Coupon[] = [];
  sub: any;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private couponService: CouponService,
    public authService: AuthService
  ) {
    

  }

  ionViewWillEnter() {
    this.loadingCtrl.create({ message: '¿Donde estan?' }).then(loadingEl => {
      loadingEl.present();
      this.sub = this.couponService.getCoupons().subscribe(coupons => {
        this.coupons = coupons;
        loadingEl.dismiss();
      });
    });
  }

  ionViewDidLeave() {
    this.sub.unsubscribe();
  }

  deleteCoupon(coupon: Coupon) {
    this.alertCtrl.create({
      header: 'Confirma!',
      message: 'Estas seguro de borrar este cupón?',
      buttons: [
        {
          text: 'Borrar',
          handler: () => {
            this.couponService.deleteCoupon(coupon).then(() => {

            }, err => {
              this.alertCtrl.create({
                header: 'Error!',
                message: err,
                buttons: [
                  {
                    text: 'Okay'
                  }
                ]
              }).then(alertEl => {
                alertEl.present();
              });
            });
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
