/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Imports */
import { ThirdPartyComponent } from './third-party.component';
/** third party Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'third-party',
      data: { title: extract('third-party'), breadcrumb: 'third-party', routeParamBreadcrumb: false },
      component:  ThirdPartyComponent,
    //   children: [{
    //     path: '',
    //     component:  ThirdPartyComponent,
    //     data: { title: extract('Quản lý đối tác'), breadcrumb: 'Quản lý đối tác' }
    //   }]
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
  providers: []
})
export class ThirdPartyRoutingModule { }
