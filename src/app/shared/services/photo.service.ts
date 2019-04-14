import { Photo } from './../models/photo';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage'
import { Observable } from 'rxjs';
import { map, take, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  addPhoto(photo: Photo) {
    return this.db.collection('photos').add({ ...photo });
  }

  getPhoto(key: string): Observable<Photo> {
    return this.db.collection('photos').doc<Photo>(key).valueChanges().pipe(
      take(1),
      map(photo => {
        photo.$key = key;
        return photo;
      })
    );
  }

  getPhotos(): Observable<Photo[]> {
    return this.db.collection('photos').snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Photo;
          const $key = a.payload.doc.id;
          return { $key, ...data };
        });
      })
    );
  }


  getAuthPhotos(): Observable<Photo[]> {
    return this.db.collection('photos', ref => ref.where('auth', '==', true)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Photo;
          const $key = a.payload.doc.id;
          return { $key, ...data };
        });
      })
    );
  }

  getUnAuthPhotos(): Observable<Photo[]> {
    return this.db.collection('photos', ref => ref.where('auth', '==', false)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Photo;
          const $key = a.payload.doc.id;
          return { $key, ...data };
        });
      })
    );
  }
  
  

  deletePhoto(photo: Photo) {
    this.deleteIMG(photo.imgRef)
    return this.db.doc('photos/' + photo.$key).delete();
  }

  updatePhoto(photo: Photo) {
    const key = photo.$key;
    delete photo.$key;
    return this.db.collection('photos').doc(key).update(photo);
  }

  uploadIMG(img: string, title: string){
    const filePath = `recolections/${ title ? title : 'sin_titulo' }.jpg`;
    const fileRef = this.storage.ref(filePath);
    const image = 'data:image/jpg;base64,' + img;
    const task = fileRef.putString(image.replace('data:image/jpeg;base64,', ''), 'data_url');
    return {task : task, ref: fileRef};
  }

  deleteIMG(img: string){
    this.storage.ref(`recolections/${img}`).delete();
  }

}
