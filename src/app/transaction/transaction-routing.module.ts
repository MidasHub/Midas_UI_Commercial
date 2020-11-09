/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import {CreateTransactionComponent} from './create-transaction/create-transaction.component';
import {ManageTransactionComponent} from './manage-transaction/manage-transaction.component';

/** Transaction Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'transaction',
      data: { title: extract('Giao dịch'), breadcrumb: 'Giao dịch' },
      children: [
        {
          path: '',
          component:  ManageTransactionComponent,
          data: { title: extract('Quản lý giao dịch'), breadcrumb: 'Quản lý giao dịch' }
        },
        {
          path: 'create',
          component:  CreateTransactionComponent,
          data: { title: extract('Tạo giao dịch'), breadcrumb: 'Tạo giao dịch' }
        },
      ]
    }
  ])
];

/**
 * Transaction Routing Module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TransactionRoutingModule { }
