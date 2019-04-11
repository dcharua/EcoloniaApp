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

  deletePhoto(key: string) {
    return this.db.doc('/recolections/' + key).delete();
  }

  updatePhoto(photo: Photo) {
    const key = photo.$key;
    delete photo.$key;
    return this.db.collection('photos').doc(key).update(photo);
  }

  uploadIMG(img: File, title: string) {
    const filePath = `/recolections/${title ? title : 'sin_titulo'}.jpg`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, img);
    return { task: task, ref: fileRef };
  }

}
