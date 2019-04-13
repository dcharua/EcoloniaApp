import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../shared/services/photo.service';
import { AuthService } from '../../shared/services/auth.service';
import { Tag } from 'src/app/shared/models/tag';
import { TagService } from 'src/app/shared/services/tag.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  numberPhotos: number = 0;
  numberPhotosToday: number = 0;
  tags: Array<Tag>
  constructor(
    public photoService: PhotoService,
    public authService: AuthService,
    private tagService: TagService
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

    this.tagService.getTags().subscribe((tags) => {
      this.tags = tags;
      this.tags.sort((a,b) => {
        return a.count - b.count;
      });
      this.tags.reverse();
    });

  }

  ngOnInit() {

  }

}
