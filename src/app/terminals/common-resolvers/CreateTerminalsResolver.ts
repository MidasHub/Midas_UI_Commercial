/** Angular Imports */
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ThirdPartyService } from "app/third-party/third-party.service";
import { Observable } from "rxjs";
import { TerminalsService } from "../terminals.service";

@Injectable()
export class CreateTerminalsResolver implements Resolve<Object> {
  constructor(private terminalsService: TerminalsService,
    private thirdPartyService: ThirdPartyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // return this.terminalsService.getListMerchant();
    return this.thirdPartyService.getMerchants("A");
  }
}
