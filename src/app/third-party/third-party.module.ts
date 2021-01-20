/** Angular Imports */
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

/** Custom Modules */
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { ThirdPartyComponent } from './third-party.component';
import { PartnerTabComponent } from './partner-tab/partner-tab.component';
import { MerchantTabComponent } from './merchant-tab/merchant-tab.component';
import { ThirdPartyRoutingModule } from './third-party-routing.module';
import { PartnerDialogComponent } from './dialog/partner-dialog/partner-dialog.component';
import { MerchantDialogComponent } from './dialog/merchant-dialog/merchant-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    ThirdPartyRoutingModule,
  ],
  declarations: [
    ThirdPartyComponent,
    PartnerTabComponent,
    PartnerDialogComponent,
    MerchantTabComponent,
    MerchantDialogComponent,
  ],
  providers: [DatePipe]
})
export class ThirdPartyModule { }
