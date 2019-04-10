import { AuthService } from './../../shared/services/auth.service';
import { PhotoService } from './../../shared/services/photo.service';
import { UserService } from './../../shared/services/user.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Photo } from './../../shared/models/photo';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
})

export class ImagesPage implements OnInit, OnDestroy {
  photos: Photo[] = [];
  photosCheck: Photo[] = [];
  user: any;
  sub: any;

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
            // console.log("La foto ya tiene puntos");
          }
        });
        // console.log(this.photosCheck);
        loadingEl.dismiss();
      });
    });

    this.authService.getLocalUser().then(data => {
      this.user = data;
    });
  }

  getUserToUpdate() {

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  updatePoints(photoUpdate, index) {
    console.log(photoUpdate.user_id);
    this.user.points += photoUpdate.points;
    this.photoService.updatePhoto(photoUpdate);
    this.userService.updateUserPoints(this.user.$key, this.user.points);
    this.photosCheck.splice(index, 1);
  }

  deletePhoto(photo: Photo) {
    this.photoService.deletePhoto(photo.$key).then(succ => {
      console.log("deleted")
    }, (err) => {
      console.log(err)
    });
  }

}
