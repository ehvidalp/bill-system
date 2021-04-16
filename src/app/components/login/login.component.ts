import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errMessage: string | undefined;
  hidePassword = true

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UsersService,
    private router: Router,
  ) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit() {
  }

  onSubmit(){
    if(!this.loginForm.valid) {
      this.loginForm.markAllAsTouched()
      return
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).then( (res) => {
      this.userService.getWithEmail(this.f.email.value).subscribe(
        res => {
          this.authService.createLocalStorage(res)
          this.loading = false;
          this.router.navigateByUrl('')
        },
        (err => {
          console.log(err)
        })
      )

    }).catch( (err) => {
      this.loading = false;
      this.errMessage = 'Usuario o contraseña incorrecta'
    })
  }

  get f(){
    return this.loginForm.controls;
  }
}
