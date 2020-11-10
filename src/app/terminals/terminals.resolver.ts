/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { TerminalsService } from './terminals.service';

/**
 * Group Accounts data resolver.
 */
@Injectable()
export class TerminalsResolver implements Resolve<Object> {

  constructor(private terminalsService: TerminalsService) { }
 
  resolve(route: ActivatedRouteSnapshot): Observable<any> { 
    const terminalUUID = route.parent.paramMap.get('terminalUUID');
    return this.terminalsService.getTerminalByUUID(terminalUUID);
  }

}
