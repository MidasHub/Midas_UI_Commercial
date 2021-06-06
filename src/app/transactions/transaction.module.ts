/** Angular Imports */
import {NgModule} from '@angular/core';

/** Custom Modules */
import {SharedModule} from '../shared/shared.module';
import {TransactionRoutingModule} from './transaction-routing.module';

/** Custom Components */
import {CreateTransactionComponent} from './create-transaction/create-transaction.component';
import {ManageTransactionComponent} from './manage-transaction/manage-transaction.component';
import {ConfirmDialogComponent} from './dialog/confirm-dialog/confirm-dialog.component';
import {UploadBillComponent} from './dialog/upload-bill/upload-bill.component';
// import { UploadPosInformationComponent } from './dialog/upload-pos-information/upload-pos-information.component';
import {DatePipe} from '@angular/common';
import {ViewTransactionComponent} from './view-transaction/view-transaction.component';
import {UploadPosInformationComponent} from './dialog/upload-pos-information/upload-pos-information.component';
import {RollTermScheduleTransactionComponent} from './rollTerm-schedule-transaction/rollTerm-schedule-transaction.component';
import {DueDayCardTabComponent} from './rollTerm-schedule-transaction/due-day-card-tab/due-day-card-tab.component';
import {RollTermScheduleDialogComponent} from './rollTerm-schedule-transaction/dialog/roll-term-schedule/roll-term-schedule-dialog.component';
import {CreateRollTermScheduleDialogComponent} from './rollTerm-schedule-transaction/dialog/create-roll-term-schedule/create-roll-term-schedule-dialog.component';
import {RollTermScheduleTabComponent} from './rollTerm-schedule-transaction/roll-term-schedule-tab/roll-term-schedule-tab.component';
import {FeePaidManagementComponent} from './fee-paid-management/fee-paid-management.component';
import {AddFeeDialogComponent} from './dialog/add-fee-dialog/add-fee-dialog.component';
import {ViewFeePaidTransactionDialogComponent} from './dialog/view-fee-paid-transaction-dialog/view-fee-paid-transaction-dialog.component';
import {AdvanceFeeRollTermComponent} from './rollTerm-schedule-transaction/dialog/advance-fee-roll-term/advance-fee-roll-term.component';
import {TransactionHistoryDialogComponent} from './rollTerm-schedule-transaction/dialog/transaction-history/transaction-history-dialog.component';
import {OnRollTermCardTabComponent} from './rollTerm-schedule-transaction/on-roll-term-card-tab/on-roll-term-card-tab.component';
import {ExecuteLoanDialogComponent} from './rollTerm-schedule-transaction/dialog/execute-loan-dialog/execute-loan-dialog.component';
import {CreateBatchTransactionComponent} from './batch-transactions/create-batch-transaction/create-batch-transaction.component';
import {AddRowCreateBatchTransactionComponent} from './dialog/add-row-create-batch-transaction/add-row-create-batch-transaction.component';
import {CreateCardBatchTransactionComponent} from './dialog/create-card-batch-transaction/create-card-batch-transaction.component';
import {MemberInGroupResolver} from './resolver/member-in-group.resolver';
import {MemberAvailableInGroupResolver} from './resolver/member-available-in-group.resolver';
import { AddInformationCardBatchComponent } from './dialog/add-information-card-batch/add-information-card-batch.component';
import { CreateSuccessTransactionDialogComponent } from './dialog/create-success-transaction-dialog/create-success-transaction-dialog.component';
import { MainboardComponent } from 'app/home/mainboard/mainboard.component';
import { MakeFeeOnAdvanceComponent } from './dialog/make-fee-on-advance/make-fee-on-advance.component';
import { ValidCheckTransactionHistoryDialogComponent } from './dialog/valid-check-transaction-history/valid-check-transaction-history-dialog.component';
import { ManageIcTransactionComponent } from './manage-ic-transaction/manage-ic-transaction.component';
import { ConfirmHoldTransactionDialogComponent } from './dialog/confirm-hold-transaction-dialog/confirm-hold-transaction-dialog.component';
import { AddSubmitTransactionDialogComponent } from './dialog/add-submit-transaction-dialog/add-submit-transaction-dialog.component';

/**
 * Profile Module
 */
@NgModule({
  declarations: [
    CreateTransactionComponent,
    ManageTransactionComponent,
    ConfirmDialogComponent,
    UploadBillComponent,
    UploadPosInformationComponent,
    ViewTransactionComponent,
    RollTermScheduleTransactionComponent,
    DueDayCardTabComponent,
    RollTermScheduleDialogComponent,
    CreateRollTermScheduleDialogComponent,
    RollTermScheduleTabComponent,
    FeePaidManagementComponent,
    AdvanceFeeRollTermComponent,
    FeePaidManagementComponent,
    AddFeeDialogComponent,
    ViewFeePaidTransactionDialogComponent,
    TransactionHistoryDialogComponent,
    OnRollTermCardTabComponent,
    ExecuteLoanDialogComponent,
    CreateBatchTransactionComponent,
    AddRowCreateBatchTransactionComponent,
    CreateCardBatchTransactionComponent,
    AddInformationCardBatchComponent,
    CreateSuccessTransactionDialogComponent,
    MakeFeeOnAdvanceComponent,
    ValidCheckTransactionHistoryDialogComponent,
    ManageIcTransactionComponent,
    ConfirmHoldTransactionDialogComponent,
    AddSubmitTransactionDialogComponent
  ],

  imports: [
    SharedModule,
    TransactionRoutingModule
  ],
  providers: [
    DatePipe,
    MemberInGroupResolver,
    MemberAvailableInGroupResolver
  ]
})
export class TransactionModule {
}
