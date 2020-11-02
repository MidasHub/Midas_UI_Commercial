/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

/** Custom Resolvers */
import { OfficesResolver } from '../accounting/common-resolvers/offices.resolver';

/** Create customer */
import {CreateClientComponent} from '../clients/create-client/create-client.component';
import { ClientAddressFieldConfigurationResolver } from '../clients/common-resolvers/client-address-fieldconfiguration.resolver';
import { ClientTemplateResolver } from '../clients/common-resolvers/client-template.resolver';
import {ClientIdentifierTemplateResolver} from '../clients/common-resolvers/client-identifier-template.resolver';



/** Home and Dashboard Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      component: HomeComponent,
      data: { title: extract('Home') }
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      data: { title: extract('Dashboard'), breadcrumb: 'Dashboard' },
      resolve: {
        offices: OfficesResolver
      }
    },
    {
      path: 'create',
      data: { title: extract('Create Client'), breadcrumb: 'Create Client', routeParamBreadcrumb: false },
      component: CreateClientComponent,
      resolve: {
        clientAddressFieldConfig: ClientAddressFieldConfigurationResolver,
        clientTemplate: ClientTemplateResolver,
        clientIdentifierTemplate: ClientIdentifierTemplateResolver,
      }
    },
  ])
];

/**
 * Home Routing Module
 *
 * Configures the home and dashboard routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [OfficesResolver,ClientTemplateResolver,ClientAddressFieldConfigurationResolver]
})
export class HomeRoutingModule { }
