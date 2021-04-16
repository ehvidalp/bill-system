import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SatListComponent } from './sat-list/sat-list.component';
import { SatFormComponent } from './sat-form/sat-form.component';

const routes: Routes = [
  {
    path: 'isr',
    component: SatListComponent
  },
  {
    path: 'iva',
    component: SatListComponent
  },
  {
    path: 'isr/new',
    component: SatFormComponent
  },
  {
    path: 'iva/new',
    component: SatFormComponent
  },
  {
    path: 'isr/edit/:id',
    component: SatFormComponent
  },
  {
    path: 'iva/edit/:id',
    component: SatFormComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SatRoutingModule { }
