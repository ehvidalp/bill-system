import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesFormComponent } from './categories-form/categories-form.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { SharedModule } from '../shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [CategoriesFormComponent, CategoriesListComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    CommonModule,
    SharedModule,
    [SweetAlert2Module.forRoot()],
  ]
})
export class CategoriesModule { }
