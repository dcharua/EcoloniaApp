
import { Coupon } from './../../shared/models/coupon';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { Plugins, Capacitor,  CameraSource,CameraResultType } from '@capacitor/core';
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

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      return;
    }
    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        this.location = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
      })
      .catch(err => {
       console.log(err);
      });
  }

  onFileChosen(event: Event) {
    this.loadingCtrl.create({message: 'Cargando Imagen...'}).then(loadingEl => {
      loadingEl.present();
        const pickedFile = (event.target as HTMLInputElement).files[0];
        if (!pickedFile) {
          return;
        }
        const file = this.couponService.uploadIMG(pickedFile, this.coupon.title);
        file.task.snapshotChanges().pipe(
          finalize(() => {
            file.ref.getDownloadURL().subscribe(url =>{
              this.coupon.src = url;
              loadingEl.dismiss();
            });
          })).subscribe();
        const fr = new FileReader();
        fr.onload = () => {
          const dataUrl = fr.result.toString();
          this.selectedImage = dataUrl;
        }
        fr.readAsDataURL(pickedFile);

      })
    }
}
