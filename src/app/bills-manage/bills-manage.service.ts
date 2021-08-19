/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CommonHttpParams } from 'app/shared/CommonHttpParams';

/**
 * Groups service.
 */
@Injectable({
  providedIn: 'root',
})
export class BillsService {
  private credentialsStorageKey = 'midasCredentials';
  private accessToken: any;
  private IcGatewayApiUrlPrefix: any;
  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    this.IcGatewayApiUrlPrefix = environment.IcGatewayApiUrlPrefix;
  }

  uploadBills(formData: any): Observable<any> {

    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );

    formData.append('createdBy', this.accessToken.userId);
    formData.append('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/invoice/upload_invoice_asyn_new`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getBillsResource(): Observable<any> {
    const httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/invoice/get_list_doc_invoice`, httpParams);
  }

  getListInvoiceByBatchCode(batchCode: string |null,
    query: string, limit: number,
     offset: number): Observable<any> {
      let httpParams = this.commonHttpParams.getCommonHttpParams();

      httpParams = httpParams.set('batchCode', batchCode || '');
      httpParams = httpParams.set('query', query);
      httpParams = httpParams.set('limit', String(limit));
      httpParams = httpParams.set('offset', String(offset));

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/invoice/get_list_invoice_batchcode`, httpParams);
  }


  getListMerchant(): Observable<any> {
    const httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.get<any>(`${this.IcGatewayApiUrlPrefix}/pos/get_list_merchant`, { params: httpParams });
  }

  getListPartnerByMerchant(merchantId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('merchantId', merchantId);

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/invoice/get_list_partner_by_merchant`, httpParams);
  }
}
