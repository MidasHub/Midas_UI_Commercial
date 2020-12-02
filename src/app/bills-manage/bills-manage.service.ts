/** Angular Imports */
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

/**
 * Groups service.
 */
@Injectable({
  providedIn: "root",
})
export class BillsService {
  private credentialsStorageKey = "mifosXCredentials";
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  constructor(private http: HttpClient) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
  }

  uploadBills(formData: any): Observable<any> {
    formData.append("createdBy", this.accessToken.userId);
    formData.append("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/invoice/upload_invoice_asyn_new`, formData, {
      reportProgress: true,
      observe: "events",
    });
  }

  getBillsResource(): Observable<any> {
    const httpParams = new HttpParams()
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/invoice/get_list_doc_invoice`, httpParams);
  }

  getListMerchant(): Observable<any> {
    const httpParams = new HttpParams()
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/invoice/get_list_merchant`, httpParams);
  }

  getListPartnerByMerchant(merchantId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set("merchantId", merchantId)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/invoice/get_list_partner_by_merchant`, httpParams);
  }
}
