import { Coupon } from './../models/coupon';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map, take, finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class CouponService {

  task: AngularFireUploadTask;
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage 
  ) {}

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

  deleteCoupon(coupon: Coupon) {
    this.deleteIMG(coupon.title);
    return this.db.doc('coupons/' + coupon.$key).delete();
  }

  updateCoupon(coupon: Coupon) {
    const key = coupon.$key;
    delete coupon.$key;
    return this.db.collection('coupons').doc(key).update(coupon);
  }

  uploadIMG(img: string, title: string){
    const filePath = `coupons/${ title ? title : 'sin_titulo' }.jpg`;
    const fileRef = this.storage.ref(filePath);
    const image = 'data:image/jpg;base64,' + img;
    const task = fileRef.putString(image.replace('data:image/jpeg;base64,', ''), 'data_url');
    return {task : task, ref: fileRef};
  }

  deleteIMG(img: string){
    this.storage.ref(`coupons/${img}.jpg`).delete();
  }

}