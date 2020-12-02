/** Angular Imports */
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

/** Custom Modules */
import { BillsManageRoutingModule } from './bills-manage-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { BillsManageComponent } from './bills-manage.component';
import { UploadBillComponent } from './dialog/upload-bill/upload-bill.component';

/** Custom Components */

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    BillsManageRoutingModule,

    // TableModule,
  ],
  declarations: [
    BillsManageComponent,
    UploadBillComponent,
  ],
  providers: [DatePipe]
})
export class BillsManageModule { }
