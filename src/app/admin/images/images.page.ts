import { PhotoService } from './../../shared/services/photo.service';
import { Photo } from './../../shared/models/photo';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
})
export class ImagesPage implements OnInit {

  constructor( private photoService: PhotoService) {
   
  }

  ngOnInit() {
  }

  deletePhoto(photo: Photo){
    this.photoService.deletePhoto(photo.$key).then(succ => {
      console.log("deleted")
    }, (err) =>{
      console.log(err)
    });
  }

}
