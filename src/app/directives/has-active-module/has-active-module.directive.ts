/** Angular Imports */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';

/**
 * Has Active Module Directive
 */
@Directive({
  selector: '[midasHasActiveModule]'
})
export class HasActiveModuleDirective {

  /**
   * Extracts User Permissions from User Credentials
   * @param {TemplateRef} templateRef Template Reference
   * @param {ViewContainerRef} viewContainer View Container Reference
   * @param {AuthenticationService} authenticationService AuthenticationService
   */
  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private authenticationService: AuthenticationService) {

  }

  /**
   * Evaluates the condition to show template.
   */
   @Input()
   set midasHasActiveModule(moduleName: any) {

    if (typeof moduleName !== 'string') {
       throw new Error('midasHasActiveModule value must be a string');
     }
     /** Clear the template beforehand to prevent overlap OnChanges. */
     this.viewContainer.clear();
     /** Shows Template if user has active module */
     let isActive = this.authenticationService.checkAppModuleSetting(moduleName);
     if (isActive) {
       this.viewContainer.createEmbeddedView(this.templateRef);
     }
   }

}
