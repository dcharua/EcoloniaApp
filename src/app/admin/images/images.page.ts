import { AuthService } from './../../shared/services/auth.service';
import { PhotoService } from './../../shared/services/photo.service';
import { UserService } from './../../shared/services/user.service';
import { Photo } from './../../shared/models/photo';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
})

export class ImagesPage implements OnInit {
  photos: Photo[] = [];
  user: any;

  constructor(
    private photoService: PhotoService,
    private userService: UserService,
    public authService: AuthService
  ) {
    this.photoService.getPhotos().subscribe((photos) => {
      console.log(photos);
      photos.forEach((photo, index) => {
        if (photo.points === 0) {
          console.log("no tiene puntos");
        } else {
          photos.splice(index, 1);
        }
      });
      this.photos = photos;
    });
    this.authService.getLocalUser().then(data => {
      this.user = data;
    });
  }

  ngOnInit() {
  }

  updatePoints(photoUpdate, index) {
    this.user.points += photoUpdate.points;
    this.photoService.updatePhoto(photoUpdate);
    this.userService.updateUserPoints(this.user.$key, this.user.points);
    this.photos.splice(index, 1);
  }

  deletePhoto(photo: Photo) {
    this.photoService.deletePhoto(photo.$key).then(succ => {
      console.log("deleted")
    }, (err) => {
      console.log(err)
    });
  }

}
