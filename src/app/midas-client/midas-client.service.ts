/** Angular Imports */
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { CommonHttpParams } from 'app/shared/CommonHttpParams';
/**
 * midas client service.
 */
@Injectable({
  providedIn: 'root'
})
export class MidasClientService {

  private credentialsStorageKey = 'midasCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private environment: any;
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {

    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix ;
    this.environment = environment ;
   }


   getInfoSavingAccountByUserId(): Observable<any> {
    const httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/get_info_saving_account_by_user_id`, httpParams);
  }

  getInfoModuleActive( userId?: number, officeId?: number, accessToken?: string): Observable<any> {

    const httpParams = this.commonHttpParams.getCommonHttpParams();
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/config/get_info_module_active`, httpParams);
  }

  searchClientByNameAndExternalIdAndPhoneAndDocumentKey(query: string): Observable<any> {

    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('query', query);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/client/get_list_client_by_query`, httpParams);
  }

  getListSavingAccountFtByUserId(): Observable<any> {
    const httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/get_list_saving_account_ft_by_user_id`, httpParams);
  }

  getListSavingAccountByUserId(): Observable<any> {

    const httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/get_list_saving_account_by_user_id`, httpParams);
  }

  getListSavingAccountByClientId(clientId: string): Observable<any> {

    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('clientId', clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/get_list_saving_account_by_client_id`, httpParams);
  }

  formatLong(value: string) {
    value = String(value) ;
    const neg = value.startsWith('-');
    value = value.replace(/[^0-9]+/g, '');
    if (neg) { value = '-'.concat(value); }
    return parseInt(value, 0);
  }


}
