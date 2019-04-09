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

  progress: any;  // Observable 0 to 100

  image: string; // base64
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

  deleteCoupon(key: string) {
    return this.db.doc('coupons/' + key).delete();
  }

  updateCoupon(coupon: Coupon) {
    const key = coupon.$key;
    delete coupon.$key;
    return this.db.collection('coupons').doc(key).update(coupon);
  }

  uploadIMG(img: File, title: string){
    var subject = new Subject<string>();
    const filePath = `/coupons/${ title ? title : 'sin_titulo' }.jpg`;
    const fileRef = this.storage.ref(filePath);
    const image = 'data:image/jpg;base64,' + img;
    const task = this.storage.upload(filePath, img);
    return {task : task, ref: fileRef};
  }

}