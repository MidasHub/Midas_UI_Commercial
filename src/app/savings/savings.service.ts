/** Angular Imports */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

/** rxjs Imports */
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { DatePipe } from "@angular/common";
import { SettingsService } from "app/settings/settings.service";
import { FormBuilder, FormControl } from "@angular/forms";
import { CommonHttpParams } from "app/shared/CommonHttpParams";

/**
 * Savings Service.
 */
@Injectable({
  providedIn: "root",
})
export class SavingsService {
  private credentialsStorageKey = "midasCredentials";
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private environment: any;


  constructor(private http: HttpClient,
     private datePipe: DatePipe,
     private settingsService: SettingsService,
     private formBuilder: FormBuilder,
     private commonHttpParams: CommonHttpParams
    ) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
    this.environment = environment;
  }

  /**
   * @param {string} savingAccountId is saving account"s Id.
   * @returns {Observable<any>}
   */
   transferCrossOfficeCashTransaction(info: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("buSavingAccount", info.buSavingAccount);
    httpParams = httpParams.set("paymentTypeId", info.paymentTypeId);
    httpParams = httpParams.set("note", info.note);
    httpParams = httpParams.set("amountAdvanceCash", info.amountAdvanceCash);
    httpParams = httpParams.set("clientSavingAccount", info.clientSavingAccount);

    return this.http.post(`${this.GatewayApiUrlPrefix}/savingTransaction/transfer_cross_office_transaction`, httpParams);
  }

  /**
   * @param {string} savingAccountId is saving account"s Id.
   * @returns {Observable<any>}
   */
   getListClientSavingStaffByOffice(staffId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("staffId", staffId);

    return this.http.post(`${this.GatewayApiUrlPrefix}/savingTransaction/get_list_client_saving_staff_by_office`, httpParams);
  }

  createGroupSavingsAccount(groupId:string, productId: string, savingsAccount: any): Observable<any> {
    const dateFormat = this.settingsService.dateFormat;
    const locale = this.settingsService.language.code;
    const savingGroupForm = this.formBuilder.group({
    "productId": [productId],
    "groupId": [groupId],
    "submittedOnDate": [this.datePipe.transform(new Date(), dateFormat)],
    "locale": [locale],
    "dateFormat": [dateFormat],
    });

    const savingsAccountInfo = {
      ...savingGroupForm.value }
    return this.http.post("/savingsaccounts", savingsAccountInfo);
  }

  /**
   * @param {string} savingAccountId is saving account"s Id.
   * @returns {Observable<any>}
   */
  getLimitSavingsTransactionConfig(paymentTypeId: string, staffId?: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("paymentTypeId", paymentTypeId);
    httpParams = httpParams.set("staffId", staffId ? staffId : "");


    return this.http.post(`${this.GatewayApiUrlPrefix}/config/get_limit_withdrawal_config_amount`, httpParams);
  }

  /**
   * @param {string} savingAccountId is saving account"s Id.
   * @returns {Observable<any>}
   */
  getSavingsTransactionTemplateResource(savingAccountId: string): Observable<any> {
    return this.http.get(`/savingsaccounts/${savingAccountId}/transactions/template`);
  }

  /**
   * @param {string} savingAccountId saving account id.
   * @returns {Observable<any>}
   */
  getSavingsChargeTemplateResource(savingAccountId: string): Observable<any> {
    return this.http.get(`/savingsaccounts/${savingAccountId}/charges/template`);
  }

  /**
   * @param {any} savingsCharge to apply on a savings Account.
   * @returns {Observable<any>}
   */
  createSavingsCharge(savingAccountId: string, resourceType: string, savingsCharge: any): Observable<any> {
    return this.http.post(`/savingsaccounts/${savingAccountId}/${resourceType}`, savingsCharge);
  }

  advanceCashTransaction(payload: any) {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams= httpParams.set("buSavingAccount", payload.buSavingAccount);
    httpParams= httpParams.set("clientSavingAccount", payload.clientSavingAccount);
    httpParams= httpParams.set("note", payload.noteAdvance);
    httpParams= httpParams.set("amountAdvanceCash", payload.amountAdvanceCash);
    httpParams= httpParams.set("paymentTypeId", payload.typeAdvanceCash);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/deposit_advance_cash_transaction`,
      httpParams
    );
  }

  advanceCashForDueDayCardTransaction(payload: any) {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams= httpParams.set("cardId", payload.cardId);
    httpParams= httpParams.set("buSavingAccount", payload.buSavingAccount);
    httpParams= httpParams.set("clientSavingAccount", payload.clientSavingAccount);
    httpParams= httpParams.set("note", `${payload.clientSavingAccount} - ${payload.noteAdvance}`);
    httpParams= httpParams.set("amountAdvanceCash", payload.amountAdvanceCash)
    httpParams= httpParams.set("paymentTypeId", payload.typeAdvanceCash);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/deposit_advance_cash_transaction_for_due_day_card`,
      httpParams
    );
  }

  getListPartner() {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/invoice/get_list_partner`, httpParams);
  }

  getListSavingAdvanceCashFromPartner(officeId: any) {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/get_list_client_saving_vault_by_office`,
      httpParams
    );
  }

  // getListOfficeCommon() {
  //   let httpParams = this.commonHttpParams.getCommonHttpParams();

  //   return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_office`, httpParams);
  // }

  getListOfficeCommon() {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_office`, httpParams);
  }

  advanceCashPartnerTransaction(payload: any) {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("buSavingAccount", payload.buSavingAccount);
    httpParams = httpParams.set("paymentTypeId", payload.paymentTypeId);
    httpParams = httpParams.set("note", `${payload.partnerPaymentType} # ${payload.partnerAdvanceCash} # ${payload.notePartnerAdvance}`);
    httpParams = httpParams.set("amountAdvanceCash", payload.amountAdvanceCash);
    httpParams = httpParams.set("routingCode", payload.partnerAdvanceCash);
    httpParams = httpParams.set("clientSavingAccount", payload.partnerClientVaultAdvanceCash);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/deposit_partner_advance_cash_transaction`,
      httpParams
    );
  }

  getSearchTransactionCustom(payload: any) {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams= httpParams.set("fromDate", payload.fromDate);
    httpParams= httpParams.set("toDate", payload.toDate);
    httpParams= httpParams.set("accountId", payload.accountId);
    httpParams= httpParams.set("note", payload.note);
    httpParams= httpParams.set("isRevert", payload.isRevert);
    httpParams= httpParams.set("txnCode", payload.txnCode);
    httpParams= httpParams.set("paymentDetail", payload.paymentDetail);
    httpParams= httpParams.set("limit", payload.limit);
    httpParams= httpParams.set("offset", payload.offset);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/get_list_transaction_detail_of_account`,
      httpParams
    );
  }

  getExportExcelFile(url: string) {
    const httpOptions = {
      responseType: "blob" as "json",
      headers: new HttpHeaders({
        "Gateway-TenantId": this.environment.GatewayTenantId,
      }),
    };

    return this.http.get(url, httpOptions);
  }

  downloadReport(
    accountId: string,
    toDate: string,
    fromDate: string,
    note: string,
    txnCode: string,
    paymentDetail: string
  ) {

    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const url = `${environment.GatewayApiUrl}${this.GatewayApiUrlPrefix}/export/download_export_transaction_saving?accessToken=${this.accessToken.base64EncodedAuthenticationKey}&fromDate=${fromDate}&toDate=${toDate}&accountId=${accountId}&note=${note}&txnCode=${txnCode}&paymentDetail=${paymentDetail}&createdBy=${this.accessToken.userId}`;
    this.getExportExcelFile(url).subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = "V_saving_transaction.xlsx";
      link.click();
    });
  }

  /**
   * @param {string} chargeId Charge ID of charge.
   * @returns {Observable<any>} Charge.
   */
  getChargeTemplate(chargeId: string): Observable<any> {
    const params = { template: "true" };
    return this.http.get(`/charges/${chargeId}`, { params: params });
  }

  /**
   * @param accountId Savings Account Id of account to get data for.
   * @returns {Observable<any>} Savings data.
   */
  getSavingsAccountData(accountId: string): Observable<any> {
    const httpParams = new HttpParams().set("associations", "all");
    return this.http.get(`/savingsaccounts/${accountId}`, { params: httpParams });
  }

  /**
   * @param accountId Savings Account Id of account to get data for.
   * @returns {Observable<any>} Savings data.
   */
  getSavingsAccountNoTransactions(accountId: string): Observable<any> {
    const httpParams = new HttpParams().set("associations", "charges");
    return this.http.get(`/savingsaccounts/${accountId}`, { params: httpParams });
  }

  /**
   * @param accountId Savings Account Id of account to get data for.
   * @returns {Observable<any>} Savings account and template.
   */
  getSavingsAccountAndTemplate(accountId: string, template: boolean): Observable<any> {
    const httpParams = new HttpParams().set("template", template.toString()).set("associations", "charges");
    return this.http.get(`/savingsaccounts/${accountId}`, { params: httpParams });
  }

  /**
   * @param clientId Client Id
   * @param clientName Client Name
   * @param fromAccountId Account Id
   * @param locale Locale
   * @param dateFormat Date Format
   * @returns {Observable<any>} Standing Instructions
   */
  getStandingInstructions(
    clientId: string,
    clientName: string,
    fromAccountId: string,
    locale: string,
    dateFormat: string
  ): Observable<any> {
    const httpParams = new HttpParams()
      .set("clientId", clientId)
      .set("clientName", clientName)
      .set("fromAccountId", fromAccountId)
      .set("fromAccountType", "2")
      .set("locale", locale)
      .set("dateFormat", dateFormat);
    return this.http.get(`/standinginstructions`, { params: httpParams });
  }

  /**
   * @returns {Observable<any>}
   */
  getSavingsDatatables(): Observable<any> {
    const httpParams = new HttpParams().set("apptable", "m_savings_account");
    return this.http.get(`/datatables`, { params: httpParams });
  }

  /**
   * @param accountId account Id of savings account to get datatable for.
   * @param datatableName Data table name.
   * @returns {Observable<any>}
   */
  getSavingsDatatable(accountId: string, datatableName: string): Observable<any> {
    const httpParams = new HttpParams().set("genericResultSet", "true");
    return this.http.get(`/datatables/${datatableName}/${accountId}`, { params: httpParams });
  }

  /**
   * @param accountId account Id of savings account to get add datatable entry for.
   * @param datatableName Data Table name.
   * @param data Data.
   * @returns {Observable<any>}
   */
  addSavingsDatatableEntry(accountId: string, datatableName: string, data: any): Observable<any> {
    const httpParams = new HttpParams().set("genericResultSet", "true");
    return this.http.post(`/datatables/${datatableName}/${accountId}`, data, { params: httpParams });
  }

  /**
   * @param accountId account Id of savings account to get add datatable entry for.
   * @param datatableName Data Table name.
   * @param data Data.
   * @returns {Observable<any>}
   */
  editSavingsDatatableEntry(accountId: string, datatableName: string, data: any): Observable<any> {
    const httpParams = new HttpParams().set("genericResultSet", "true");
    return this.http.put(`/datatables/${datatableName}/${accountId}`, data, { params: httpParams });
  }

  /**
   * @param accountId account Id of savings account to get add datatable entry for.
   * @param datatableName Data Table name.
   * @returns {Observable<any>}
   */
  deleteDatatableContent(accountId: string, datatableName: string): Observable<any> {
    const httpParams = new HttpParams().set("genericResultSet", "true");
    return this.http.delete(`/datatables/${datatableName}/${accountId}`, { params: httpParams });
  }

  /**
   * @param entityId Entity Id assosciated with savings account.
   * @returns {Observable<any>} Savings account template.
   */
  getSavingsAccountTemplate(entityId: string, productId?: string, isGroup?: boolean): Observable<any> {
    let httpParams = new HttpParams().set(isGroup ? "groupId" : "clientId", entityId);
    httpParams = productId ? httpParams.set("productId", productId) : httpParams;
    return this.http.get("/savingsaccounts/template", { params: httpParams });
  }

  /**
   * @param {any} savingsAccount Savings Account
   * @returns {Observable<any>}
   */
  createSavingsAccount(savingsAccount: any): Observable<any> {
    return this.http.post("/savingsaccounts", savingsAccount);
  }

  /**
   * @param {any} savingsAccount Savings Account
   * @returns {Observable<any>}
   */
  updateSavingsAccount(accountId: string, savingsAccount: any): Observable<any> {
    return this.http.put(`/savingsaccounts/${accountId}`, savingsAccount);
  }

  /**
   * @param {string} accountId savings account Id
   * @returns {Observable<any>}
   */
  deleteSavingsAccount(accountId: string): Observable<any> {
    return this.http.delete(`/savingsaccounts/${accountId}`);
  }

  /**
   * @param {string} accountId Savings Account Id
   * @param {string} command Command
   * @param {any} data Data
   * @returns {Observable<any>}
   */
  executeSavingsAccountCommand(accountId: string, command: string, data: any): Observable<any> {
    const httpParams = new HttpParams().set("command", command);
    return this.http.post(`/savingsaccounts/${accountId}`, data, { params: httpParams });
  }

  /**
   * @param {string} accountId Savings Account Id
   * @param {string} command Command
   * @param {any} data Data
   * @returns {Observable<any>}
   */
  executeSavingsAccountUpdateCommand(accountId: string, command: string, data: any): Observable<any> {
    const httpParams = new HttpParams().set("command", command);
    return this.http.put(`/savingsaccounts/${accountId}`, data, { params: httpParams });
  }

  /**
   * @param {string} accountId Savings Account Id
   * @param {string} transactionId Transaction Id
   * @returns {Observable<any>}
   */
  getSavingsAccountTransaction(accountId: string, transactionId: string): Observable<any> {
    return this.http.get(`/savingsaccounts/${accountId}/transactions/${transactionId}`);
  }

  /**
   * @param {string} accountId Savings Account Id
   * @param {string} transactionId Transaction Id
   * @returns {Observable<any>}
   */
  getSavingsAccountTransactionTemplate(accountId: string, transactionId: string): Observable<any> {
    const httpParams = new HttpParams().set("template", "true");
    return this.http.get(`/savingsaccounts/${accountId}/transactions/${transactionId}`, { params: httpParams });
  }

  /**
   * @param {string} accountId Savings Account Id
   * @param {string} command Command
   * @param {any} data Data
   * @param {string} transactionId Transaction Id
   * @returns {Observable<any>}
   */
  executeSavingsAccountTransactionsCommand(
    accountId: string,
    command: string,
    data: any,
    transactionId?: any
  ): Observable<any> {
    const httpParams = new HttpParams().set("command", command);
    if (transactionId) {
      return this.http.post(`/savingsaccounts/${accountId}/transactions/${transactionId}`, data, {
        params: httpParams,
      });
    }
    return this.http.post(`/savingsaccounts/${accountId}/transactions`, data, { params: httpParams });
  }

  updateAccountTransactions(accountId: string, transactionId: string, paymentTypeId: string, note: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
      httpParams = httpParams.set("txnId", transactionId)
      httpParams = httpParams.set("paymentTypeId", paymentTypeId)
      httpParams = httpParams.set("note", note)
    return this.http.post(`${this.GatewayApiUrlPrefix}/savingTransaction/modified_payment_type`, httpParams);
  }

  /**
   * @param {string} accountId savings account Id
   * @param {string} chargeId savings charge Id
   * @returns {Observable<any>}
   */
  getSavingsAccountCharge(accountId: string, chargeId: string): Observable<any> {
    return this.http.get(`/savingsaccounts/${accountId}/charges/${chargeId}`);
  }

  /**
   * @param {string} accountId Savings Account Id
   * @param {string} command Command
   * @param {any} data Data
   * @param {string} chargeId Charge Id
   * @returns {Observable<any>}
   */
  executeSavingsAccountChargesCommand(accountId: string, command: string, data: any, chargeId: any): Observable<any> {
    const httpParams = new HttpParams().set("command", command);
    return this.http.post(`/savingsaccounts/${accountId}/charges/${chargeId}`, data, { params: httpParams });
  }

  /**
   * @param {string} accountId  Savings Account Id
   * @param {any} data Charge Data
   * @param {any} chargeId Charge Id
   * @returns {Observable<any>}
   */
  editSavingsAccountCharge(accountId: string, data: any, chargeId: any): Observable<any> {
    return this.http.put(`/savingsaccounts/${accountId}/charges/${chargeId}`, data);
  }

  /**
   * @param {string} accountId  Savings Account Id
   * @param {any} chargeId Charge Id
   * @returns {Observable<any>}
   */
  deleteSavingsAccountCharge(accountId: string, chargeId: any): Observable<any> {
    return this.http.delete(`/savingsaccounts/${accountId}/charges/${chargeId}`);
  }
}
