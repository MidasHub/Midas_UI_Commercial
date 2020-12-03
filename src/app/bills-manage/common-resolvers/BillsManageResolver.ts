/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BillsService } from '../bills-manage.service';

@Injectable()
export class BillsManageResolver implements Resolve<Object> {

  constructor(private billsService: BillsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.billsService.getBillsResource();
  }

}
