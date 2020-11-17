/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TerminalsService } from '../terminals.service';

@Injectable()
export class CreateTerminalsResolver implements Resolve<Object> {

  constructor(private terminalsService: TerminalsService) { }
 
  resolve(route: ActivatedRouteSnapshot): Observable<any> { 
    return this.terminalsService.getGroupAndHouseHolds();
  }

}
