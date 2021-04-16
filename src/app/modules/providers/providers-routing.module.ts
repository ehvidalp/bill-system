import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProvidersFormComponent } from './providers-form/providers-form.component';
import { ProvidersListComponent } from './providers-list/providers-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProvidersListComponent
  },
  {
    path: 'new',
    component: ProvidersFormComponent
  },
  {
    path: 'edit/:id',
    component: ProvidersFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
