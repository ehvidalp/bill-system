import { Injectable } from '@angular/core';
import { Category } from '@models/category';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = 'categories';
  categoryCollection: AngularFirestoreCollection<Category>
  categoryDoc: AngularFirestoreDocument<Category> | undefined
  category: Observable<Category[]> | undefined;

  constructor(
    private dataBase: AngularFirestore,
    private angularFireAuth: AngularFireAuth) {
    this.categoryCollection = this.dataBase.collection(this.url);
  }

  create(category: Category): any {
    return this.categoryCollection.add(category)
  }

  update(id: string, category: Category): Promise<void> {
    return this.categoryCollection.doc(id).set(category)
  }

  get(id: string): Observable<any> {
    this.categoryDoc = this.dataBase.collection(this.url).doc(id)
    return this.categoryDoc.get()
  }

  getAll(): Observable<any> {
    this.category = this.dataBase.collection(this.url).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as Category;
          data.id = value.payload.doc.id;
          return data
        })
      })
    )
    return this.category;
  }

  delete(id: string): Promise<void> {
    this.categoryDoc = this.dataBase.doc(`${this.url}/${id}`)
    return this.categoryDoc.delete()
  }

}
