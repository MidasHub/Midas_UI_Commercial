/** Angular Imports */
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

/** Routing Imports */
import { Route } from "../core/route/route.service";

/** Translation Imports */
import { extract } from "../core/i18n/i18n.service";
import { CreateTransferComponent } from "./create-transfer/create-transfer.component";
import { ExportTransferComponent } from "./export-transfer/export-transfer.component";
import { ManageTransferComponent } from "./manage-transfer/manage-transfer.component";

/** Groups Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: "card-transfer",
      data: { title: extract(""), breadcrumb: "Quản lý giao/nhận thẻ", routeParamBreadcrumb: false },
      children: [
        // {
        //   path: "",
        //   // component: BillsManageComponent,
        // },
        // {
        //   path: ":transferRefNo",
        //   data: { title: extract(""), breadcrumb: "Chi tiết giao thẻ", routeParamBreadcrumb: "transferRefNo" },
        //   // component: ViewDetailBatchUploadComponent,
        //   // resolve: {
        //   //   BillsResourceData: ViewBillsBatchUploadResolver,
        //   // },
        // },
        {
          path: "create",
          data: { title: extract(""), breadcrumb: "Tạo biên bản", routeParamBreadcrumb: "" },
          component: CreateTransferComponent,
          // resolve: {
          //   BillsResourceData: ViewBillsBatchUploadResolver,
          // },
        },

        {
          path: "export",
          data: { title: extract(""), breadcrumb: "In biên bản", routeParamBreadcrumb: "" },
          component: ExportTransferComponent,
          // resolve: {
          //   BillsResourceData: ViewBillsBatchUploadResolver,
          // },
        },

        {
          path: "manage",
          data: { title: extract(""), breadcrumb: "In biên bản", routeParamBreadcrumb: "" },
          component: ManageTransferComponent,
        },
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
  providers: [],
})
export class CardTransferRoutingModule {}
