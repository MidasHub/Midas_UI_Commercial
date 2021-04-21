/** Angular Imports */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/** Routing Imports */
import {Route} from '../core/route/route.service';

/** Translation Imports */
import {extract} from '../core/i18n/i18n.service';

/** Custom Components */
import {CreateTransactionComponent} from './create-transaction/create-transaction.component';
import {ManageTransactionComponent} from './manage-transaction/manage-transaction.component';
import {ViewTransactionComponent} from './view-transaction/view-transaction.component';
import {RollTermScheduleTransactionComponent} from './rollTerm-schedule-transaction/rollTerm-schedule-transaction.component';
import {FeePaidManagementComponent} from './fee-paid-management/fee-paid-management.component';
import {CreateBatchTransactionComponent} from './batch-transactions/create-batch-transaction/create-batch-transaction.component';
import {MemberInGroupResolver} from './resolver/member-in-group.resolver';
import {MemberAvailableInGroupResolver} from './resolver/member-available-in-group.resolver';
import { ManageIcTransactionComponent } from './manage-ic-transaction/manage-ic-transaction.component';

/** Transaction Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'transaction',
      data: {title: extract('Giao dịch'), breadcrumb: 'Giao dịch'},
      children: [
        {
          path: '',
          component: ManageIcTransactionComponent,
          data: {title: extract('Quản lý giao dịch'), breadcrumb: 'Quản lý giao dịch'}
        },
        {
          path: 'create',
          component: CreateTransactionComponent,
          data: {title: extract('Tạo giao dịch'), breadcrumb: 'Tạo giao dịch'}
        },
        {
          path: 'view',
          component: ViewTransactionComponent,
          data: {title: extract('Chi tiết'), breadcrumb: 'Chi tiết'}
        },
        {
          path: 'rollTermSchedule',
          component: RollTermScheduleTransactionComponent,
          data: {title: extract('Lịch trình đáo hạn thẻ'), breadcrumb: 'Lịch trình đáo hạn thẻ'}
        },
        {
          path: 'fee-paid-management',
          component: FeePaidManagementComponent,
          data: {title: extract('Danh sách xử lý giao dịch'), breadcrumb: 'Danh sách xử lý giao dịch'}
        },
        {
          path: 'batch-transaction',
          data: {title: extract('Giao dịch lô'), breadcrumb: 'Giao dịch lô'},
          children: [{
            path: ':groupId',
            component: CreateBatchTransactionComponent,
            data: {
              title: extract('Danh sách xử lý giao dịch'),
              breadcrumb: 'Danh sách xử lý giao dịch',
              routeParamBreadcrumb: 'groupId'
            },
            resolve: {
              groupId: MemberInGroupResolver,
              // memberAvailableInGroup: MemberAvailableInGroupResolver
            }
          }]
        }
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
export class TransactionRoutingModule {
}
