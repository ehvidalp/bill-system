import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '@services/snackbar.service';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userId: string | undefined;
  addMode: boolean | undefined;
  titleComponent: string | undefined;
  userForm: FormGroup | undefined;
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router,
    private userService: UsersService,
  ) {
    this.builderForm()
  }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.addMode = (this.userId) ? false : true;
    this.titleComponent = (this.addMode) ? 'Nuevo usuario' : 'Editar usuario'

    if (!this.addMode) {
      this.getUser();
    }

  }

  onSubmit() {
    if (!this.userForm!.valid) {
      this.userForm?.markAllAsTouched();
      return
    }

    this.loading = true

    if (this.addMode) this.createUser()
    else this.editUser()

  }

  createUser() {
    this.userService.create(this.userForm!.value).then(() => {
      this.userService.createAccount(this.f!.email.value, 'hexagon').then(() => {
        this.snackbarService.setSuccess({ success: true, message: 'Usuario registrado' })
        this.router.navigateByUrl('/users')
      }).catch((err: any) => {
        console.log(err)
        this.loading = false
        this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error creando el usuario de logeo' })
      })
    }).catch((err: any) => {
      console.log(err)
      this.loading = false
      this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error creando el usuario' })
    })
  }

  editUser() {
    this.userService.update(this.userId!, this.userForm!.value).then(() => {
      this.snackbarService.setSuccess({ success: true, message: 'Usuario actualizado' })
      this.router.navigateByUrl('/users')
    }).catch((err: any) => {
      console.log(err)
      this.loading = false
      this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error actualizando el usuario' })
    })
  }

  getUser() {
    this.userService.get(this.userId!).subscribe(res => {
      this.userForm?.patchValue(res.data())
    }),
      ((err: any) => {
        console.log(err)
      });
  }

  builderForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      secondName: [''],
      surname: ['', Validators.required],
      secondSurname: [''],
      email: ['', [Validators.required, Validators.email]],
      role: [false, Validators.required],
      password: ['']
    })
  }

  get f() {
    return this.userForm?.controls;
  }
}
