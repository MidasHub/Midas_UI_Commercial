/** Angular Imports */
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

/** Custom Modules */
import { BillsManageRoutingModule } from './bills-manage-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { BillsManageComponent } from './bills-manage.component';
import { UploadFileBillComponent } from './dialog/upload-bill/upload-bill.component';
import { ViewDetailBatchUploadComponent } from './view-detail-batch-upload/view-detail-batch-upload.component';

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
    UploadFileBillComponent,
    ViewDetailBatchUploadComponent,
  ],
  providers: [DatePipe]
})
export class BillsManageModule { }
