import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { SAT } from '@models/sat';

@Injectable({
  providedIn: 'root'
})
export class IsrService {

  url = 'isr';
  isrCollection: AngularFirestoreCollection<SAT>
  isrDoc: AngularFirestoreDocument<SAT> | undefined
  isr: Observable<SAT[]> | undefined;

  constructor(
    private dataBase: AngularFirestore,
    private angularFireAuth: AngularFireAuth) {
    this.isrCollection = this.dataBase.collection(this.url);
  }

  create(isr: SAT): any {
    return this.isrCollection.add(isr)
  }

  update(id: string, isr: SAT): Promise<void> {
    return this.isrCollection.doc(id).set(isr)
  }

  get(id: string): Observable<any> {
    this.isrDoc = this.dataBase.collection(this.url).doc(id)
    return this.isrDoc.get()
  }

  getAll(): Observable<any> {
    this.isr = this.dataBase.collection(this.url).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as SAT;
          data.id = value.payload.doc.id;
          return data
        })
      })
    )
    return this.isr;
  }

  delete(id: string): Promise<void> {
    this.isrDoc = this.dataBase.doc(`${this.url}/${id}`)
    return this.isrDoc.delete()
  }
}
