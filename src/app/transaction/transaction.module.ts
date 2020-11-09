/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { TransactionRoutingModule } from './transaction-routing.module';

/** Custom Components */
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { ManageTransactionComponent } from './manage-transaction/manage-transaction.component';

/**
 * Profile Module
 */
@NgModule({
  declarations: [ CreateTransactionComponent, ManageTransactionComponent],
  imports: [
    SharedModule,
    TransactionRoutingModule
  ]
})
export class TransactionModule { }
