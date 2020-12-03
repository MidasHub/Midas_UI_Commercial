/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BillsService } from '../bills-manage.service';

@Injectable()
export class ViewBillsBatchUploadResolver implements Resolve<Object> {

  constructor(private billsService: BillsService,) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const batchCode = route.paramMap.get('batchCode');
    return this.billsService.getListInvoiceByBatchCode(batchCode, "%%", 10, 0);
  }

}
