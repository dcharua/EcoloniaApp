import { User } from './../../shared/models/user';
import { AuthService } from './../../shared/services/auth.service';
import { UserService } from './../../shared/services/user.service';
import { Coupon } from './../../shared/models/coupon';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { CouponService } from '../../shared/services/coupon.service';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.page.html',
  styleUrls: ['./coupon.page.scss'],
})
export class CouponPage  {
  user: User;
  coupons: Coupon[] = [];
  sub: any;
  subProfile: any;
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private couponService: CouponService,
    private userService: UserService,
    public authService: AuthService,
  ) {}

  ionViewWillEnter(){
    this.loadingCtrl.create({ message: 'Cargando cupones...' }).then(loadingEl => {
      this.authService.getLocalUser().then(data => {
        this.subProfile = this.userService.getUser(data.$key).subscribe(user => {
          this.user = user;
          this.sub = this.couponService.getCoupons().subscribe(coupons => {
            this.coupons = coupons.filter(coupon =>{
              return !this.user.coupons.includes(coupon.$key);
            });
            loadingEl.dismiss();
          });
        });
      });
      loadingEl.present();
    });
  }

  downloadCoupon(coupon: Coupon) {
    if (this.user.points < coupon.cost) {
      this.alertCtrl.create({
        header: 'Error!',
        message: `No tienes los puntos necesarios\n Te faltan ${ coupon.cost - this.user.points } puntos`,
        buttons: [
          {
            text: 'Okay'
          },
        ]
      }).then(alertEl => {
        alertEl.present();
      });
      console.log("");
    } else {
      this.alertCtrl.create({
        header: 'Confirma!',
        message: `¿Quieres comprar este cupon?\n Te restaran ${this.user.points - coupon.cost} puntos`,
        buttons: [
          {
            text: 'Comprar',
            handler: () => {
              this.user.coupons.push(coupon.$key);
              this.user.points -= coupon.cost;
              this.authService.SetLocalEdit(this.user);
              this.userService.updateUser(this.user);
                let a: any = document.createElement('a');
                a.href = coupon.src;
                a.download = coupon.title + '.jpg';
                document.body.appendChild(a);
                a.style = 'display: none';
                a.click();
                a.remove();
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

  ionViewDidLeave() {
    this.sub.unsubscribe();
    this.subProfile.unsubscribe();
  }
}
