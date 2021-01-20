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
import { ViewDetailBatchUploadComponent } from "./view-detail-batch-upload/view-detail-batch-upload.component";
import { ViewBillsBatchUploadResolver } from "./common-resolvers/ViewBillsBatchUpload.resolver";

/** Groups Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: "bills",
      data: { title: extract(""), breadcrumb: "Quản lý file hóa đơn", routeParamBreadcrumb: false },
      children: [
        {
          path: "",
          component: BillsManageComponent,
          resolve: {
            BillsResourceData: BillsManageResolver,
          },
        },
        {
          path: ':batchCode',
          data: { title: extract(''), breadcrumb: "Chi tiết lô upload :batchCode", routeParamBreadcrumb: 'batchCode' },
          component: ViewDetailBatchUploadComponent,
          resolve: {
            BillsResourceData: ViewBillsBatchUploadResolver,
          },
        }
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
  providers: [BillsManageResolver, ViewBillsBatchUploadResolver],
})
export class BillsManageRoutingModule {}
