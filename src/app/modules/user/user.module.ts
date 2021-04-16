import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { SharedModule } from '../shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [UserListComponent, UserFormComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    [SweetAlert2Module.forRoot()],
  ],
})
export class UserModule { }
