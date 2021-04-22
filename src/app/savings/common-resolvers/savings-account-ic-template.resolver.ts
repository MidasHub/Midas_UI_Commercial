/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { SavingsService } from '../savings.service';

/**
 * Savings Account Template resolver.
 */
@Injectable()
export class SavingsAccountIcTemplateResolver implements Resolve<Object> {

  /**
   * @param {savingsService} SavingsService Savings service.
   */
  constructor(private savingsService: SavingsService) { }

  /**
   * Returns the Shares Account Template.
   * @param {ActivatedRouteSnapshot} route Route Snapshot
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    return this.savingsService.getSavingsAccountIcTemplate(undefined);
  }

}
