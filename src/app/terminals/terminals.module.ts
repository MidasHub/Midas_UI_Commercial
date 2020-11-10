/** Angular Imports */
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

/** Custom Modules */
import { TerminalsRoutingModule } from './terminals-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';

/** Custom Components */
import { TerminalsComponent } from './terminals.component';
import { EditTerminalsComponent } from './edit-terminals/edit-terminals.component';
import { CreateTerminalsComponent } from './create-terminals/create-terminals.component';

/**
 * Groups Module
 *
 * All components related to Groups should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    TerminalsRoutingModule
  ],
  declarations: [
    TerminalsComponent,
    EditTerminalsComponent,
    CreateTerminalsComponent
  ],
  providers: [DatePipe]
})
export class TerminalsModule { }
