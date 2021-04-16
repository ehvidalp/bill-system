import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '@services/snackbar.service';
import { ProvidersService } from '@services/providers.service';
import { AuthService } from '@services/auth.service';
import { BillService } from '@services/bill.service';
import { Bill } from '@models/bill';
import { Provider } from '@models/provider';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from '@models/category';
import { CategoryService } from '@services/category.service';

@Component({
  selector: 'app-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.scss']
})
export class BillFormComponent implements OnInit {
  billId: string | undefined;
  addMode: boolean | undefined;
  titleComponent: string | undefined;
  billForm: FormGroup | undefined;
  providerForm: FormGroup | undefined;
  loading = false;
  loadingSearch = false;
  user: any;
  nitExists = true;
  isBillExists = false;
  isSubmit = false;
  isDeleteFile!: boolean;
  fileBill: any;
  fileRef$!: Observable<any>;
  getEditBill!: Object;
  fileToDelete!: string;
  categoryData: Category[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router,
    private providerService: ProvidersService,
    private billService: BillService,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private categoryService: CategoryService,
  ) {
    this.builderForm();
  }

  ngOnInit() {
    this.billId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.addMode = (this.billId) ? false : true;
    this.titleComponent = (this.addMode) ? 'Nueva factura' : 'Editar factura';

    if (!this.addMode) {
      this.getBill();
      this.isDeleteFile = false
    }
    else {
      this.user = this.authService.getLocalStorage();
      this.billFormControls!.createdBy.setValue(`${this.user[0].firstName} ${this.user[0].surname}`);
    }

    this.categoryService.getAll().subscribe(res => {
      this.categoryData = res
    })
    this.formValueChanges();
  }

  onSubmit() {
    if (!this.billForm!.valid || !this.providerForm!.valid) {
      this.billForm!.markAllAsTouched();
      this.providerForm!.markAllAsTouched();
      return;
    }
    if (this.isBillExists || !this.nitExists) return;
    this.loading = true;
    this.isSubmit = true;

    const subTotal = (!this.providerFormControls!.smallContributor) ? this.billFormControls!.total.value / 1.12 : this.billFormControls!.total.value / 1.05;
    const iva = (!this.providerFormControls?.smallContributor) ? this.billFormControls!.total.value * 0.12 : this.billFormControls!.total.value * 0.05;

    this.billFormControls!.subTotal.setValue(subTotal);
    this.billFormControls!.iva.setValue(iva);

    if (this.addMode) this.createBill();
    else this.editBill();
  }

  refFileBill(event: any) {
    this.fileBill = event.target.files[0];
    this.billFormControls!.file.setValue(this.fileBill);
  }

  searchProvider() {
    this.loadingSearch = true;
    this.providerService.getWithNit(this.providerFormControls!.nit.value).subscribe((res: Provider[]) => {
      if (res.length > 0) {
        this.nitExists = true;
        this.providerForm?.patchValue(res[0])
        this.billFormControls!.providerId.setValue(res[0].id);
        this.billFormControls!.serie.enable();
        this.billFormControls!.numberBill.enable();
        this.billFormControls!.total.enable();
        this.billFormControls!.date.enable();
        this.billFormControls!.category.enable();
      }
      else {
        this.nitExists = false;
        this.providerFormControls!.tradename.setValue('');
        this.providerFormControls!.businessName.setValue('');
        this.billFormControls!.providerId.setValue('');
        this.billFormControls!.serie.disable();
        this.billFormControls!.numberBill.disable();
        this.billFormControls!.total.disable();
        this.billFormControls!.date.disable();
        this.billFormControls!.category.disable();
      }
      this.loadingSearch = false;
    });
  }


  billExists() {
    this.billService.searchBillExists(this.billFormControls!.serie.value, this.billFormControls!.numberBill.value, this.billFormControls!.providerId.value).subscribe((res: any) => {
      const bill = {
        serie: this.billFormControls!.serie.value,
        provider: this.billFormControls!.providerId.value,
        numberBill: this.billFormControls!.numberBill.value,
      }

      if (JSON.stringify(bill) === JSON.stringify(this.getEditBill)) {
        this.isBillExists = false
        return
      }

      if (res[0] === true) this.isBillExists = true;
      else this.isBillExists = false;
    });
  }

  createBill() {
    const fileRef = this.storage.ref(this.fileBill.name);
    const task = this.storage.upload(this.fileBill.name, this.fileBill);

    // this.billFormControls!.date.setValue(new Date(this.billFormControls!.date.value))

    task.snapshotChanges().pipe(
      finalize(() => {
        this.fileRef$ = fileRef.getDownloadURL();
        this.fileRef$.subscribe(url => {
          this.billFormControls!.file.setValue(url);
          this.billService.create(this.billForm!.value).then(() => {
            this.loading = false;
            this.snackbarService.setSuccess({ success: true, message: 'Factura registrada con exito' });
            this.router.navigateByUrl('/bills');
          }).catch((err: any) => {
            console.log(err);
            this.loading = false;
            this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error creando la factura' });
          });
        });
      })
    ).subscribe();


  }

  editBill() {


    if (!this.isDeleteFile) {
      this.billService.update(this.billId!, this.billForm!.value).then(() => {
        this.loading = false
        this.snackbarService.setSuccess({ success: true, message: 'Factura actualizada' });
        this.router.navigateByUrl('/bills');
      }).catch((err: any) => {
        console.log(err);
        this.loading = false;
        this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error actualizando la factura' });
      });
    }
    else {
      this.storage.storage.refFromURL(this.fileToDelete).delete().then(() => {
        const fileRef = this.storage.ref(this.fileBill.name);
        const task = this.storage.upload(this.fileBill.name, this.fileBill);
        task.snapshotChanges().pipe(
          finalize(() => {
            this.fileRef$ = fileRef.getDownloadURL();
            this.fileRef$.subscribe(url => {
              this.billFormControls!.file.setValue(url);
              this.billService.update(this.billId!, this.billForm!.value).then(() => {
                this.loading = false
                this.snackbarService.setSuccess({ success: true, message: 'Factura actualizada' });
                this.router.navigateByUrl('/bills');
              }).catch((err: any) => {
                console.log(err);
                this.loading = false;
                this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error actualizando la factura' });
              });
            });
          })
        ).subscribe();
      })
    }
  }

  getBill() {
    this.billService.get(this.billId!).pipe(
      switchMap(res => {
        this.billForm!.patchValue(res.data());
        this.getEditBill = {
          serie: this.billFormControls!.serie.value,
          provider: this.billFormControls!.providerId.value,
          numberBill: this.billFormControls!.numberBill.value,
        }

        return this.providerService.get(this.billFormControls!.providerId.value)
      }))
      .subscribe(provider => {
        this.providerForm!.patchValue(provider.data())
        this.billFormControls!.serie.enable();
        this.billFormControls!.numberBill.enable();
        this.billFormControls!.total.enable();
        this.billFormControls!.date.enable();
        this.billFormControls!.category.enable();
      }),
      ((err: any) => {
        console.log(err)
      })

  }

  deleteFile() {
    this.isDeleteFile = true
    this.fileToDelete = this.billFormControls!.file.value;
    this.billFormControls!.file.setValue('')
  }

  serieUpperCase() {
    const serie: string = this.billFormControls!.serie.value;
    this.billFormControls!.serie.setValue(serie.toUpperCase());
  }

  numberBillUpperCase() {
    const numberBill: string = this.billFormControls!.numberBill.value;
    this.billFormControls!.numberBill.setValue(numberBill.toUpperCase());
  }

  nitUpperCase() {
    const nit: string = this.providerFormControls!.nit.value;
    this.providerFormControls!.nit.setValue(nit.toUpperCase());
  }

  builderForm() {
    this.billForm = this.formBuilder.group({
      serie: [{ value: '', disabled: true }, Validators.required],
      numberBill: [{ value: '', disabled: true }, Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      total: [{ value: '', disabled: true }, Validators.required],
      category: [{ value: '', disabled: true }, Validators.required],
      iva: [''],
      subTotal: [''],
      createdBy: ['', Validators.required],
      file: ['', Validators.required],
      providerId: ['', Validators.required]
    });

    this.providerForm = this.formBuilder.group({
      nit: ['', Validators.required],
      tradename: [{ value: '', disabled: true }, Validators.required],
      businessName: [{ value: '', disabled: true }, Validators.required],
      smallContributor: ['', Validators.required]
    });
  }

  formValueChanges() {
    this.billFormControls!.serie.valueChanges.subscribe(value => {
      this.billExists();
    });

    this.billFormControls!.numberBill.valueChanges.subscribe(value => {
      this.billExists();
    });
  }

  get billFormControls() {
    return this.billForm?.controls;
  }

  get providerFormControls() {
    return this.providerForm?.controls;
  }
}
