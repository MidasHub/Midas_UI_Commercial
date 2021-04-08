/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { CommonHttpParams } from 'app/shared/CommonHttpParams';

/**
 * third-party service.
 */
@Injectable({
    providedIn: 'root'
})
export class ThirdPartyService {

  private credentialsStorageKey = 'midasCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private filterSearch: any;
  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams
    ) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix ;
  }

  getInputFilter(): BehaviorSubject<any>{
      if(!this.filterSearch) {
        this.filterSearch = new BehaviorSubject('')
      }
      return this.filterSearch;

  }

  setInputFilter(input:string){
    console.log("set", input)
    this.filterSearch.next(input) ;
  }

  getPartners(status:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
      httpParams= httpParams.set('status', status);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner`, httpParams);
  }

  getPartnerByName(partnerCode:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/`+partnerCode, httpParams);
  }

  savePartner(data:any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('partnerCode', data.code);
    httpParams = httpParams.set('partnerName', data.desc);
    httpParams = httpParams.set('typeCheckValid', data.typeCheckValid ? '1' : '0');
    httpParams = httpParams.set('limit', data.limit);
    httpParams = httpParams.set('active', data.active ? 'O' : 'D');

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/savePartner`, httpParams);
  }

  updatePartner(data:any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('partnerCode', data.code);
    httpParams = httpParams.set('partnerName', data.desc);
    httpParams = httpParams.set('typeCheckValid', data.typeCheckValid ? '1' : '0');
    httpParams = httpParams.set('limit', data.limit);
    httpParams = httpParams.set('active', data.active ? 'O' : 'D');

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/updatePartner`, httpParams);
  }

  getMerchants(status:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams= httpParams.set('status', status);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/merchants`, httpParams);
  }

  getMerchantByName(merchantName:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('name',merchantName);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/merchant`, httpParams);
  }

  saveMerchant(data:any): Observable<any> {

    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('merchantName', data.name)
    httpParams = httpParams.set('rangeDays', data.rangeDay)
    httpParams = httpParams.set('merchantPartner', data.partner);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/merchant/save`, httpParams);
  }

  updateMerchant(data:any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('merchantName', data.name);
    httpParams = httpParams.set('status', data.active);
    httpParams = httpParams.set('rangeDays', data.rangeDay);
    httpParams = httpParams.set('merchantPartner', data.partner);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/merchant/update`, httpParams);
  }

  updateMerchantStatus(data:any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('merchantName', data.name);
    httpParams = httpParams.set('status', data.status);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/merchant/updateStatus`, httpParams);
  }

  updatePartnerStatus(data:any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('partnerCode', data.code);
    httpParams = httpParams.set('active', data.status);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/updateStatus`, httpParams);
  }
}
