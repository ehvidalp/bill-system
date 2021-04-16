import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '@models/user'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = 'users';
  userCollection: AngularFirestoreCollection<User>
  userDoc: AngularFirestoreDocument<User> | undefined
  user: Observable<User[]> | undefined;

  constructor(
    private dataBase: AngularFirestore,
    private angularFireAuth: AngularFireAuth) {
    this.userCollection = this.dataBase.collection(this.url);
  }

  create(user: User): any {
    return this.userCollection.add(user)
  }

  createAccount(email: string, password: string){
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  update(id: string, user: User): Promise<void> {
    return this.userCollection.doc(id).set(user)
  }

  get(id: string): Observable<any> {
    this.userDoc = this.dataBase.collection(this.url).doc(id)
    return this.userDoc.get()
  }

  getWithEmail(email: string): Observable<any> {
    return this.dataBase.collection(this.url, ref => ref.where('email', '==', email)).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as User;
          return data
        })
      })
    )
  }

  getAll(): Observable<any> {
    this.user = this.dataBase.collection(this.url).snapshotChanges().pipe(
      map(action => {
        return action.map(value => {
          const data = value.payload.doc.data() as User;
          data.id = value.payload.doc.id;
          return data
        })
      })
    )
    return this.user;
  }

  delete(id: string): Promise<void> {
    this.userDoc = this.dataBase.doc(`${this.url}/${id}`)
    return this.userDoc.delete()
  }

}

