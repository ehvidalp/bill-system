import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { ProvidersFormComponent } from './providers-form/providers-form.component';
import { SharedModule } from '../shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxMaskModule, IConfig } from 'ngx-mask'

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [ProvidersListComponent, ProvidersFormComponent],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
    SharedModule,
    [SweetAlert2Module.forRoot()],
    NgxMaskModule.forRoot(maskConfig),
  ]
})
export class ProvidersModule { }
