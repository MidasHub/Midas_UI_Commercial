/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { TransactionRoutingModule } from './transaction-routing.module';

/** Custom Components */
import { TransactionComponent } from './transaction.component';

/**
 * Profile Module
 */
@NgModule({
  declarations: [TransactionComponent],
  imports: [
    SharedModule,
    TransactionRoutingModule
  ]
})
export class TransactionModule { }
