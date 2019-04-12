import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Tag } from "../models/tag"
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class TagService {
  newTag: Tag = new Tag();
  tag: AngularFirestoreDocument<Tag>;
  tags: AngularFirestoreCollection<Tag>;

  constructor(
    private db: AngularFirestore
  ) {}

  getTags(): Observable<Tag[]> {
    return this.db.collection('tags').snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Tag;
          const $key = a.payload.doc.id;
          return { $key, ...data };
        });
      })
    );
  }

  addTag(tag: Tag) {
    return this.db.collection('tags').add({ ...tag });
  }

  getTagByText(text: string): Observable<Tag[]> {
    return this.db.collection('tags', ref => ref.where('text', '==', text).limit(1)).snapshotChanges()
      .pipe(map(tags => {
        return tags.map(tag => {
          const data = tag.payload.doc.data() as Tag;
          const $key = tag.payload.doc.id;
          return { $key, ...data };
        });
      })
    );
  }


  getTagByKey(key: string) {
    return this.db.collection('tags').doc<Tag>(key).valueChanges().pipe(
      take(1),
      map(tag => {
        tag.$key = key;
        return tag;
      })
    );
  }

  deleteTag(key: string) {
    return this.db.doc('tags/' + key).delete();
  }

  updateTag(tag: Tag) {
    const key = tag.$key;
    delete tag.$key;
    return this.db.collection('tags').doc(key).update(tag);
  }

  updateTagCounter(tagKey, countUpdate) {
    return this.db.collection('tags').doc(tagKey).update({ count: countUpdate });;

  }

}
