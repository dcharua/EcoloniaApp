import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from "../models/user"
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Query } from '@firebase/firestore-types'

@Injectable({
  providedIn: 'root'
})

export class UserService {
  selectedUser: User = new User();
  user: AngularFirestoreDocument<User>;
  users: AngularFirestoreCollection<User>;

  location = {
    lat: null,
    lon: null
  };

  constructor(private db: AngularFirestore) {
    this.getUsers();
  }

  getUsers() {
    this.users = this.db.collection('users');
    return this.users;
  }

  addUser(user: User) {
    return this.users.add({ ...user });
  }

  getUserById(id: string): Observable<User[]> {
    return this.db.collection('users', ref => ref.where('uid', '==', id).limit(1)).snapshotChanges()
      .pipe(map(users => {
        return users.map(a => {
          const data = a.payload.doc.data() as User;
          const $key = a.payload.doc.id;
          return { $key, ...data };
        });
      })
      );
  }

  getUser(key: string) {
    return this.db.collection('users').doc<User>(key).valueChanges().pipe(
      take(1),
      map(user => {
        user.$key = key;
        return user;
      })
    );
  }

  deleteUser(key: string) {
    return this.db.doc('users/' + key).delete();
  }

  updateUser(user: User) {
    const key = user.$key;
    delete user.$key;
    return this.db.collection('users').doc(key).update(user);
  }

  updateUserPoints(userKey, pointsUpdate) {
    var userRef = this.db.collection('users').doc(userKey);
    var updatePoints = userRef.update({ points: pointsUpdate });
    return updatePoints;
  }

  localCoupons: string[] = [];
  updateCoupons(userKey, couponKey) {
    this.getUser(userKey).subscribe(user => {
      this.localCoupons = user.coupons;
      this.localCoupons.push(couponKey);
    });
    var userRef = this.db.collection('users').doc(userKey).update({
      coupons: this.localCoupons
    });
  }

  setLocation(lat, lon) {
    this.location.lat = lat;
    this.location.lon = lon;
  }

  getLoggedUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.getUserById(user.uid);
  }

}
