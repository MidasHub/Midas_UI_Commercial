/** Angular Imports */
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

/** Routing Imports */
import { Route } from "../core/route/route.service";

/** Translation Imports */
import { extract } from "../core/i18n/i18n.service";

/** Custom Imports */
import { BillsManageComponent } from "./bills-manage.component";
import { BillsManageResolver } from "./common-resolvers/BillsManageResolver";

/** Groups Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: "bills",
      data: { title: extract(""), breadcrumb: "Hóa đơn", routeParamBreadcrumb: false },
      children: [
        {
          path: "",
          component: BillsManageComponent,
          resolve: {
            BillsResourceData: BillsManageResolver,
          },
        },
        // {
        //   path: 'create',
        //   component: CreateTerminalsComponent,
        //   data: { title: extract('Create Terminal'), breadcrumb: 'Create', routeParamBreadcrumb: false },
        //   resolve:{
        //     terminalData: CreateTerminalsResolver,
        //   }
        // },
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
      ],
    },
  ]),
];

/**
 * Groups Routing Module
 *
 * Configures the groups routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BillsManageResolver],
})
export class BillsManageRoutingModule {}
