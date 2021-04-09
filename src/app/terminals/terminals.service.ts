/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CommonHttpParams } from 'app/shared/CommonHttpParams';

/**
 * Terminal service.
 */
@Injectable({
    providedIn: 'root'
})
export class TerminalsService {


  private credentialsStorageKey = 'midasCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private IcGatewayApiUrlPrefix: any;
  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix ;
    this.IcGatewayApiUrlPrefix = environment.IcGatewayApiUrlPrefix ;
  }

  getLimitTerminals(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/get_list_limit_pos`, httpParams);
  }

  getTerminals(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos`, httpParams);
  }

  getTerminalInfo(terminalId:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('terminalId', terminalId);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/info`, httpParams);
  }

  getTerminalByID(terminalId:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('terminalId', terminalId);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/edit`, httpParams);
  }

  getListMerchant(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.get<any>(`${this.IcGatewayApiUrlPrefix}/pos/get_list_merchant`, { params: httpParams });
  }

  save(data:any): Observable<any> {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    const httpParams = {
      'createdBy': this.accessToken.userId,
      'accessToken': this.accessToken.base64EncodedAuthenticationKey,
      ...data
    }
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/save`,  httpParams );
  }

  update(data:any): Observable<any> {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    const httpParams = {
      'createdBy': this.accessToken.userId,
      'accessToken': this.accessToken.base64EncodedAuthenticationKey,
      ...data
    }
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/update`,  httpParams );
  }

  getByTerminalNo(TerminalNo: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('posterminaid', TerminalNo);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/getpos`,  httpParams );
    //return of(user).pipe(delay(500));
  }

  transfer(terminalId:string, officeId:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("terminalId",terminalId).set("str_toOfficeId",officeId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/assignterminal`,  httpParams );
  }

  getListTerminalAvailable(amount: number): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("amountTransaction", amount.toString());

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/get_list_terminal_by_office`, httpParams);
  }

  getFeeByTerminal(accountTypeCode: string, terminalId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("accountTypeId", accountTypeCode);
    httpParams = httpParams.set("terminalId", terminalId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/get_fee_by_terminal`, httpParams);
  }
}
