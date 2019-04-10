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
      this.photos = photos;
    });

  }



  ngOnInit() {
  }

  deletePhoto(photo: Photo) {
    this.photoService.deletePhoto(photo.$key).then(succ => {
      console.log("deleted")
    }, (err) => {
      console.log(err)
    });
  }

}
