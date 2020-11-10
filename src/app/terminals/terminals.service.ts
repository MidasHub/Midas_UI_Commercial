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

    /**
   * @param {HttpClient} http Http Client to send requests.
   */
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
  
  /**
   * @param {any} filterBy Properties by which entries should be filtered.
   * @param {string} orderBy Property by which entries should be sorted.
   * @param {string} sortOrder Sort order: ascending or descending.
   * @param {number} offset Page offset.
   * @param {number} limit Number of entries within the page.
   * @returns {Observable<any>} Groups.
   */
  getTerminals( ): Observable<any> {
    let httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/terminals`, httpParams);
  }

  getTerminalByUUID(terminalUUID:string): Observable<any> {
    let httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey)
      .set('terminalUUID', terminalUUID);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/terminals/edit`, httpParams);
  }
  
}