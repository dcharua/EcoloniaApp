import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../../shared/services/photo.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Photo } from './../../../shared/models/photo';

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.scss'],
})
export class ImagenesComponent implements OnInit {
  userId: any;
  photos: Photo[] = [];

  constructor(
    public photoService: PhotoService,
    public authService: AuthService
  ) {
    this.photoService.getPhotos().subscribe((photos) => {
      this.authService.getLocalUser().then(data => {
        this.userId = data.uid;
      });
      photos.forEach((photo, index) => {
        if (photo.user_id != this.userId) {
          photos.splice(index, 1);
        }
      });
      this.photos = photos;
    });

  }

  ngOnInit() {
  }

}
