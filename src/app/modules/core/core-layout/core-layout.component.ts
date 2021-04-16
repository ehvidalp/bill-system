import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Snackbar } from '@models/snackbar';
import { SnackbarService } from '@services/snackbar.service';
import { User } from '@models/user';

@Component({
  selector: 'app-core-layout',
  templateUrl: './core-layout.component.html',
  styleUrls: ['./core-layout.component.scss']
})
export class CoreLayoutComponent implements OnInit {
  snackbar: Snackbar | undefined
  role!: boolean

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {
    this.snackbarService.isSuccess$.subscribe(
      (res: Snackbar) => {
        if (res.success === true || res.success === false) {
          this.snackbar = res
          setTimeout(() => {
            this.snackbar = undefined
          }, 5000);
        }
      });
  }

  ngOnInit(): void {
    const user: User[] = this.authService.getLocalStorage()
    this.role = user[0].role
    this.router.navigateByUrl('/bills')


  }

  logOut() {
    this.authService.logout().then(() => {
      this.authService.deleteLocalStorage()
      this.router.navigate(['login'])
    })
  }

}
