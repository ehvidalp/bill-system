import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  user!: User[];
  constructor(
    private authService: AuthService,
    private router: Router,
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.user! = this.authService.getLocalStorage()
    const role: boolean = (this.user![0].role === true)? true: false
    console.log(role)
    if(role === true) {
      this.router.navigateByUrl('/reports')
      return true
    }
    else {
      this.router.navigateByUrl('/bills')
      return false
    }
  }

}
