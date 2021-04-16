import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatRoutingModule } from './sat-routing.module';
import { SatListComponent } from './sat-list/sat-list.component';
import { SatFormComponent } from './sat-form/sat-form.component';
import { SharedModule } from '../shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [SatListComponent, SatFormComponent],
  imports: [
    CommonModule,
    SatRoutingModule,
    SharedModule,
    [SweetAlert2Module.forRoot()],
  ]
})
export class SatModule { }
