import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillsRoutingModule } from './bills-routing.module';
import { BillFormComponent } from './bill-form/bill-form.component';
import { SharedModule } from '../shared/shared.module';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { BillsListComponent } from './bills-list/bills-list.component'

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [BillFormComponent, BillsListComponent],
  imports: [
    CommonModule,
    BillsRoutingModule,
    SharedModule,
    [SweetAlert2Module.forRoot()],
    NgxMaskModule.forRoot(maskConfig),
  ]
})
export class BillsModule { }
