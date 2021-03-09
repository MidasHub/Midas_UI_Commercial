/** Angular Imports */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

/** Custom Directives */
import {HasPermissionDirective} from './has-permission/has-permission.directive';
import {TableResponsiveDirective} from './table-responsive.directive';
import { AfterValueChangedDirective } from './after-value-changed.directive';
import { HasActiveModuleDirective } from './has-active-module/has-active-module.directive';

/**
 *  Directives Module
 *
 *  All custom directives should be declared and exported here.
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [HasPermissionDirective, HasActiveModuleDirective, TableResponsiveDirective, AfterValueChangedDirective],
  exports: [HasPermissionDirective, HasActiveModuleDirective,  TableResponsiveDirective, AfterValueChangedDirective]
})
export class DirectivesModule {
}
