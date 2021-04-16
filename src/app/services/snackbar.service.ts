import { Injectable } from '@angular/core';
import { Snackbar } from '@models/snackbar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  snackbarConfig: Snackbar | undefined

  private snackbar = new BehaviorSubject<any>({})
  isSuccess$ = this.snackbar.asObservable()

  constructor() { }

  setSuccess(config: Snackbar) {
    this.snackbarConfig = config
    this.snackbar.next(this.snackbarConfig)
  }

}
