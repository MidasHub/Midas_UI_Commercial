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
  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix ;
  }

  getLimitTerminals(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/get_list_limit_pos`, httpParams);
  }

  getTerminals(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos`, httpParams);
  }

  getTerminalInfo(terminalId:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('terminalId', terminalId);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/info`, httpParams);
  }

  getTerminalByID(terminalId:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('terminalId', terminalId);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/edit`, httpParams);
  }

  getGroupAndHouseHolds(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.get<any>(`${this.GatewayApiUrlPrefix}/pos/groupandhouseholds`, { params: httpParams });
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
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/save`,  httpParams );
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
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/update`,  httpParams );
  }

  getByTerminalNo(TerminalNo: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('posterminaid', TerminalNo);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/getpos`,  httpParams );
    //return of(user).pipe(delay(500));
  }

  transfer(terminalId:string, officeId:string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("terminalId",terminalId)

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/assignterminal`,  httpParams );
  }

}
