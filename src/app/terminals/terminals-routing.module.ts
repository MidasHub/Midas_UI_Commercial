/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Imports */
import { TerminalsComponent } from './terminals.component';
import { EditTerminalsComponent } from './edit-terminals/edit-terminals.component';
import { CreateTerminalsComponent } from './create-terminals/create-terminals.component';
import { TerminalsResolver } from './common-resolvers/terminals.resolver';
import { CreateTerminalsResolver } from './common-resolvers/CreateTerminalsResolver';
import { ViewLimitTerminalComponent } from './view-limit-terminal/view-limit-terminal.component';
import { LimitTerminalsResolver } from './common-resolvers/LimitTerminals.resolver';

/** Groups Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'terminals',
      data: { title: extract('Danh sách máy bán hàng'), breadcrumb: 'Danh sách máy bán hàng', routeParamBreadcrumb: false },
      children: [
        {
          path: '',
          component: TerminalsComponent,
        },
        {
          path: 'create',
          component: CreateTerminalsComponent,
          data: { title: extract('Tạo máy bán hàng'), breadcrumb: 'Tạo máy bán hàng', routeParamBreadcrumb: false },
          resolve:{
            terminalData: CreateTerminalsResolver,
          }
        },
        {
          path: 'limit',
          component: ViewLimitTerminalComponent,
          data: { title: extract('Hạn mức'), breadcrumb: 'Hạn mức', routeParamBreadcrumb: false },
          resolve:{
            terminalData: LimitTerminalsResolver,
          }
        },
        {
          path: ':terminalId',
          data: { title: extract('Xem máy bán hàng'), breadcrumb:'Xem máy bán hàng',routeParamBreadcrumb: 'terminalId' },
          children: [{
            path: '',
            children: [
              {
                path: 'edit',
                component: EditTerminalsComponent,
                // data: { title: extract('Edit Terminal'),  routeParamBreadcrumb: true },
                resolve: {
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
  providers:[TerminalsResolver,CreateTerminalsResolver, LimitTerminalsResolver]
})
export class TerminalsRoutingModule { }
