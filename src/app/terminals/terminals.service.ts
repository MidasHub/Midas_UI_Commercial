/** Angular Imports */
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { CommonHttpParams } from "app/shared/CommonHttpParams";
import { AuthenticationService } from "app/core/authentication/authentication.service";

/**
 * Terminal service.
 */
@Injectable({
  providedIn: "root",
})
export class TerminalsService {
  private credentialsStorageKey = "midasCredentials";
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private IcGatewayApiUrlPrefix: any;
  constructor(
    private http: HttpClient,
    private commonHttpParams: CommonHttpParams,
    private authenticationService: AuthenticationService
  ) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
    this.IcGatewayApiUrlPrefix = environment.IcGatewayApiUrlPrefix;
  }

  getPartnersTerminalTemplate(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/get_show_transaction_info_template`, httpParams);
  }

  getListTerminalAvailable(amount: number, transactionType: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("amountTransaction", amount.toString()).set("transactionType", transactionType);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/get_list_terminal_by_office_sl`, httpParams);
  }

  getLimitTerminals(): Observable<any> {
    const currentUser = this.authenticationService.getCredentials();
    const { permissions } = currentUser;
    const isHavePermission = permissions.includes("ALL_FUNCTIONS");

    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("queryOffice", isHavePermission ? `%%` : `${currentUser.officeId}`);

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/get_list_limit_pos`, httpParams);
  }

  getTerminals(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos`, httpParams);
  }

  getTerminalInfo(terminalId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("terminalId", terminalId);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/transfer_info`, httpParams);
  }

  getTerminalByID(terminalId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("terminalId", terminalId);
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/edit`, httpParams);
  }

  getListMerchant(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.get<any>(`${this.IcGatewayApiUrlPrefix}/pos/get_list_merchant`, { params: httpParams });
  }

  save(data: any): Observable<any> {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const httpParams = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      ...data,
    };
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/save`, httpParams);
  }

  update(data: any): Observable<any> {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const httpParams = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      ...data,
    };
    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/update`, httpParams);
  }

  transfer(terminalId: string, transferToTarget: string, transferType: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("terminalId", terminalId);
    httpParams = httpParams.set("transferType", transferType);
    httpParams = httpParams.set("transferToTarget", transferToTarget);

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/pos/transfer_terminal`, httpParams);
  }

  getFeeByTerminal(accountTypeCode: string, terminalId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("accountTypeId", accountTypeCode);
    httpParams = httpParams.set("terminalId", terminalId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/get_fee_by_terminal`, httpParams);
  }
}
