import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { IvaService } from '@services/iva.service';
import { SnackbarService } from '@services/snackbar.service';
import { IsrService } from '@services/isr.service';

@Component({
  selector: 'app-sat-form',
  templateUrl: './sat-form.component.html',
  styleUrls: ['./sat-form.component.scss']
})
export class SatFormComponent implements OnInit {

  satFormId: string | undefined;
  addMode: boolean | undefined;
  isIva: boolean | undefined;
  titleComponent: string | undefined;
  satForm: FormGroup | undefined;
  loading = false;
  user: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router,
    private ivaService: IvaService,
    private isrService: IsrService,
    private authService: AuthService,
  ) {
    this.builderForm()
   }

  ngOnInit(): void {
    this.isIva = (this.activatedRoute.snapshot.queryParams.form! === 'iva') ? true : false
    this.satFormId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.addMode = (this.satFormId) ? false : true;
    this.titleComponent = (this.addMode) ? 'Nuevo Formulario' : 'Editar Formulario'

    if (!this.addMode) this.getSatForm()
    else {
      this.user = this.authService.getLocalStorage()
      this.f!.createdBy.setValue(`${this.user[0].firstName} ${this.user[0].surname}`)
    }
  }

  onSubmit() {
    if (!this.satForm!.valid) {
      this.satForm?.markAllAsTouched();
      return
    }

    this.loading = true

    if (this.addMode) this.createSatForm()
    else this.editSatForm()
  }

  createSatForm() {

    if (this.isIva) {
      this.ivaService.create(this.satForm!.value).then(() => {
        this.loading = false
        this.snackbarService.setSuccess({ success: true, message: 'Formulario registrado con exito' })
        this.router.navigateByUrl('/sat/iva')
      }).catch((err: any) => {
        console.log(err)
        this.loading = false
        this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error creando el formulario' })
      })
    }
    else {
      this.isrService.create(this.satForm!.value).then(() => {
        this.loading = false
        this.snackbarService.setSuccess({ success: true, message: 'Formulario registrado con exito' })
        this.router.navigateByUrl('/sat/isr')
      }).catch((err: any) => {
        console.log(err)
        this.loading = false
        this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error creando el formulario' })
      })
    }
  }

  editSatForm() {
    if (this.isIva) {
      this.ivaService.update(this.satFormId!, this.satForm!.value).then(() => {
        this.snackbarService.setSuccess({ success: true, message: 'Formulario actualizado con exito' })
        this.router.navigateByUrl('/sat/iva')
      }).catch((err: any) => {
        console.log(err)
        this.loading = false
        this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error actualizando el formulario' })
      })
    }
    else {
      this.isrService.update(this.satFormId!, this.satForm!.value).then(() => {
        this.snackbarService.setSuccess({ success: true, message: 'Formulario actualizado con exito' })
        this.router.navigateByUrl('/sat/isr')
      }).catch((err: any) => {
        console.log(err)
        this.loading = false
        this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error actualizando el formulario' })
      })
    }
  }

  getSatForm() {
    if (this.isIva) {
      this.ivaService.get(this.satFormId!).subscribe(res => {
        this.satForm?.patchValue(res.data())
      }),
        ((err: any) => {
          console.log(err)
        });
    }
    else {
      this.isrService.get(this.satFormId!).subscribe(res => {
        this.satForm?.patchValue(res.data())
      }),
        ((err: any) => {
          console.log(err)
        });
    }

  }

  builderForm() {
    this.satForm = this.formBuilder.group({
      date: ['', Validators.required],
      formNumber: ['', Validators.required],
      accessNumber: ['', Validators.required],
      createdBy: ['', Validators.required],
      remainder: ['']
    })
  }

  get f() {
    return this.satForm?.controls;
  }
}
