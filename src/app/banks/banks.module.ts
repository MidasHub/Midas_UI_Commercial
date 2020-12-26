import {CardBankViewComponent} from './card-bank-view/card-bank-view.component';
/** Angular Imports */
import {NgModule} from '@angular/core';
import {DatePipe} from '@angular/common';

/** Custom Modules */
import {SharedModule} from 'app/shared/shared.module';
import {PipesModule} from '../pipes/pipes.module';
import {DirectivesModule} from '../directives/directives.module';
import {BanksRoutingModule} from './banks-routing.module';

/** Custom Components */

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    BanksRoutingModule
  ],
  declarations: [
    CardBankViewComponent,
  ],
  providers: [DatePipe]
})
export class BanksModule {
}
