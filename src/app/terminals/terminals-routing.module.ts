/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Imports */
import { TerminalsComponent } from './terminals.component';
//import { CreateTerminalsComponent } from './terminals.component';
import { EditTerminalsComponent } from './edit-terminals/edit-terminals.component';
import { CreateTerminalsComponent } from './create-terminals/create-terminals.component';
import { TerminalsResolver } from './terminals.resolver';

/** Groups Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'terminals',
      data: { title: extract('Terminal_Component.labelTerminal'), breadcrumb: 'Terminal_Component.labelTerminal', routeParamBreadcrumb: false },
      children: [
        {
          path: '',
          component: TerminalsComponent,
        },
        {
          path: 'create',
          component: CreateTerminalsComponent,
          data: { title: extract('Create Terminal'), breadcrumb: 'Create', routeParamBreadcrumb: false },
          resolve: {
            //offices: OfficesResolver
          }
        },
        {
          path: ':terminalUUID',
          data: { title: extract('View Terminal'), routeParamBreadcrumb: 'terminalUUID' },
          children: [{
            path: '',
            children: [
              {
                path: 'edit',
                component: EditTerminalsComponent,
                data: { title: extract('Edit Terminal'), breadcrumb: 'view', routeParamBreadcrumb: false },
                resolve:{
                  terminalData: TerminalsResolver,
                }
              }
          ]
        }]
        }
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
  providers:[TerminalsResolver]
})
export class TerminalsRoutingModule { }
