/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import {ReactiveFormsModule} from '@angular/forms';
import { MidasClientRoutingModule } from './midas-client-routing.module';
/** Custom Components */
import { MidasClientComponent } from './midas-client.component';

/**
 * Profile Module
 */
@NgModule({
  declarations: [MidasClientComponent],
  imports: [
    SharedModule,
    MidasClientRoutingModule,
    PipesModule,
    ReactiveFormsModule,
  ]
})
export class MidasClientModule { }
