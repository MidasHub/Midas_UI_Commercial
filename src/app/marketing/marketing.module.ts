/** Angular Imports */
import {NgModule} from '@angular/core';

/** Custom Modules */
import {SharedModule} from '../shared/shared.module';
import {MarketingRoutingModule} from './marketing-routing.module';
import {ManagementComponent} from './management/management.component';
import {CreateUpdateMarketingComponent} from './create-update-marketing/create-update-marketing.component';
import {MarketingViewResolver} from './marketing-view.resolver';
import { ViewBookingMarketingComponent } from './view-booking-marketing/view-booking-marketing.component';
import { CreateBookingMarketingComponent } from './create-booking-marketing/create-booking-marketing.component';

@NgModule({
  imports: [
    SharedModule,
    MarketingRoutingModule
  ],
  declarations: [
    ManagementComponent,
    CreateUpdateMarketingComponent,
    ViewBookingMarketingComponent,
    CreateBookingMarketingComponent,
  ],
  providers: [
    MarketingViewResolver
  ]
})
export class MarketingModule {
}
