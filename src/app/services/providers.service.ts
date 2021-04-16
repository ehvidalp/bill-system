import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Provider } from '@models/provider'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  url = 'providers';
  providersCollection: AngularFirestoreCollection<Provider>
  providerDoc: AngularFirestoreDocument<Provider> | undefined
  provider: Observable<Provider[]> | undefined;

  constructor(
    private dataBase: AngularFirestore,
    private angularFireAuth: AngularFireAuth) {
    this.providersCollection = this.dataBase.collection(this.url);
  }

  create(provider: Provider): any {
    return this.providersCollection.add(provider)
  }

  update(id: string, provider: Provider): Promise<void> {
    return this.providersCollection.doc(id).set(provider)
  }

  get(id: string): Observable<any> {
    this.providerDoc = this.dataBase.collection(this.url).doc(id)
    return this.providerDoc.get()
  }

  getAvailableProvider(nit: string): Observable<any> {
    let isAvailable: boolean = false
    return this.dataBase.collection(this.url, ref => ref.where('nit', '==', nit)).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as Provider;
          if (data!.nit) isAvailable = true
          return isAvailable
        })
      })
    )
  }

  getWithNit(nit: string): Observable<any>{
    return this.dataBase.collection(this.url, ref => ref.where('nit', '==', nit)).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as Provider;
          data.id = value.payload.doc.id
          return data
        })
      })
    )
  }

  getAll(): Observable<any> {
    this.provider = this.dataBase.collection(this.url).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as Provider;
          data.id = value.payload.doc.id;
          return data
        })
      })
    )
    return this.provider;
  }

  delete(id: string): Promise<void> {
    this.providerDoc = this.dataBase.doc(`${this.url}/${id}`)
    return this.providerDoc.delete()
  }
}
