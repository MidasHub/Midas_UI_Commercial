/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { TransactionRoutingModule } from './transaction-routing.module';

/** Custom Components */
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { ManageTransactionComponent } from './manage-transaction/manage-transaction.component';
import { ConfirmDialogComponent } from './dialog/coifrm-dialog/confirm-dialog.component';
import { UploadBillComponent } from './dialog/upload-bill/upload-bill.component';
// import { UploadPosInformationComponent } from './dialog/upload-pos-information/upload-pos-information.component';
import { DatePipe } from '@angular/common';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { UploadPosInformationComponent } from './dialog/upload-pos-information/upload-pos-information.component';
import { RollTermScheduleTransactionComponent } from './rollTerm-schedule-transaction/rollTerm-schedule-transaction.component';
import { DueDayCardTabComponent } from './rollTerm-schedule-transaction/due-day-card-tab/due-day-card-tab.component';
import { RollTermScheduleDialogComponent } from './rollTerm-schedule-transaction/dialog/roll-term-schedule/roll-term-schedule-dialog.component';
import { CreateRollTermScheduleDialogComponent } from './rollTerm-schedule-transaction/dialog/create-roll-term-schedule/create-roll-term-schedule-dialog.component';
import { RollTermScheduleTabComponent } from './rollTerm-schedule-transaction/roll-term-schedule-tab/roll-term-schedule-tab.component';
import { FeePaidManagementComponent } from './fee-paid-management/fee-paid-management.component';
import { AddFeeDialogComponent } from './dialog/add-fee-dialog/add-fee-dialog.component';
import { ViewFeePaidTransactionDialogComponent } from './dialog/view-fee-paid-transaction-dialog/view-fee-paid-transaction-dialog.component';
import { AdvanceFeeRollTermComponent } from './rollTerm-schedule-transaction/dialog/advance-fee-roll-term/advance-fee-roll-term.component';
import { TransactionHistoryDialogComponent } from './rollTerm-schedule-transaction/dialog/transaction-history/transaction-history-dialog.component';

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
    TransactionHistoryDialogComponent
  ],

  imports: [
    SharedModule,
    TransactionRoutingModule
  ],
  providers: [DatePipe]
})
export class TransactionModule { }
