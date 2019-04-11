import { AuthService } from './../../shared/services/auth.service';
import { PhotoService } from './../../shared/services/photo.service';
import { UserService } from './../../shared/services/user.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Photo } from './../../shared/models/photo';
import { User } from './../../shared/models/user';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
})

export class ImagesPage implements OnInit, OnDestroy {
  photos: Photo[] = [];
  photosCheck: Photo[] = [];
  userUpdate: User;
  user: any;
  sub: any;
  sub2: any;

  constructor(
    private loadingCtrl: LoadingController,
    private photoService: PhotoService,
    private userService: UserService,
    public authService: AuthService
  ) {
    this.loadingCtrl.create({ message: 'Get coupons' }).then(loadingEl => {
      loadingEl.present();
      this.sub = this.photoService.getPhotos().subscribe((photos) => {
        photos.forEach((photo, index) => {
          if (photo.points === 0) {
            this.photosCheck.push(photo);
          } else {
          }
        });
        loadingEl.dismiss();
      });
    });

    this.authService.getLocalUser().then(data => {
      this.user = data;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  updatePoints(photoUpdate, index) {
    this.sub2 = this.userService.getUser(photoUpdate.user_id).subscribe((user) => {
      if (user) {
        this.userUpdate = user;
        this.userUpdate.points += photoUpdate.points;
        this.userService.updateUserPoints(this.userUpdate.$key, this.userUpdate.points);
      } else {
        console.log('we didnt found the user');
      }
    });
    this.photoService.updatePhoto(photoUpdate);
    this.photosCheck.splice(index, 1);
    this.sub2.unsubscribe();
  }

  deletePhoto(photo: Photo) {
    this.photoService.deletePhoto(photo.$key).then(succ => {
      console.log("deleted")
    }, (err) => {
      console.log(err)
    });
  }

}
