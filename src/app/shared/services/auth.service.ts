import { AlertController, LoadingController } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';
import { User } from '../models/user';
import * as moment from "moment";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { UserService } from './user.service'
import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: firebase.User = null;// Save logged in user data
  user: Observable<firebase.User>;
  loggedUser;
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private userService: UserService,
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private alertCtrl: AlertController,
    private loading: LoadingController
  ) { }

  // Sign in with email/password
  SignIn(data) {
    return this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password)
      .then((result) => {
        this.userService.getUserById(result.user.uid)
          .subscribe((users) => {
            const user: User = users[0];
            this.SetLocal(user);
            if (user.admin) {
              this.ngZone.run(() => {
                this.router.navigate(['/admin-home']);
              });
            } else {
              this.ngZone.run(() => {
                this.router.navigate(['/user-home']);
              });
            }
          });
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(data) {
    const user: User = new User();
    user.name = data.name;
    return this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password)
      .then((res) => {
        user.email = res.user.email;
        user.uid = res.user.uid;
        user.admin = false;
        user.createdOn = moment().format('MMMM Do YYYY');
        this.userService.addUser(user).then((docRef) => {
          user.$key = docRef.id;
          console.log("Document successfully written!");
          this.SetLocal(user);
          this.getLoggedInUser();
          this.router.navigate(['/user-home']);
        })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });;
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  SetLocal(user: User) {
    console.log(user);
    Plugins.Storage.set({ key: 'user', value: JSON.stringify(user) });
  }

  // Reset Forgot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Returns true when user is logged
  async isLogged() {
    const user = await this.getLocalUser();
    return (user !== null) ? true : false;
  }

  // Returns true when user is admin
  async isAdmin() {
    const user = await this.getLocalUser();
    return user.admin;
  }

  getLocalUser() {
    return Plugins.Storage.get({ key: 'user' }).then(data => {
      let user = JSON.parse(data.value) as User;
      return user;
    });
  }

  // Sign out
  SignOut() {
    this.alertCtrl.create({
      header: 'Confirma!',
      message: 'Estas seguro de cerrar sesion?',
      buttons: [
        {
          text: 'Salir',
          handler: () => {
            this.afAuth.auth.signOut().then(() => {
              Plugins.Storage.remove({ key: 'user' });
              this.router.navigate(['/auth']);
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

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  getLoggedInUser(): Promise<User> {
    const user = this.getLocalUser();
    return user;
  }
}
