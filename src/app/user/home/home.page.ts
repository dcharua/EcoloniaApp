import { LoadingController } from '@ionic/angular';
import { PhotoService } from '../../shared/services/photo.service';
import { AuthService } from '../../shared/services/auth.service';
import { Tag } from 'src/app/shared/models/tag';
import { TagService } from 'src/app/shared/services/tag.service';
import { environment } from '../../../environments/environment';
import { Component, ViewChild, ElementRef, Renderer2, OnDestroy, Input} from '@angular/core';
import * as MarkerClusterer from "@google/markerclusterer"
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  @ViewChild('map') mapElementRef: ElementRef;
  numberPhotos = 0;
  numberPhotosToday = 0;
  tags: Array<Tag>;
  sub: any;
  sub2: any;
  googleMaps: any;

  constructor(
    private loadingCtrl: LoadingController,
    public photoService: PhotoService,
    public authService: AuthService,
    private tagService: TagService,
    private renderer: Renderer2,
  ) {}

  ionViewWillEnter() {
    this.loadingCtrl.create({ message: 'Regresando de un universo paralelo..' }).then(loadingEl => {
      loadingEl.present();
      this.sub = this.photoService.getPhotos().subscribe((photos) => {
        this.getGoogleMaps()
        .then(googleMaps => {
          this.googleMaps = googleMaps;
          const mapEl = this.mapElementRef.nativeElement;
          const map = new googleMaps.Map(mapEl, {
            center: {lat: 19.4326, lng: -99.1332  },
            zoom: 12
          });
          let markers = [];
          let i = 0;
          photos.forEach(photo => {
            if (photo.location) {
              markers[i++] = new googleMaps.Marker({
                position: photo.location,
                map: map,
                title: 'Recoleccion',
              });
            }
          })
          var markerCluster = new MarkerClusterer(map, markers, {imagePath: '/assets/icon/m'})}) .catch(err => {
            console.log(err);
          });

        this.numberPhotosToday = 0;
        this.numberPhotos = photos.length;
        const today = new Date();
        photos.forEach((photo, index) => {
          let compare = new Date(photo.createdOn);
          if (compare.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
            this.numberPhotosToday++;
          } else {
            photos.slice(index, 1);
          }
        });
        loadingEl.dismiss();
      });

      this.sub2 = this.tagService.getTags().subscribe((tags) => {
        this.tags = tags;
        this.tags.sort((a,b) => {
          return a.count - b.count;
        });
        this.tags.reverse();
      });
   
    });
  }


  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }

  ionViewDidLeave() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}
