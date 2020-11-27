import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingManageComponent } from './booking-manage.component';
import { SharedModule } from 'app/shared/shared.module';
import { BookingsRoutingModule } from './booking-manage-routing.module';
import { BookingAgencyComponent } from './agency-booking/agency-booking.component';



@NgModule({
  declarations: [BookingManageComponent, BookingAgencyComponent],
  imports: [
    SharedModule,
    CommonModule,

    BookingsRoutingModule
  ]
})
export class BookingManageModule { }
