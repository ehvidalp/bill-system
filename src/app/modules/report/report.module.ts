import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportFormComponent } from './report-form/report-form.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ReportFormComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
  ]
})
export class ReportModule { }
