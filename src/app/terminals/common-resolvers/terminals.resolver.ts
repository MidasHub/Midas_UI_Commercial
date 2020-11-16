/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TerminalsService } from '../terminals.service';

@Injectable()
export class TerminalsResolver implements Resolve<Object> {

  constructor(private terminalsService: TerminalsService) { }
 
  resolve(route: ActivatedRouteSnapshot): Observable<any> { 
    const terminalId = route.parent.paramMap.get('terminalId');
    return this.terminalsService.getTerminalByID(terminalId);
  }

}
