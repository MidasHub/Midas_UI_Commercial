/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';
import { BookingManageComponent } from './booking-manage.component';
import { BookingAgencyComponent } from './agency-booking/agency-booking.component';
import { CreateInternalBookingComponent } from './create-internal-booking/create-internal-booking.component';
import { ViewInternalBookingComponent } from './view-internal-booking/view-internal-booking.component';



/** Groups Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'booking',
      data: { title: extract(''), breadcrumb: 'booking', routeParamBreadcrumb: false },
      children: [
        {
          path: '',
          component: BookingManageComponent,
        },
        {
          path: 'agency',
          component: BookingAgencyComponent,
          data: { title: extract(''), breadcrumb: 'Đại lý', routeParamBreadcrumb: false },

        },
        {
          path: 'create',
          component: CreateInternalBookingComponent,
          data: { title: extract(''), breadcrumb: 'Tạo booking nội bộ', routeParamBreadcrumb: false },

        },
        {
          path: 'view',
          component: ViewInternalBookingComponent,
          data: { title: extract(''), breadcrumb: 'Danh sách booking nội bộ', routeParamBreadcrumb: false },

        },
      ]
    }
  ])
];

/**
 * Groups Routing Module
 *
 * Configures the groups routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[]
})
export class BookingsRoutingModule { }
