import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { CategoryService } from '@services/category.service';
import { SnackbarService } from '@services/snackbar.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  categoryId: string | undefined;
  addMode: boolean | undefined;
  titleComponent: string | undefined;
  categoryForm: FormGroup | undefined;
  loading = false;
  user: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router,
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {
    this.builderForm()
  }

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.addMode = (this.categoryId) ? false : true;
    this.titleComponent = (this.addMode) ? 'Nueva categoría' : 'Editar categoría'

    if (!this.addMode) this.getCategory();
    else {
      this.user = this.authService.getLocalStorage()
      this.f!.createdBy.setValue(`${this.user[0].firstName} ${this.user[0].surname}`)
    }

  }

  onSubmit() {
    if (!this.categoryForm!.valid) {
      this.categoryForm?.markAllAsTouched();
      return
    }

    this.loading = true

    if (this.addMode) this.createCategory()
    else this.editCategory()
  }

  createCategory() {
    this.categoryService.create(this.categoryForm!.value).then(() => {
      this.loading = false
      this.snackbarService.setSuccess({ success: true, message: 'Categoría registrada con exito' })
      this.router.navigateByUrl('/categories')
    }).catch((err: any) => {
      console.log(err)
      this.loading = false
      this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error creando la categoría' })
    })
  }

  editCategory() {
    this.categoryService.update(this.categoryId!, this.categoryForm!.value).then(() => {
      this.snackbarService.setSuccess({ success: true, message: 'Categoría actualizada con exito' })
      this.router.navigateByUrl('/providers')
    }).catch((err: any) => {
      console.log(err)
      this.loading = false
      this.snackbarService.setSuccess({ success: false, message: 'Ha ocurrido un error actualizando la categoría' })
    })
  }

  getCategory() {
    this.categoryService.get(this.categoryId!).subscribe(res => {
      this.categoryForm?.patchValue(res.data())
    }),
      ((err: any) => {
        console.log(err)
      });
  }

  categoryUpperCase(){
    const category: string = this.f!.name.value
    this.f!.name.setValue(category.toUpperCase())
  }

  builderForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      createdBy: ['', Validators.required],
    })
  }

  get f() {
    return this.categoryForm?.controls;
  }

}
