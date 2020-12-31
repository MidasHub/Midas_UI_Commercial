import {CardBankViewComponent} from './card-bank-view/card-bank-view.component';
/** Angular Imports */
import {NgModule} from '@angular/core';
import {DatePipe} from '@angular/common';

/** Custom Modules */
import {SharedModule} from 'app/shared/shared.module';
import {PipesModule} from '../pipes/pipes.module';
import {DirectivesModule} from '../directives/directives.module';
import {BanksRoutingModule} from './banks-routing.module';
import {MatRippleModule} from '@angular/material/core';
import { BanksComponent } from './banks/banks.component';

/** Custom Components */

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    BanksRoutingModule,
    MatRippleModule
  ],
  declarations: [
    CardBankViewComponent,
    BanksComponent,
  ],
  providers: [DatePipe]
})
export class BanksModule {
}
