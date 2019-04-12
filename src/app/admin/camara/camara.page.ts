import { User } from './../../shared/models/user';
import { LoadingController, AlertController, ToastController, Platform } from '@ionic/angular';
import { PhotoService } from './../../shared/services/photo.service';
import { Photo } from './../../shared/models/photo';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit, OnDestroy,  ViewChild, ElementRef} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Plugins, Capacitor, CameraSource, CameraResultType} from '@capacitor/core';

export interface Location {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
})


export class CamaraPage implements OnInit, OnDestroy {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  photo: Photo = new Photo();
  user: User = new User();
  tag: string;
  tags: string[] = [];
  location: Location;
  selectedImage: string;
  usePicker = false;
  uploaded = false;
  imgRef: string;
  constructor(
    public authService: AuthService,
    private photoService: PhotoService,
    public router: Router,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) ||this.platform.is('desktop')) {
      this.usePicker = true;
    }
    this.authService.getLoggedInUser().then((user) => {
      this.user = user;
      this.locateUser();
      this.photo.user_id = user.$key;
      this.photo.user_name = user.name;
      this.photo.auth = user.admin;
      this.photo.points = 0;
      this.photo.createdOn = new Date().toISOString();
    });
  }


  addTag() {
    this.tags.push(this.tag);
    this.tag = '';
  }
  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 80,
      source: CameraSource.Prompt,
      correctOrientation: true,
      // height: 320,
      width: 600,
      resultType: CameraResultType.Base64
    })
      .then(image => {
        this.uploadImg(image.base64Data);
      })
      .catch(error => {
        console.log(error);
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.uploadImg(dataUrl);
    };
    fr.readAsDataURL(pickedFile);
  }

  uploadImg(img: string){
    this.selectedImage = img;
    this.loadingCtrl.create({ message: 'Cargando Imagen...' }).then(loadingEl => {
      loadingEl.present();
      this.imgRef = this.photo.user_name + new Date().toString()
      const file = this.photoService.uploadIMG(img, this.imgRef);
      file.task.snapshotChanges().pipe(
        finalize(() => {
          file.ref.getDownloadURL().subscribe(url => {
            this.photo.src = url;
            loadingEl.dismiss();
          });
        })).subscribe();
      });
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


  create() {
    this.loadingCtrl.create({ message: 'Creando...' }).then(loadingEl => {
      loadingEl.present();
      this.photoService.addPhoto(this.photo).then(() => {
        this.uploaded = true;
        this.toast.create({
          message: 'Se subio la imagen exitosamente.',
          duration: 2000
        }).then((toast) => {
          toast.present();
        });
        loadingEl.dismiss();
      });
    });
    this.ngOnInit();
    this.tags = [];
    this.router.navigate(['/admin-images']);
  }

  ngOnDestroy() {
    if (!this.uploaded && this.imgRef){
      this.photoService.deletePhoto(this.imgRef);
    }
  }

}
