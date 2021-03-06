import { UserService } from './../../shared/services/user.service';
import { User } from './../../shared/models/user';
import { LoadingController, AlertController, ToastController, Platform } from '@ionic/angular';
import { PhotoService } from './../../shared/services/photo.service';
import { Photo } from './../../shared/models/photo';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit, OnDestroy,  ViewChild, ElementRef} from '@angular/core';
import { finalize, take } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Plugins, Capacitor, CameraSource, CameraResultType} from '@capacitor/core';
import { Tag } from 'src/app/shared/models/tag';
import { TagService } from 'src/app/shared/services/tag.service';

export interface Location {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})


export class CameraPage {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  photo: Photo = new Photo();
  user: User = new User();

  tag: Tag = new Tag();
  tags: string[] = [];
  tagsObjects: Tag[] = [];


  location: Location;
  selectedImage: string;
  usePicker = false;
  uploaded = false;
  imgRef: string;
  constructor(
    public authService: AuthService,
    private photoService: PhotoService,
    public router: Router,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private platform: Platform,
    private tagService: TagService,
    private alertController: AlertController
  ) { }

  ionViewWillEnter() {
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) ||this.platform.is('desktop')) {
      this.usePicker = true;
    }

    this.tagService.getTags().pipe(take(1)).subscribe((tags) => {
      this.tagsObjects = tags;
      this.tagsObjects.sort((a,b) => {
        return a.count - b.count;
      });
      this.tagsObjects.reverse();
    });

    this.authService.getLoggedInUser().then((user) => {
      this.user = user;
      this.locateUser();
      this.photo.user_id = user.$key;
      this.photo.user_name = user.name;
      this.photo.auth = user.admin;
      this.photo.points = 5;
      this.photo.createdOn = new Date().toISOString();
    });
  }


  //TAG FUNCTIONS
  addTag(tag: string) {
    tag ?  this.tags.push(tag) :  this.tags.push(this.tag.text);
    this.tag.text = '';
  }


  deleteTag(index: number) {
    this.tags.splice(index, 1);
  }

  uploadTags() {
    this.tags.forEach((tag) =>{
      this.tagService.getTagByText(tag).pipe(take(1)).subscribe((tags) => {
        if (tags[0]) {
          tags[0].count += 1;
          this.tagService.updateTag(tags[0]);
        } else {
          let tagObject = new Tag();
          tagObject.count = 1;
          tagObject.text = tag;
          this.tagService.addTag(tagObject);
        }
      });
    });
  }

  //UPLOAD PHOTO FUNCTIONS
  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 80,
      source: CameraSource.Prompt,
      correctOrientation: true,
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
      this.imgRef = this.photo.user_name + new Date().toString();
      this.photo.imgRef = this.imgRef;
      const file = this.photoService.uploadIMG(img, this.imgRef);
      file.task.snapshotChanges().pipe(
        finalize(() => {
          file.ref.getDownloadURL().subscribe(url => {
            this.photo.src = url;
            loadingEl.dismiss();
            if(this.tags.length > 0) {
              this.alertController.create({
                header: '¿Subir foto?',
                message: 'Deseas subir la foto, o agregar mas tags?',
                buttons: [
                  {
                    text: 'Subir',
                    handler: () => {
                      this.create();
                    }
                  },
                  {
                    text: 'Modificar tags'
                  }
                ]
              }).then(alertEl => {
                alertEl.present();
              });
            }
          });
        })).subscribe();
      });
  }

  // CREATE FUNCTIONS
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
    this.photo.tags = this.tags;
    this.loadingCtrl.create({ message: 'Creando...' }).then(loadingEl => {
      loadingEl.present();
      this.photoService.addPhoto(this.photo).then(() => {
        this.uploaded = true;
        this.toast.create({
          message: 'Se subio la imagen exitosamente.',
          duration: 2000
        }).then((toast) => {
          toast.present();
          this.uploadTags();
          this.user.points += 5;
          this.userService.updateUser(this.user);
          window.setTimeout(() => { this.router.navigate(['/user-profile']); }, 1000);
        });
        loadingEl.dismiss();
      });
    });
  }

  ionViewDidLeave() {
    this.tags = [];
    this.selectedImage = '';
    this.photo = new Photo();
    if (!this.uploaded && this.imgRef){
      this.photoService.deleteIMG(this.imgRef);
    }
  }

}
