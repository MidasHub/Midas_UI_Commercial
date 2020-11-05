import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private credentialsStorageKey = 'mifosXCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;

  constructor(private http: HttpClient) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
  }

  getListBank(): Observable<any> {
    console.log(environment.baseApiUrl);
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_bank`, httpParams);
  }

  getListCardType(): Observable<any> {
    console.log(environment.baseApiUrl);
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_card_type`, httpParams);
  }

  getInfoBinCode(binCode: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('binCode', binCode)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post(`${this.GatewayApiUrlPrefix}/common/get_info_bin_code`, httpParams);
  }

  storeInfoBinCode(body: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('binCode', body.binCode)
      .set('cardType', body.cardType)
      .set('bankCode', body.bankCode)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post(`${this.GatewayApiUrlPrefix}/common/store_info_bin_code`, httpParams);
  }

  storeExtraCardInfo(body: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('userId', body.userId)
      .set('userIdentifyId', body.userIdentifyId)
      .set('clientName', body.clientName)
      .set('cardNumber', body.cardNumber)
      .set('mobileNo', body.mobileNo)
      .set('dueDay', body.dueDay)
      .set('expireDate', body.expireDate)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post(`${this.GatewayApiUrlPrefix}/card/store_extra_card_info`, httpParams);
  }
}
