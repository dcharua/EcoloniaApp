
import { Coupon } from './../../shared/models/coupon';
import { FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy,  ViewChild, ElementRef} from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType} from '@capacitor/core';
import { CouponService } from '../../shared/services/coupon.service';
import { map, take, finalize } from 'rxjs/operators';
export interface Location{
  lat: number;
  lng: number;
}


@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.page.html',
  styleUrls: ['./add-coupon.page.scss'],
})
export class AddCouponPage implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  coupon: Coupon = new Coupon();
  form: FormGroup;
  location: Location;
  selectedImage: string;
  usePicker = false;
  minDate: string;
  maxDate: string;

  constructor(
    private route: ActivatedRoute,
    private couponService: CouponService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) ||this.platform.is('desktop')) {
      this.usePicker = true;
    }
    this.minDate =  new Date().toISOString();
    this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString();
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('couponId')) {
        this.loadingCtrl.create({
          message: 'Hablando con la base de datos...'
        }).then(loadingEl => {
          loadingEl.present();
          this.couponService.getCoupon(paramMap.get('couponId')).subscribe(coupon => {
            this.coupon = coupon;
            this.selectedImage = coupon.src;
          });
          loadingEl.dismiss();
        });
      }
    });
  }



  ngOnInit() {
  
  }

  createCoupon(form: NgForm) {
    if (form.valid) {
      if (this.coupon.$key){
        this.editCoupon()
      } else {
        this.loadingCtrl.create({message: 'Creando Cupón...'}).then(loadingEl => {
            loadingEl.present();
            this.coupon.createdOn = new Date().toISOString();
            this.couponService.addCoupon(this.coupon).then(() => {
              loadingEl.dismiss();
              this.alertCtrl.create({
                header: 'Exito!',
                message: 'Se creo el cupón exitosamente',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/admin-coupon']);
                    }
                  }
                ]
              }).then(alertEl => {
                alertEl.present();
              });
            }, err =>{
              loadingEl.dismiss();
              this.alertCtrl.create({
                header: 'Error!',
                message: err,
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/admin-coupon']);
                    }
                  }
                ]
              }).then(alertEl => {
                alertEl.present();
              });
            });
          });
      }
        //If form is not valid
    }  else {
      this.alertCtrl.create({
        header: 'Error!',
        message: 'Llena todos los campos requeridos',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              this.router.navigate(['/admin-coupon']);
            }
          }
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    }
  }

  editCoupon() {
    this.loadingCtrl.create(
      {message: 'Editando Cupón...'}
      ).then(loadingEl => {
        loadingEl.present();
        this.couponService.updateCoupon(this.coupon).then(() => {
          loadingEl.dismiss();
          this.alertCtrl.create({
            header: 'Exito!',
            message: 'Se edito el cupón exitosamente',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/admin-coupon']);
                }
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        }, err =>{
          loadingEl.dismiss();
          this.alertCtrl.create({
            header: 'Error!',
            message: err,
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/admin-coupon']);
                }
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        });
      });
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
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
      const file = this.couponService.uploadIMG(img, this.coupon.title);
      file.task.snapshotChanges().pipe(
        finalize(() => {
          file.ref.getDownloadURL().subscribe(url => {
            this.coupon.src = url;
            loadingEl.dismiss();
          });
        })).subscribe();
      });
  }
}
