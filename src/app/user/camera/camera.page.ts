import { Component, OnInit, OnDestroy } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';
import { finalize } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { Router } from "@angular/router";
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

// MODELS
import { User } from './../../shared/models/user';
import { Photo } from './../../shared/models/photo';
import { Tag } from './../../shared/models/tag';

// Services
import { AuthService } from './../../shared/services/auth.service';
import { PhotoService } from './../../shared/services/photo.service';
import { TagService } from './../../shared/services/tag.service'

// CAMERA
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { storage } from 'firebase';


export interface Location {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit, OnDestroy {
  photo: Photo = new Photo();
  user: User = new User();
  tagObject: Tag = new Tag();

  tag: string;
  tags: string[] = [];
  tagsObjects: Tag[] = [];

  sub: any;
  location: Location;
  selectedImage: string;

  constructor(
    public authService: AuthService,
    private photoService: PhotoService,
    private tagService: TagService,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    public router: Router
  ) { }

  ngOnInit() {
    this.tagService.getTags().subscribe((tags) => {
      this.tagsObjects = tags;
      console.log(this.tagsObjects);
    });


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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addTag(tagParam: string) {
    this.tagObject.text = this.tag;
    if (tagParam != '') {
      this.tagObject.text = tagParam;
    }
    this.tags.push(this.tagObject.text);

    this.sub = this.tagService.getExistingTag(this.tagObject.text).pipe(take(1)).subscribe((tags) => {
      if (tags.length === 0) {
        this.tagObject.count = 1;
        this.tagService.addTag(this.tagObject);
      } else {
        tags.forEach((tag) => {
          tag.count += 1;
          this.tagService.updateTag(tag);
        })
      }
    });

    this.tag = '';
  }

  takePhoto() {
    console.log("Take photo");
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

  deleteTag(tagText: string, index: number) {
    this.tags.splice(index, 1);

    this.sub = this.tagService.getExistingTag(tagText).pipe(take(1)).subscribe((tags) => {
      if (tags.length === 0) {
        console.log("There is no tag with that text");
      } else {
        tags.forEach((tag) => {
          tag.count -= 1;
          this.tagService.updateTag(tag);
        })
      }
    });

  }

  onFileChosen(event: Event) {
    this.photo.tags = this.tags;
    console.log(this.photo.tags);
    let date = new Date();
    this.loadingCtrl.create({ message: 'Cargando Imagen...' }).then(loadingEl => {
      loadingEl.present();
      const pickedFile = (event.target as HTMLInputElement).files[0];
      if (!pickedFile) {
        return;
      }
      const file = this.photoService.uploadIMG('this', "title" + date.toString());
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
      console.log(this.photo);
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
    this.ngOnInit();
    this.tags = [];
    this.router.navigate(['/user-profile']);
  }

}
