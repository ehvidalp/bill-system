import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreLayoutComponent } from './core-layout/core-layout.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ReportFormComponent } from '../report/report-form/report-form.component';
import { AdminGuard } from 'src/app/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: CoreLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        loadChildren: () => import('../user/user.module').then(m => m.UserModule)
      },
      {
        path: 'providers',
        loadChildren: () => import('../providers/providers.module').then(m => m.ProvidersModule)
      },
      {
        path: 'bills',
        loadChildren: () => import('../bills/bills.module').then(m => m.BillsModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'sat',
        loadChildren: () => import('../sat/sat.module').then(m => m.SatModule)
      },
      {
        path: 'report',
        loadChildren: () => import('../report/report.module').then(m => m.ReportModule)
      }
    ]
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
export class CoreRoutingModule { }
