import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillFormComponent } from './bill-form/bill-form.component';
import { BillsListComponent } from './bills-list/bills-list.component';

const routes: Routes = [
  {
    path: 'new',
    component: BillFormComponent
  },
  {
    path: 'edit/:id',
    component: BillFormComponent
  },
  {
    path: '',
    component: BillsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillsRoutingModule { }
