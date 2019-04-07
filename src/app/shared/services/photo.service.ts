import { Photo } from './../models/photo';
import { Injectable } from '@angular/core';
import { AngularFirestore,  AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
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
     ) {}

  addPhoto(photo: Photo) {
    return this.db.collection('photos').add({...photo});
  }


  getPhoto(key: string): Observable<Photo>{
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
    return this.db.doc('photos/' + key).delete();
  }

  updatePhoto(photo: Photo) {
    const key = photo.$key;
    delete photo.$key;
    return this.db.collection('photos').doc(key).update(photo);
  }

  uploadPhotoFile(event: FileList) {
    // The File object
    const file = event.item(0)
    let task: AngularFireUploadTask;

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      return;
    }

    // The storage path
    const path = `images/${file.name}`;
    const fileRef = this.storage.ref(path)

    // The main task
    task = this.storage.upload(path, file)

    // Get notified when the download URL is available
    return task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          return url;
        });
      })
    )
  }

}