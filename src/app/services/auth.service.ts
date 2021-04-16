import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import { User } from '@models/user';
import { Auth } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  nameLocalStorage: string = 'HexagonUser'

  constructor(
    private angularFireAuth: AngularFireAuth
  ) { }

  create(auth: Auth){
    return this.angularFireAuth.createUserWithEmailAndPassword(auth.email, auth.password)
  }

  login(auth: Auth) {
    return this.angularFireAuth.signInWithEmailAndPassword(auth.email, auth.password);
  }

  logout() {
    return this.angularFireAuth.signOut();
  }

  hasUser() {
    return this.angularFireAuth.authState;
  }

  createLocalStorage(user: User){
    localStorage.setItem(this.nameLocalStorage, JSON.stringify(user));
  }

  getLocalStorage(){
    return JSON.parse(localStorage.getItem(this.nameLocalStorage)!);
  }

  deleteLocalStorage(){
    localStorage.removeItem(`${this.nameLocalStorage}`)
  }

}
