/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

/**
 * third-party service.
 */
@Injectable({
    providedIn: 'root'
})
export class ThirdPartyService {
  
  private credentialsStorageKey = 'mifosXCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  constructor(private http: HttpClient) { 
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix ;
  }

  getPartners(status:string): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('status', status);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner`, httpParams);
  }

  getPartnerByName(partnerCode:string): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/`+partnerCode, httpParams);
  }

  savePartner(data:any): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('partnerCode', data.code)
      .set('partnerName', data.desc)
      .set('typeCheckValid', data.typeCheckValid)
      .set('limit', data.limit)
      .set('active', data.active)
      ;
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/savePartner`, httpParams);
  }

  updatePartner(data:any): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('partnerCode', data.code)
      .set('partnerName', data.desc)
      .set('typeCheckValid', data.typeCheckValid)
      .set('limit', data.limit)
      .set('active', data.active)
    ;
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/updatePartner`, httpParams);
  }

  getMerchants(status:string): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('status', status);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/merchants`, httpParams);
  }

  getMerchantByName(merchantName:string): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('name',merchantName);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/merchant`, httpParams);
  }

  saveMerchant(data:any): Observable<any> {
     
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('merchantName', data.name)
      .set('rangeDays', data.rangeDay)
      .set('merchantPartner', data.partner);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/merchant/save`, httpParams);
  }
 
  updateMerchant(data:any): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('merchantName', data.name)
      .set('status', data.active)
      .set('rangeDays', data.rangeDay)
      .set('merchantPartner', data.partner);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/partner/merchant/update`, httpParams);
  }

}