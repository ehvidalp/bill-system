import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '@services/snackbar.service';
import { ProvidersService } from '@services/providers.service';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-providers-form',
  templateUrl: './providers-form.component.html',
  styleUrls: ['./providers-form.component.scss']
})
export class ProvidersFormComponent implements OnInit {
  providerId: string | undefined;
  addMode: boolean | undefined;
  titleComponent: string | undefined;
  providerForm: FormGroup | undefined;
  loading = false;
  user: any;
  nitAvailable: boolean | undefined;
  isSubmit = false;
  getNitEdit!: string

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router,
    private providerService: ProvidersService,
    private authService: AuthService,

  ) {
    this.builderForm()
  }

  ngOnInit(): void {
    this.providerId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.addMode = (this.providerId) ? false : true;
    this.titleComponent = (this.addMode) ? 'Nuevo proveedor' : 'Editar proveedor'

    if (!this.addMode) this.getProvider();
    else {
      this.user = this.authService.getLocalStorage()
      this.f!.createdBy.setValue(`${this.user[0].firstName} ${this.user[0].surname}`)
    }

    this.f!.nit.valueChanges.subscribe( (value:string)  => {
      this.providerService.getAvailableProvider(value).subscribe(
        res => {

          const isAvailable = res[0];
          if(this.getNitEdit === value) {
            this.nitAvailable = false
            return
          }

          if (isAvailable) this.nitAvailable = true
          else this.nitAvailable = false
        }
      )
    })
  }

  onSubmit() {
    const nit: string = this.f!.nit.value
    if (!this.providerForm!.valid) {
      this.providerForm?.markAllAsTouched();
      return
    }

    if (this.nitAvailable) return
    this.loading = true
    this.isSubmit = true

    if (this.addMode) this.createProvider()
    else this.editProvider()
  }

  createProvider() {
    this.providerService.create(this.providerForm!.value).then(() => {
      this.loading = false
      this.snackbarService.setSuccess({ success: true, message: 'Proveedor registrado con exito' })
      this.router.navigateByUrl('/providers')
    }).catch((err: any) => {
      console.log(err)
      this.loading = false
      this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error creando el proveedor' })
    })
  }

  editProvider() {
    this.providerService.update(this.providerId!, this.providerForm!.value).then(() => {
      this.snackbarService.setSuccess({ success: true, message: 'Proveedor actualizado con exito' })
      this.router.navigateByUrl('/providers')
    }).catch((err: any) => {
      console.log(err)
      this.loading = false
      this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error actualizando el proveedor' })
    })
  }

  getProvider() {
    this.providerService.get(this.providerId!).subscribe(res => {
      this.providerForm?.patchValue(res.data())
      this.getNitEdit = this.f!.nit.value
    }),
      ((err: any) => {
        console.log(err)
      });
  }

  nitUpperCase(){
    const nit: string = this.f!.nit.value
    this.f!.nit.setValue(nit.toUpperCase())
  }

  builderForm() {
    this.providerForm = this.formBuilder.group({
      businessName: ['', Validators.required],
      createdBy: ['', Validators.required],
      nit: ['', Validators.required],
      smallContributor: [false, Validators.required],
      tradename: ['', [Validators.required]],
      withholdingAgent: [false, Validators.required],
    })
  }

  get f() {
    return this.providerForm?.controls;
  }
}
