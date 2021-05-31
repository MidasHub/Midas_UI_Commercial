import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingManageComponent } from './booking-manage.component';
import { SharedModule } from 'app/shared/shared.module';
import { BookingsRoutingModule } from './booking-manage-routing.module';
import { BookingAgencyComponent } from './agency-booking/agency-booking.component';
import { CreateInternalBookingComponent } from './create-internal-booking/create-internal-booking.component';
import { AddBookingInternalComponent } from './dialog/add-booking-internal/add-booking-internal.component';
import { EditBookingInternalComponent } from './dialog/edit-booking-internal/edit-booking-internal.component';
import { ViewInternalBookingComponent } from './view-internal-booking/view-internal-booking.component';
import { InternalBookingTabComponent } from './view-internal-booking/internal-booking-tab/internal-booking-tab.component';
import { RollTermScheduleBookingTabComponent } from './view-internal-booking/roll-term-schedule-booking-tab/roll-term-schedule-booking-tab.component';
import { TransferBookingInternalComponent } from './dialog/transfer-booking-internal/transfer-booking-internal.component';
import { DetailBookingRollTermScheduleComponent } from './dialog/detail-booking-roll-term-schedule/detail-booking-roll-term-schedule.component';
import { BranchBookingTabComponent } from './view-internal-booking/branch-booking-tab/branch-booking-tab.component';



@NgModule({
  declarations: [
    BookingManageComponent,
    BookingAgencyComponent,
    CreateInternalBookingComponent,
    AddBookingInternalComponent,
    EditBookingInternalComponent,
    ViewInternalBookingComponent,
    InternalBookingTabComponent,
    RollTermScheduleBookingTabComponent,
    BranchBookingTabComponent,
    TransferBookingInternalComponent,
    DetailBookingRollTermScheduleComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,

    BookingsRoutingModule
  ]
})
export class BookingManageModule { }
