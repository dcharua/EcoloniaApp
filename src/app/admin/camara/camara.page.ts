import { User } from './../../shared/models/user';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { PhotoService } from './../../shared/services/photo.service';
import { Photo } from './../../shared/models/photo';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';
import { finalize } from 'rxjs/operators';

export interface Location {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
})


export class CamaraPage implements OnInit {
  photo: Photo = new Photo();
  user: User = new User();
  tag: string;
  location: Location;
  selectedImage: string;

  constructor(
    public authService: AuthService,
    private photoService: PhotoService,
    private loadingCtrl: LoadingController,
    private toast: ToastController
  ) {
    this.authService.getLoggedInUser().then((user) => {
      this.user = user;
      this.locateUser();
      this.photo.tags = [];
      this.photo.user_id = user.$key;
      this.photo.user_name = user.name;
      this.photo.auth = user.admin;
      this.photo.points = 5;
      this.photo.createdOn = new Date().toISOString();
    });
  }

  ngOnInit() {
  }


  addTag() {
    this.photo.tags.push(this.tag);
    this.tag = '';
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      return;
    }
    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        this.photo.location = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
      })
      .catch(err => {
        console.log(err);
      });
  }


  onFileChosen(event: Event) {
    this.loadingCtrl.create({ message: 'Cargando Imagen...' }).then(loadingEl => {
      loadingEl.present();
      const pickedFile = (event.target as HTMLInputElement).files[0];
      if (!pickedFile) {
        return;
      }
      const file = this.photoService.uploadIMG(pickedFile, "title");
      file.task.snapshotChanges().pipe(
        finalize(() => {
          file.ref.getDownloadURL().subscribe(url => {
            this.photo.src = url;
            loadingEl.dismiss();
          });
        })).subscribe();
      const fr = new FileReader();
      fr.onload = () => {
        const dataUrl = fr.result.toString();
        this.selectedImage = dataUrl;
      }
      fr.readAsDataURL(pickedFile);

    });
  }

  create() {
    this.loadingCtrl.create({ message: 'Creando...' }).then(loadingEl => {
      loadingEl.present();
      this.photoService.addPhoto(this.photo).then(() => {
        this.toast.create({
          message: 'Se subio la imagen exitosamente.',
          duration: 2000
        }).then((toast) => {
          toast.present();
        });
        loadingEl.dismiss();
      });
    });
  }

}
