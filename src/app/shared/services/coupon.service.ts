import { Coupon } from './../models/coupon';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(private db: AngularFirestore ) {}

  addCoupon(coupon: Coupon) {
    return this.db.collection('coupons').add({...coupon});
  }


  getCoupon(key: string): Observable<Coupon>{
    return this.db.collection('coupons').doc<Coupon>(key).valueChanges().pipe(
      take(1),
      map(coupon => {
        coupon.$key = key;
        return coupon;
      })
    );
  }

  getCoupons(): Observable<Coupon[]> {
    return this.db.collection('coupons').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Coupon;
          const $key = a.payload.doc.id;
          return { $key, ...data };
        });
      })
    );
  }

  deleteCoupon(key: string) {
    return this.db.doc('coupons/' + key).delete();
  }

  updateCoupon(coupon: Coupon) {
    const key = coupon.$key;
    delete coupon.$key;
    return this.db.collection('coupons').doc(key).update(coupon);
  }

}