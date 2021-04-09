/** Angular Imports */
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { Observable, BehaviorSubject } from "rxjs";
import { CommonHttpParams } from "app/shared/CommonHttpParams";

/**
 * third-party service.
 */
@Injectable({
  providedIn: "root",
})
export class ThirdPartyService {
  private filterSearch: any;
  private IcGatewayApiUrlPrefix: any;

  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.IcGatewayApiUrlPrefix = environment.IcGatewayApiUrlPrefix;
  }

  getInputFilter(): BehaviorSubject<any> {
    if (!this.filterSearch) {
      this.filterSearch = new BehaviorSubject("");
    }
    return this.filterSearch;
  }

  setInputFilter(input: string) {
    console.log("set", input);
    this.filterSearch.next(input);
  }

  getPartners(status: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("status", status);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner`, httpParams);
  }

  getPartnerByName(partnerCode: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/` + partnerCode, httpParams);
  }

  savePartner(data: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('partnerCode', data.code);
    httpParams = httpParams.set('partnerName', data.desc);
    httpParams = httpParams.set('typeCheckValid', data.typeCheckValid);
    httpParams = httpParams.set('limit', data.limit);
    httpParams = httpParams.set('active', data.active ? 'O' : 'D');

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/savePartner`, httpParams);
  }

  updatePartner(data:any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('partnerCode', data.code);
    httpParams = httpParams.set('partnerName', data.desc);
    httpParams = httpParams.set('typeCheckValid', data.typeCheckValid);
    httpParams = httpParams.set('limit', data.limit);
    httpParams = httpParams.set('active', data.active ? 'O' : 'D');

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/updatePartner`, httpParams);
  }

  getMerchants(status: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("status", status);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/merchants`, httpParams);
  }

  getMerchantByName(merchantName: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("name", merchantName);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/merchant`, httpParams);
  }

  inactiveBillsMerchant(merchantCode: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("merchantCode", merchantCode);

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/inactive_bills_available`, httpParams);
  }

  saveMerchant(data: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("unitType", data.unitType);
    httpParams = httpParams.set("merchantName", data.name);
    httpParams = httpParams.set("rangeDays", data.rangeDay);
    httpParams = httpParams.set("merchantPartner", data.partner);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/add_merchant`, httpParams);
  }

  updateMerchant(data: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("unitType", data.unitType);
    httpParams = httpParams.set("merchantName", data.name);
    httpParams = httpParams.set("status", data.active);
    httpParams = httpParams.set("rangeDays", data.rangeDay);
    httpParams = httpParams.set("merchantPartner", data.partner);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/update_merchant`, httpParams);
  }

  updateMerchantStatus(data: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("merchantName", data.name);
    httpParams = httpParams.set("status", data.status);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/merchant/updateStatus`, httpParams);
  }

  updatePartnerStatus(data: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("partnerCode", data.code);
    httpParams = httpParams.set("active", data.status);

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/partner/updateStatus`, httpParams);
  }
}
