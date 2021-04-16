import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'new',
    component: UserFormComponent
  },
  {
    path: 'edit/:id',
    component: UserFormComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
