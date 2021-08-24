/** Angular Imports */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';

/**
 * Has Permission Directive
 */
@Directive({
  selector: '[midasHasPermission], [midasHasPermissions]',
})
export class HasPermissionDirective {
  /** User Permissions */
  private userPermissions: any[];
  private permissions!: any[];
  private logicalOp = 'AND';
  private isHidden = true;
  /**
   * Extracts User Permissions from User Credentials
   * @param {TemplateRef} templateRef Template Reference
   * @param {ViewContainerRef} viewContainer View Container Reference
   * @param {AuthenticationService} authenticationService AuthenticationService
   */
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticationService
  ) {
    const savedCredentials = this.authenticationService.getCredentials();
    if (savedCredentials) {
      this.userPermissions = savedCredentials.permissions;
    } else {
      this.userPermissions = [];
    }
  }

  /**
   * Evaluates the condition to show template.
   */
  @Input()
  set midasHasPermission(permission: any) {
    if (typeof permission !== 'string') {
      throw new Error('hasPermission value must be a string');
    }
    /** Clear the template beforehand to prevent overlap OnChanges. */
    this.viewContainer.clear();
    /** Shows Template if user has permission */
    if (this.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  @Input()
  set midasHasPermissions(permission: any) {
    if (typeof permission !== 'string') {
      throw new Error('hasPermission value must be a string');
    }
    /** Clear the template beforehand to prevent overlap OnChanges. */
    this.viewContainer.clear();
    /** Shows Template if user has permission */
    if (this.checkPermissions(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private checkPermissions(permission: string) {
    permission = permission.trim();

    // add custom permission
    if (this.userPermissions.includes(permission)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if user is permitted.
   * @param {string} permission Permission
   * @returns {true}
   * -`ALL_FUNCTIONS`: user is a Super user.
   * -`ALL_FUNCTIONS_READ`: user has all read permissions and passed permission is 'read' type.
   * - User has special permission to access that feature.
   * @returns {false}
   * - Passed permission doesn't fall under either of above given permission grants.
   * - No value was passed to the has permission directive.
   */
  private hasPermission(permission: string) {
    permission = permission.trim();

    if (this.userPermissions.includes('ALL_FUNCTIONS') && !this.userPermissions.includes('SYSTEM_CONFIG')) {
      return true;
    } else if (permission !== '') {
      if (permission.substring(0, 5) === 'READ_' && this.userPermissions.includes('ALL_FUNCTIONS_READ')) {
        return true;
      } else if (this.userPermissions.includes(permission)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
