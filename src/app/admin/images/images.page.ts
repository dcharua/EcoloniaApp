import { AuthService } from './../../shared/services/auth.service';
import { PhotoService } from './../../shared/services/photo.service';
import { UserService } from './../../shared/services/user.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Photo } from './../../shared/models/photo';
import { Tag } from './../../shared/models/tag';
import { Component } from '@angular/core';
import {take} from 'rxjs/operators'
@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
})

export class ImagesPage  {
  photosChecked: Photo[] = [];
  photosCheck: Photo[] = [];
  tagToCheck: Tag;
  images = 1;

  user: any;
  sub: any;
  sub2: any;

  constructor(
    private loadingCtrl: LoadingController,
    private photoService: PhotoService,
    private userService: UserService,
    public authService: AuthService,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.loadingCtrl.create({ message: 'Estoy pensando..' }).then(loadingEl => {
      loadingEl.present();
      this.sub = this.photoService.getUnAuthPhotos().subscribe((photos) => {
        this.photosCheck = photos;
        this.sub2 = this.photoService.getAuthPhotos().subscribe((photos) => {
          this.photosChecked = photos;
          loadingEl.dismiss();
        });
      });
    });

    this.authService.getLocalUser().then(data => {
      this.user = data;
    });
  }


  viewImages(number) {
    this.images = number;
  }

  authPhoto(photo) {
    photo.auth = true;
    this.userService.getUser(photo.user_id).pipe(take(1)).subscribe((user) => {
      if (user) {
        user.points += photo.points;
        this.userService.updateUserPoints(user);
      } else {
        console.log('we didnt found the user');
      }
    });
    this.photoService.updatePhoto(photo);
  }
  
  deletePhoto(photo: Photo) {
    this.alertController.create({
      header: 'Confirma!',
      message: 'Estas seguro de borrar esta imagen?',
      buttons: [
        {
          text: 'Borrar',
          handler: () => {
            this.photoService.deletePhoto(photo).then(succ => {
              console.log("deleted")
            }, (err) => {
              console.log(err)
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

  updateTag(photo:Photo, e: any, i: number){
    photo.tags[i] = e.srcElement.value;
  }

  ionViewDidLeave() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}
