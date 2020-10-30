/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { TransactionComponent } from './transaction.component';

/** Profile Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'transaction',
      component:  TransactionComponent,
      data: { title: extract(''), breadcrumb: 'Tạo giao dịch' },
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
