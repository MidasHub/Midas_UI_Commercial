/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

/**
 * Groups service.
 */
@Injectable({
    providedIn: 'root'
})
export class TerminalsService {


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

  getTerminals(): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos`, httpParams);
  }

  getTerminalByID(terminalId:string): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('terminalId', terminalId);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/edit`, httpParams);
  }

  getGroupAndHouseHolds(): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);   
    return this.http.get<any>(`${this.GatewayApiUrlPrefix}/pos/groupandhouseholds`, { params: httpParams });
  }
  
  save(data:any): Observable<any> {
    const httpParams = {
      'createdBy': this.accessToken.userId,
      'accessToken': this.accessToken.base64EncodedAuthenticationKey,
      ...data
    }  
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/save`,  httpParams );
  }

  update(data:any): Observable<any> {
    const httpParams = {
      'createdBy': this.accessToken.userId,
      'accessToken': this.accessToken.base64EncodedAuthenticationKey,
      ...data
    }  
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/update`,  httpParams );
  }

  getByTerminalNo(TerminalNo: string): Observable<any> {
    const httpParams = {
      'createdBy': this.accessToken.userId,
      'accessToken': this.accessToken.base64EncodedAuthenticationKey,
      'posterminaid':TerminalNo
    }  
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/getpos`,  httpParams );
    //return of(user).pipe(delay(500));
  }
}