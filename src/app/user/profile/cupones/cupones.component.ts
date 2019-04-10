import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../shared/services/coupon.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Coupon } from './../../../shared/models/coupon';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.scss'],
})

export class CuponesComponent implements OnInit {
  userId: any;
  coupons: Coupon[] = [];

  constructor(
    public couponService: CouponService,
    public authService: AuthService
  ) {
    this.couponService.getCoupons().subscribe((coupons) => {
      this.authService.getLocalUser().then(data => {
        this.userId = data.uid;
      });
      photos.forEach((photo, index) => {
        if (photo.user_id != this.userId) {
          photos.splice(index, 1);
        }
      });
      this.photos = photos;
      console.log(this.photos);
    });
  }

  ngOnInit() { }

}
