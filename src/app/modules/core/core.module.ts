import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreLayoutComponent } from './core-layout/core-layout.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [CoreLayoutComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule
  ]
})
export class CoreModule { }
