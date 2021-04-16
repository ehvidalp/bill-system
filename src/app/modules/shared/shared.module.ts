import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SyncfusionModule } from './syncfusion/syncfusion/syncfusion.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SyncfusionModule
  ],
  exports: [
    ReactiveFormsModule,
    SyncfusionModule
  ]
})
export class SharedModule { }
