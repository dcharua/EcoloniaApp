import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../shared/services/photo.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  numberPhotos: number = 0;
  numberPhotosToday: number = 0;

  constructor(
    public photoService: PhotoService,
    public authService: AuthService
  ) {
    this.photoService.getPhotos().subscribe((photos) => {
      this.numberPhotos = photos.length;
      const today = new Date();
      photos.forEach((photo, index) => {
        let compare = new Date(photo.createdOn);
        if (compare.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
          // console.log("Uploaded today");
        } else {
          photos.slice(index, 1);
        }
      });
      this.numberPhotosToday = photos.length;
    });
  }

  ngOnInit() {

  }

}
