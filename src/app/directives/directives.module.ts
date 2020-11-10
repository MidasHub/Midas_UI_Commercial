/** Angular Imports */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

/** Custom Directives */
import {HasPermissionDirective} from './has-permission/has-permission.directive';
import {TableResponsiveDirective} from './table-responsive.directive';

/**
 *  Directives Module
 *
 *  All custom directives should be declared and exported here.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HasPermissionDirective, TableResponsiveDirective],
  exports: [HasPermissionDirective, TableResponsiveDirective]
})
export class DirectivesModule {
}
