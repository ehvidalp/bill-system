import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { SAT } from '@models/sat';

@Injectable({
  providedIn: 'root'
})
export class IvaService {

  url = 'iva';
  ivaCollection: AngularFirestoreCollection<SAT>
  ivaDoc: AngularFirestoreDocument<SAT> | undefined
  iva: Observable<SAT[]> | undefined;

  constructor(
    private dataBase: AngularFirestore,
    private angularFireAuth: AngularFireAuth) {
    this.ivaCollection = this.dataBase.collection(this.url);
  }

  create(iva: SAT): any {
    return this.ivaCollection.add(iva)
  }

  update(id: string, iva: SAT): Promise<void> {
    return this.ivaCollection.doc(id).set(iva)
  }

  get(id: string): Observable<any> {
    this.ivaDoc = this.dataBase.collection(this.url).doc(id)
    return this.ivaDoc.get()
  }

  getAll(): Observable<any> {
    this.iva = this.dataBase.collection(this.url).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as SAT;
          data.id = value.payload.doc.id;
          return data
        })
      })
    )
    return this.iva;
  }

  delete(id: string): Promise<void> {
    this.ivaDoc = this.dataBase.doc(`${this.url}/${id}`)
    return this.ivaDoc.delete()
  }
}
