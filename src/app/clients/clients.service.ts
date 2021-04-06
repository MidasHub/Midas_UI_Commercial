/** Angular Imports */
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

/** Logger */
import { Logger } from "../core/logger/logger.service";
const log = new Logger("Client");

/** rxjs Imports */
import { Observable } from "rxjs";
import { CommonHttpParams } from "app/shared/CommonHttpParams";

/**
 * Clients service.
 */
@Injectable({
  providedIn: "root",
})
export class ClientsService {
  private credentialsStorageKey = "midasCredentials";
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private IcGatewayApiUrlPrefix: string;
  private cacheClientRequest = {};

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
    this.IcGatewayApiUrlPrefix = environment.IcGatewayApiUrlPrefix;
  }

  loadImageIdentifier(identifierId: string, imageId: string): Observable<any> {
    const url = `/client_identifiers/${identifierId}/documents/${imageId}/attachment?tenantIdentifier=${environment.fineractPlatformTenantId}`;
    return this.http.get(url, { responseType: "blob" });
  }

  getClientCross(clientId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("id", clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/client/get_client_midas_by_id`, httpParams);
  }

  getIdentifierClientCross(clientId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("clientId", clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/client/get_identifier_midas_by_client`, httpParams);
  }

  getFilteredClients(
    orderBy: string,
    sortOrder: string,
    orphansOnly: boolean,
    displayName: string,
    officeId?: any
  ): Observable<any> {
    let httpParams = new HttpParams()
      .set("displayName", displayName)
      .set("orphansOnly", orphansOnly.toString())
      .set("sortOrder", sortOrder)
      .set("orderBy", orderBy);
    if (officeId) {
      httpParams = httpParams.set("officeId", officeId);
    }
    return this.http.get("/clients", { params: httpParams });
  }

  getClients(orderBy: string, sortOrder: string, offset: number, limit: number): Observable<any> {
    const httpParams = new HttpParams()
      .set("offset", offset.toString())
      .set("limit", limit.toString())
      .set("sortOrder", sortOrder)
      .set("orderBy", orderBy);
    return this.http.get("/clients", { params: httpParams });
  }

  getClientsByStaff(orderBy: string, sortOrder: string, offset: number, limit: number,  sqlSearch?: string): Observable<any> {
    const httpParams = new HttpParams()
      .set("offset", offset.toString())
      .set("limit", limit.toString())
      .set("sortOrder", sortOrder)
      .set("orderBy", orderBy)
      .set("sqlSearch", sqlSearch ? sqlSearch : "");
    return this.http.get("/clients", { params: httpParams });
  }

  getClientsByOfficeOfUser(
    orderBy: string,
    sortOrder: string,
    offset: number,
    limit: number,
    sqlSearch?: string
  ): Observable<any> {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    if (!this.accessToken.permissions.includes("POS_UPDATE")) {
      sqlSearch += ` AND c.staff_id = ${this.accessToken.staffId} `;
    }
    let httpParams = new HttpParams()
      // .set('fields', 'displayName,mobileNo,accountNo,externalId,active,mobileNo,gender,officeName,staffName')
      .set("offset", offset.toString())
      .set("limit", limit.toString())
      .set("sortOrder", sortOrder)
      .set("orderBy", orderBy)
      .set("sqlSearch", sqlSearch ? sqlSearch : "");

    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );

    if (!this.accessToken.permissions.includes("ALL_FUNCTIONS")) {
      httpParams = httpParams.set("officeId", this.accessToken.officeId);
    }

    return this.http.get("/clients", { params: httpParams });
  }

  getICClient(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/client/get_ic_client`, httpParams);
  }

  getICClientAccount(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.IcGatewayApiUrlPrefix}/client/get_ic_client_account`, httpParams);
  }

  getClientTemplate(): Observable<any> {
    return this.http.get("/clients/template");
  }

  getClientData(clientId: string) {
    const key = `getClientData_${clientId}`;
    if (this.cacheClientRequest[key]) {
      return this.cacheClientRequest[key];
    } else {
      return this.http.get(`/clients/${clientId}`).subscribe((result) => {
        if (result) {
          this.cacheClientRequest[key] = result;
          return this.cacheClientRequest[key];
        }
      });
    }
  }

  createClient(client: any) {
    return this.http.post(`/clients`, client);
  }

  updateClient(clientId: string, client: any) {
    return this.http.put(`/clients/${clientId}`, client);
  }

  deleteClient(clientId: string) {
    return this.http.delete(`/clients/${clientId}`);
  }

  getClientDataAndTemplate(clientId: string) {
    const httpParams = new HttpParams().set("template", "true").set("staffInSelectedOfficeOnly", "true");
    return this.http.get(`/clients/${clientId}`, { params: httpParams });
  }

  getClientDatatables() {
    const httpParams = new HttpParams().set("apptable", "m_client");
    return this.http.get(`/datatables`, { params: httpParams });
  }

  getClientDatatable(clientId: string, datatableName: string) {
    const httpParams = new HttpParams().set("genericResultSet", "true");
    return this.http.get(`/datatables/${datatableName}/${clientId}`, { params: httpParams });
  }

  addClientDatatableEntry(clientId: string, datatableName: string, data: any) {
    const httpParams = new HttpParams().set("genericResultSet", "true");
    return this.http.post(`/datatables/${datatableName}/${clientId}`, data, { params: httpParams });
  }

  editClientDatatableEntry(clientId: string, datatableName: string, data: any) {
    const httpParams = new HttpParams().set("genericResultSet", "true");
    return this.http.put(`/datatables/${datatableName}/${clientId}`, data, { params: httpParams });
  }

  deleteDatatableContent(clientId: string, datatableName: string) {
    const httpParams = new HttpParams().set("genericResultSet", "true");
    return this.http.delete(`/datatables/${datatableName}/${clientId}`, { params: httpParams });
  }

  getClientAccountData(clientId: string) {
    return this.http.get(`/clients/${clientId}/accounts`);
  }

  getClientAccountDataWithQuery(clientId: string, query: string): Observable<any> {
    return this.http.get(`/clients/${clientId}/accounts?${query}`);
  }

  getClientById(clientId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("id", clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/client/get_client_by_id`, httpParams);
  }

  getClientAccountDataCross(clientId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("id", clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/client/get_client_account_by_id`, httpParams);
  }

  getClientOfStaff(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/client/get_client_of_staff`, httpParams);
  }

  getClientChargesData(clientId: string) {
    const httpParams = new HttpParams().set("pendingPayment", "true");
    return this.http.get(`/clients/${clientId}/charges`, { params: httpParams });
  }

  getSelectedChargeData(clientId: string, chargeId: string) {
    const httpParams = new HttpParams().set("associations", "all");
    return this.http.get(`/clients/${clientId}/charges/${chargeId}`, { params: httpParams });
  }

  /**
   * @param chargeData Charge Data to be waived.
   */
  waiveClientCharge(chargeData: any) {
    const httpParams = new HttpParams().set("command", "waive");
    return this.http.post(`/clients/${chargeData.clientId}/charges/${chargeData.resourceType}`, chargeData, {
      params: httpParams,
    });
  }

  getAllClientCharges(clientId: string) {
    return this.http.get(`/clients/${clientId}/charges`);
  }

  /**
   * @param transactionData Transaction Data to be undone.
   */
  undoTransaction(transactionData: any) {
    return this.http.post(
      `/clients/${transactionData.clientId}/transactions/${transactionData.transactionId}?command=undo`,
      transactionData
    );
  }

  /**
   * @param clientId Client Id of the relevant charge.
   * @param chargeId Charge Id to be deleted.
   */
  deleteCharge(clientId: string, chargeId: string) {
    return this.http.delete(`/clients/${clientId}/charges/${chargeId}?associations=all`);
  }

  /*
   * @param clientId Client Id of payer.
   * @param chargeId Charge Id of the charge to be paid.
   */
  getClientTransactionPay(clientId: string, chargeId: string) {
    return this.http.get(`/clients/${clientId}/charges/${chargeId}`);
  }

  /**
   * @param clientId Client Id of the payment.
   * @param chargeId Charge Id of the payment.
   * @param payment  Client Payment data.
   */
  payClientCharge(clientId: string, chargeId: string, payment: any) {
    const httpParams = new HttpParams().set("command", "paycharge");
    return this.http.post(`/clients/${clientId}/charges/${chargeId}?command=paycharge`, payment, {
      params: httpParams,
    });
  }

  getClientSummary(clientId: string) {
    const httpParams = new HttpParams().set("R_clientId", clientId).set("genericResultSet", "false");
    return this.http.get(`/runreports/ClientSummary`, { params: httpParams });
  }

  getClientProfileImage(clientId: string) {
    const httpParams = new HttpParams().set("maxHeight", "150");
    return this.http
      .skipErrorHandler()
      .get(`/clients/${clientId}/images`, { params: httpParams, responseType: "text" });
  }

  uploadClientProfileImage(clientId: string, image: File) {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("filename", "file");
    return this.http.post(`/clients/${clientId}/images`, formData);
  }

  uploadCapturedClientProfileImage(clientId: string, imageURL: string) {
    return this.http.post(`/clients/${clientId}/images`, imageURL);
  }

  deleteClientProfileImage(clientId: string) {
    return this.http.delete(`/clients/${clientId}/images`);
  }

  uploadClientSignatureImage(clientId: string, signature: File) {
    const formData = new FormData();
    formData.append("file", signature);
    formData.append("filename", signature.name);
    return this.http.post(`/clients/${clientId}/images`, formData);
  }

  getClientSignatureImage(clientId: string, documentId: string) {
    const httpParams = new HttpParams().set("tenantIdentifier", environment.fineractPlatformTenantId);
    return this.http.get(`/clients/${clientId}/documents/${documentId}/attachment`, {
      params: httpParams,
      responseType: "blob",
    });
  }

  getClientFamilyMembers(clientId: string) {
    return this.http.get(`/clients/${clientId}/familymembers`);
  }

  getClientFamilyMember(clientId: string, familyMemberId: string) {
    return this.http.get(`/clients/${clientId}/familymembers/${familyMemberId}`);
  }

  addFamilyMember(clientId: string, familyMemberData: any) {
    return this.http.post(`/clients/${clientId}/familymembers`, familyMemberData);
  }

  editFamilyMember(clientId: string, familyMemberId: any, familyMemberData: any) {
    return this.http.put(`/clients/${clientId}/familymembers/${familyMemberId}`, familyMemberData);
  }

  deleteFamilyMember(clientId: string, familyMemberId: string) {
    return this.http.delete(`/clients/${clientId}/familymembers/${familyMemberId}`);
  }

  getClientIdentifiers(clientId: string) {
    return this.http.get(`/clients/${clientId}/identifiers`);
  }

  getClientIdentifierTemplate(clientId: string) {
    return this.http.get(`/clients/${clientId}/identifiers/template`);
  }

  addClientIdentifier(clientId: string, identifierData: any) {
    return this.http.post(`/clients/${clientId}/identifiers`, identifierData);
  }

  deleteClientIdentifier(clientId: string, identifierId: string) {
    return this.http.delete(`/clients/${clientId}/identifiers/${identifierId}`);
  }

  getClientIdentificationDocuments(documentId: string) {
    return this.http.get(`/client_identifiers/${documentId}/documents`);
  }

  downloadClientIdentificationDocument(parentEntityId: string, documentId: string) {
    return this.http.get(`/client_identifiers/${parentEntityId}/documents/${documentId}/attachment`, {
      responseType: "blob",
    });
  }

  uploadClientIdentifierDocument(identifierId: string, documentData: any) {
    return this.http.post(`/client_identifiers/${identifierId}/documents`, documentData);
  }

  getClientDocuments(clientId: string) {
    return this.http.get(`/clients/${clientId}/documents`);
  }

  downloadClientDocument(parentEntityId: string, documentId: string) {
    return this.http.get(`/clients/${parentEntityId}/documents/${documentId}/attachment`, { responseType: "blob" });
  }

  uploadClientDocument(clientId: string, documentData: any) {
    return this.http.post(`/clients/${clientId}/documents`, documentData);
  }

  uploadClientDocumenttenantIdentifier(clientId: string, documentData: any): Observable<any> {
    return this.http.post(`/clients/${clientId}/documents?tenantIdentifier=${environment.fineractPlatformTenantId}`, documentData);
  }

  deleteClientDocument(parentEntityId: string, documentId: string) {
    return this.http.delete(`/clients/${parentEntityId}/documents/${documentId}`);
  }

  getClientNotes(clientId: string) {
    return this.http.get(`/clients/${clientId}/notes`);
  }

  createClientNote(clientId: string, noteData: any) {
    return this.http.post(`/clients/${clientId}/notes`, noteData);
  }

  editClientNote(clientId: string, noteId: string, noteData: any) {
    return this.http.put(`/clients/${clientId}/notes/${noteId}`, noteData);
  }

  deleteClientNote(clientId: string, noteId: string) {
    return this.http.delete(`/clients/${clientId}/notes/${noteId}`);
  }

  getAddressFieldConfiguration() {
    return this.http.get(`/fieldconfiguration/ADDRESS`);
  }

  getClientAddressData(clientId: string) {
    return this.http.get(`/client/${clientId}/addresses`);
  }

  getClientAddressTemplate() {
    return this.http.get(`/client/addresses/template`);
  }

  createClientAddress(clientId: string, addressTypeId: string, addressData: any) {
    return this.http.post(`/client/${clientId}/addresses?type=${addressTypeId}`, addressData);
  }

  editClientAddress(clientId: string, addressTypeId: string, addressData: any) {
    return this.http.put(`/client/${clientId}/addresses?type=${addressTypeId}`, addressData);
  }

  executeClientCommand(clientId: string, command: string, data: any): Observable<any> {
    const httpParams = new HttpParams().set("command", command);
    return this.http.post(`/clients/${clientId}`, data, { params: httpParams });
  }

  getClientCommandTemplate(command: string): Observable<any> {
    const httpParams = new HttpParams().set("commandParam", command);
    return this.http.get(`/clients/template`, { params: httpParams });
  }

  getClientTransferProposalDate(clientId: any): Observable<any> {
    return this.http.get(`/clients/${clientId}/transferproposaldate`);
  }

  getClientChargeTemplate(clientId: any): Observable<any> {
    return this.http.get(`/clients/${clientId}/charges/template`);
  }

  getChargeAndTemplate(chargeId: any): Observable<any> {
    const httpParams = new HttpParams().set("template", "true");
    return this.http.get(`/charges/${chargeId}`, { params: httpParams });
  }

  createClientCharge(clientId: any, charge: any) {
    return this.http.post(`/clients/${clientId}/charges`, charge);
  }

  getClientReportTemplates() {
    const httpParams = new HttpParams().set("entityId", "0").set("typeId", "0");
    return this.http.get("/templates", { params: httpParams });
  }

  retrieveClientReportTemplate(templateId: string, clientId: string) {
    const httpParams = new HttpParams().set("clientId", clientId);
    return this.http.post(`/templates/${templateId}`, {}, { params: httpParams, responseType: "text" });
  }

  /**
   * @returns {Observable<any>} Offices data
   */
  getOffices(): Observable<any> {
    return this.http.get("/offices");
  }

  /**
   * returns the list of survey data of the particular Client
   * @param clientId
   */
  getSurveys(clientId: string) {
    return this.http.get(`/surveys/scorecards/clients/${clientId}`);
  }

  /**
   * returns the list of survey types and questions
   */
  getAllSurveysType() {
    return this.http.get("/surveys");
  }

  /**
   * returns the response from the post request for that survey
   * @param surveyId
   * @param surveyData Survey Data submitted by client
   */
  createNewSurvey(surveyId: Number, surveyData: any) {
    return this.http.post(`/surveys/scorecards/${surveyId}`, surveyData);
  }

  /**
   * @param userData User Data.
   */
  createSelfServiceUser(userData: any) {
    return this.http.post(`/users`, userData);
  }

  getBalanceAccountOfCustomer(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/get_list_balance_customer`, httpParams);
  }

  getListUserTeller(officeId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("officeIdFilter", officeId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_user_off_office`, httpParams);
  }

  getStaffsByOffice(officeId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("officeIdSelected", officeId);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_staff_by_office`, httpParams);
  }

  getStaffOfUser(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_staff_of_user`, httpParams);
  }

  getBalanceOfTeller(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/get_list_balance_teller`, httpParams);
  }

  makeFundForMGM(accountSavingIdFrom: string, mgm_name: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("accountSavingIdFrom", accountSavingIdFrom);
    httpParams = httpParams.set("mgm_name", mgm_name);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/make_fund_for_mgm`, httpParams);
  }
}
