/** Angular Imports */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/** Transalation Imports */
import {extract} from '../core/i18n/i18n.service';
import {ManagementComponent} from './management/management.component';
import {CreateUpdateMarketingComponent} from './create-update-marketing/create-update-marketing.component';
import {MarketingViewResolver} from './marketing-view.resolver';
import {Route} from '../core/route/route.service';
import {ViewBookingMarketingComponent} from './view-booking-marketing/view-booking-marketing.component';
import {CreateBookingMarketingComponent} from './create-booking-marketing/create-booking-marketing.component';

/** Custom Components */

/** Login Routes */
const routes: Routes = [
  Route.withShell([{
    path: 'marketing',
    data: {title: extract('MARKETING CAMPAIGN')},
    children: [
      {
        path: '',
        component: ManagementComponent,
        data: {title: 'Quản lý marketing', breadcrumb: 'Quản lý marketing'}
      },
      {
        path: 'create',
        component: CreateBookingMarketingComponent,
        data: {title: 'Tạo chiển dịch', breadcrumb: 'Tạo chiển dịch'}
      },
      {
        path: 'view/:id',
        component: CreateUpdateMarketingComponent,
        data: {title: 'Tạo chiển dịch', breadcrumb: 'Tạo chiển dịch', routeParamBreadcrumb: 'id'},
        resolve: {
          id: MarketingViewResolver
        }
      },
      {
        path: 'booking',
        data: {title: 'Booking Marketing', breadcrumb: 'Booking Marketing'},
        children: [
          {
            path: '',
            component: ViewBookingMarketingComponent,
            data: {title: 'Quản lý Booking Marketing', breadcrumb: 'Quản lý'},
          },
          {
            path: ':id',
            component: CreateBookingMarketingComponent,
            data: {title: 'Marketing compare', breadcrumb: 'Marketing compare', routeParamBreadcrumb: 'id'},
            resolve: {
              id: MarketingViewResolver
            }
          }
        ]
      },
    ]
  }])
];

/**
 * Login Routing Module
 *
 * Configures the login routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MarketingRoutingModule {
}
