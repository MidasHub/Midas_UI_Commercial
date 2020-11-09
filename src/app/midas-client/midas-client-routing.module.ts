/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { MidasClientComponent } from './midas-client.component';
import { MidasClientIdentitiesResolver } from './resolver/midas-client-identities.resolver';
import { MidasClientViewResolver } from './resolver/midas-client-view.resolver';
import { MidasClientIdentifierTemplateResolver } from './resolver/midas-client-identifier-template.resolver';
import { ClientTemplateResolver } from 'app/clients/common-resolvers/client-template.resolver';
import { IdentitiesTabComponent } from 'app/clients/clients-view/identities-tab/identities-tab.component';
import { ClientIdentitiesResolver } from 'app/clients/common-resolvers/client-identities.resolver';
import { ClientIdentifierTemplateResolver } from 'app/clients/common-resolvers/client-identifier-template.resolver';

/** Profile Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'midasClient',
      data: { title: extract(''), breadcrumb: 'Thông tin khách hàng' },

    children: [
      {
        path: ':clientId',
        component:  MidasClientComponent,
        data: { title: extract('Thông tin cơ bản của khách hàng'), breadcrumb: '', routeParamBreadcrumb: 'clientId' },
        resolve: {
          midasClientViewResolver: MidasClientViewResolver,
          midasClientIdentifierViewData: MidasClientIdentitiesResolver,
          midasClientIdentifierTemplateData: MidasClientIdentifierTemplateResolver,
        }
      },
    ]
  }
  , {
    path: 'identities',
    component: IdentitiesTabComponent,
    data: { title: extract('Identities'), breadcrumb: 'Identities', routeParamBreadcrumb: false },
    resolve: {
      midasClientIdentifierViewData: MidasClientIdentitiesResolver,
      midasClientIdentifierTemplateData: MidasClientIdentifierTemplateResolver,
    }
  },

  ])
];

/**
 * Profile Routing Module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MidasClientViewResolver, MidasClientIdentitiesResolver, MidasClientIdentifierTemplateResolver]
})
export class MidasClientRoutingModule { }
