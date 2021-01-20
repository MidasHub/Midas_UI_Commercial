/** Angular Imports */
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';

/** rxjs Imports */
import {Observable} from 'rxjs';

/** Custom Services */

@Injectable()
export class MarketingViewResolver implements Resolve<Object> {

  constructor() {
  }

  /**
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): any {
    const id = route.paramMap.get('id');
    return id;
  }

}
