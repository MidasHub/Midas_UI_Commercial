/** Angular Imports */
import {NgModule} from '@angular/core';

/** Custom Modules */
import {SharedModule} from '../shared/shared.module';
import {MarketingRoutingModule} from './marketing-routing.module';
import {ManagementComponent} from './management/management.component';
import {MarketingViewResolver} from './marketing-view.resolver';
import { ViewBookingMarketingComponent } from './view-booking-marketing/view-booking-marketing.component';
import { CreateBookingMarketingComponent } from './create-booking-marketing/create-booking-marketing.component';
import { CreateTransactionBookingComponent } from './dialog/create-transaction-booking/create-transaction-booking.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@busacca/ng-pick-datetime';

@NgModule({
  imports: [
    SharedModule,
    MarketingRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [
    ManagementComponent,
    ViewBookingMarketingComponent,
    CreateBookingMarketingComponent,
    CreateTransactionBookingComponent,
  ],
  providers: [
    MarketingViewResolver
  ]
})
export class MarketingModule {
}
