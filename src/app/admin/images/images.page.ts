import { AuthService } from './../../shared/services/auth.service';
import { PhotoService } from './../../shared/services/photo.service';
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
    public authService: AuthService
  ) {
    this.photoService.getPhotos().subscribe((photos) => {
      photos.forEach((photo, index) => {
        if (photo.points != 0) {
          photos.splice(index, 1);
        }
      });
      this.photos = photos;
    });

  }

  ngOnInit() {
  }

  updatePoints(photoUpdate, index) {
    this.photoService.updatePhoto(photoUpdate);
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
