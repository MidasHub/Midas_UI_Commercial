/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';
import { BookingManageComponent } from './booking-manage.component';
import { BookingAgencyComponent } from './agency-booking/agency-booking.component';



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
          // resolve:{
          //   terminalData: CreateTerminalsResolver,
          // }
        },
        // {
        //   path: 'limit',
        //   component: ViewLimitTerminalComponent,
        //   data: { title: extract('Hạn mức'), breadcrumb: 'Hạn mức', routeParamBreadcrumb: false },
        //   resolve:{
        //     terminalData: LimitTerminalsResolver,
        //   }
        // },
        // {
        //   path: ':terminalId',
        //   data: { title: extract('View Terminal'), routeParamBreadcrumb: 'terminalId' },
        //   children: [{
        //     path: '',
        //     children: [
        //       {
        //         path: 'edit',
        //         component: EditTerminalsComponent,
        //         data: { title: extract('Edit Terminal'), breadcrumb: 'view', routeParamBreadcrumb: false },
        //         resolve:{
        //           terminalData: TerminalsResolver,
        //         }
        //       }
        //   ]
        // }]
        // }
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
