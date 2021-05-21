/** Angular Imports */
import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";

/** Custom Modules */
import { SharedModule } from "app/shared/shared.module";
import { PipesModule } from "../pipes/pipes.module";
import { DirectivesModule } from "../directives/directives.module";
import { CardTransferRoutingModule } from "./card-transfer-routing.module";
import { CreateTransferComponent } from "./create-transfer/create-transfer.component";

/** Custom Components */

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    CardTransferRoutingModule,

    // TableModule,
  ],
  declarations: [CreateTransferComponent],
  providers: [DatePipe],
})
export class CardTransferModule {}
