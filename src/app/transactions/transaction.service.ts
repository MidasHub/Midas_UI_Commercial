/** Angular Imports */
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

/** rxjs Imports */
import { Observable } from "rxjs";
import { CommonHttpParams } from "app/shared/CommonHttpParams";

/**
 * Transaction service.
 */
@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private credentialsStorageKey = "midasCredentials";
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private environment: any;
  private IcGatewayApiUrlPrefix: any;
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
    this.IcGatewayApiUrlPrefix = environment.IcGatewayApiUrlPrefix;
    this.environment = environment;
  }

  getFeeSuggestByProduct(
    accountTypeCode: string,
    requestAmount: number,
    productId: string,
    clientId: number
  ): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("accountTypeId", accountTypeCode);
    httpParams = httpParams.set("requestAmount", String(requestAmount));
    httpParams = httpParams.set("productId", productId);
    httpParams = httpParams.set("clientId", String(clientId));

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/get_fee_suggest_by_product`, httpParams);
  }

  getTransactionIc(payload: {
    fromDate: string;
    toDate: string;
    terminalId: string;
    bankCode: string;
    partner: string;
  }): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("fromDate", payload.fromDate);
    httpParams = httpParams.set("toDate", payload.toDate);
    httpParams = httpParams.set("terminalId", payload.terminalId);
    httpParams = httpParams.set("bankCode", payload.bankCode);
    httpParams = httpParams.set("partner", payload.partner);

    return this.http.post(`${this.IcGatewayApiUrlPrefix}/transaction/get_list_pos_transaction_cross`, httpParams);
  }

  mappingInvoiceWithTransaction(
    accountTypeCode: string,
    accountBankId: string,
    accountNumber: string,
    identifierId: string,
    amountTransaction: number,
    terminalId: string
  ): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("accountNumber", accountNumber);
    httpParams = httpParams.set("ext4", identifierId);
    httpParams = httpParams.set("AmountMappingInvoice", String(this.formatLong(String(amountTransaction))));
    httpParams = httpParams.set("accountTypeId", accountTypeCode);
    httpParams = httpParams.set("accountBankId", accountBankId);
    httpParams = httpParams.set("terminalId", terminalId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/mapping_invoice_transaction`, httpParams);
  }

  ExecuteRollTermTransactionByTrnRefNo(form: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    const keys = Object.keys(form);
    for (const key of keys) {
      if (key.includes("amount")) {
        httpParams = httpParams.set(key, String(Number(form[key])));
      } else {
        httpParams = httpParams.set(key, form[key]);
      }
    }
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/repayment_roll_term_manual_transaction`,
      httpParams
    );
  }

  getExecuteRollTermTransactionByTrnRefNo(refId: number): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("refId", String(refId));

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/get_execute_loan_transaction_template`,
      httpParams
    );
  }

  getTransactionHistoryByClientId(clientId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("clientId", clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/get_list_transaction_by_client`, httpParams);
  }

  /**
   * @params : expiredDate
   * @params : refId
   * @params : note
   * @params : state
   * @params : state
   * @params : dueDay
   * @params : limit
   * @params : classCard
   * @params : isHold
   */
  updateCardTrackingState(updateData: any): Observable<any> {
    const expiredDateString = `${updateData.dueDay}/${updateData.expiredDateString?.substring(
      0,
      2
    )}/${updateData.expiredDateString?.substring(2, 4)}`;
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("expiredDate", expiredDateString ? expiredDateString : "");
    httpParams = httpParams.set("refId", updateData.refId);
    httpParams = httpParams.set("note", updateData.note ? updateData.note : "");
    httpParams = httpParams.set("state", updateData.trackingState ? updateData.trackingState : "A");
    httpParams = httpParams.set("dueDay", updateData.dueDay ? updateData.dueDay : "1");
    httpParams = httpParams.set("limit", updateData.limitCard ? updateData.limitCard : "");
    httpParams = httpParams.set("classCard", updateData.classCard ? updateData.classCard : "");
    httpParams = httpParams.set("isHold", updateData.isHold ? "200" : "100");
    httpParams = httpParams.set("year", updateData.year);
    httpParams = httpParams.set("month", updateData.month);

    return this.http.put<any>(`${this.GatewayApiUrlPrefix}/card/update_card_on_due_day`, httpParams);
  }

  updateCardInfo(updateData: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("expiredDate", `${updateData.dueDay}/${updateData.expiredDateString}`);
    httpParams = httpParams.set("refId", updateData.refid);
    httpParams = httpParams.set("dueDay", updateData.dueDay);
    httpParams = httpParams.set("limit", updateData.limit);
    httpParams = httpParams.set("classCard", updateData.classCard);

    return this.http.put<any>(`${this.GatewayApiUrlPrefix}/card/update_card_day_info`, httpParams);
  }

  getCardDueDayTemplate(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card/get_card_due_day_template`, httpParams);
  }

  submitTransactionCash(transactionInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("accountNumber", transactionInfo.identifyClientDto.accountNumber);
    httpParams = httpParams.set("accountBankId", transactionInfo.identifyClientDto.accountBankId);
    httpParams = httpParams.set("accountTypeId", transactionInfo.identifyClientDto.accountTypeId);
    // httpParams = httpParams.set('accountCash', transactionInfo.accountCash);
    httpParams = httpParams.set("bNo", transactionInfo.batchNo);
    httpParams = httpParams.set("tid", transactionInfo.traceNo);
    httpParams = httpParams.set("terminalAmount", String(this.formatLong(transactionInfo.terminalAmount)));
    httpParams = httpParams.set("feeRate", transactionInfo.rate);
    httpParams = httpParams.set("toClientId", transactionInfo.clientId);
    httpParams = httpParams.set("feeAmount", transactionInfo.feeAmount);
    httpParams = httpParams.set("cogsRate", transactionInfo.cogsRate);
    httpParams = httpParams.set("cogsAmount", transactionInfo.feeCogs);
    httpParams = httpParams.set("pnlAmount", transactionInfo.feePNL);
    httpParams = httpParams.set("invoiceAmount", String(this.formatLong(transactionInfo.txnAmount)));
    httpParams = httpParams.set("requestAmount", String(this.formatLong(transactionInfo.requestAmount)));
    httpParams = httpParams.set("transferAmount", String(this.formatLong(transactionInfo.txnAmount)));
    httpParams = httpParams.set("bills", transactionInfo.invoiceMapping.listInvoice);
    httpParams = httpParams.set("productId", transactionInfo.productId);
    httpParams = httpParams.set("groupId", transactionInfo.clientDto.groupId);
    httpParams = httpParams.set("customerName", transactionInfo.clientDto.displayName);
    httpParams = httpParams.set("terminalId", transactionInfo.terminalId);
    httpParams = httpParams.set("ext2", transactionInfo.type);
    httpParams = httpParams.set("ext4", transactionInfo.identifierId);

    if (transactionInfo.minFeeApply && transactionInfo.minFeeApply > 0 && transactionInfo.minFeeApply > transactionInfo.feeAmount) {
      httpParams = httpParams.set("minFeeApply", transactionInfo.minFeeApply);
    }
    if (transactionInfo.accountCash) {
      httpParams = httpParams.set("accountCash", transactionInfo.accountCash);
    }

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/create_cash_retail_transaction`, httpParams);
  }

  submitTransactionCashFromRollTermTransaction(transactionInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("accountNumber", transactionInfo.identifyClientDto.accountNumber);
    httpParams = httpParams.set("accountBankId", transactionInfo.identifyClientDto.accountBankId);
    httpParams = httpParams.set("accountTypeId", transactionInfo.identifyClientDto.accountTypeId);
    httpParams = httpParams.set("refid", transactionInfo.refId);
    httpParams = httpParams.set("bNo", transactionInfo.batchNo);
    httpParams = httpParams.set("tid", transactionInfo.traceNo);
    httpParams = httpParams.set("terminalAmount", String(this.formatLong(transactionInfo.terminalAmount)));
    httpParams = httpParams.set("feeRate", transactionInfo.rate);
    httpParams = httpParams.set("feeAmount", transactionInfo.feeAmount);
    httpParams = httpParams.set("cogsRate", transactionInfo.cogsRate);
    httpParams = httpParams.set("cogsAmount", transactionInfo.feeCogs);
    httpParams = httpParams.set("pnlAmount", transactionInfo.feePNL);
    httpParams = httpParams.set("bookingId", transactionInfo.bookingId);
    httpParams = httpParams.set("invoiceAmount", String(this.formatLong(transactionInfo.txnAmount)));
    httpParams = httpParams.set("requestAmount", String(this.formatLong(transactionInfo.requestAmount)));
    httpParams = httpParams.set("transferAmount", String(this.formatLong(transactionInfo.txnAmount)));
    httpParams = httpParams.set("bills", transactionInfo.invoiceMapping.listInvoice);
    httpParams = httpParams.set("productId", transactionInfo.productId);
    httpParams = httpParams.set("customerName", transactionInfo.clientDto.displayName);
    httpParams = httpParams.set("terminalId", transactionInfo.terminalId);
    httpParams = httpParams.set("toClientId", transactionInfo.clientId);

    if (transactionInfo.minFeeApply && transactionInfo.minFeeApply > 0) {
      httpParams = httpParams.set("minFeeApply", transactionInfo.minFeeApply);
    }
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/create_retail_cash_from_rollTerm_transaction`,
      httpParams
    );
  }

  submitTransactionRollTerm(transactionInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("accountNumber", transactionInfo.identifyClientDto.accountNumber);
    httpParams = httpParams.set("accountBankId", transactionInfo.identifyClientDto.accountBankId);
    httpParams = httpParams.set("accountTypeId", transactionInfo.identifyClientDto.accountTypeId);
    httpParams = httpParams.set("accountCash", transactionInfo.accountCash ? transactionInfo.accountCash : "");
    httpParams = httpParams.set("feeRate", transactionInfo.rate);
    httpParams = httpParams.set("feeAmount", transactionInfo.feeAmount);
    httpParams = httpParams.set("toClientId", transactionInfo.clientId);
    httpParams = httpParams.set("requestAmount", String(this.formatLong(transactionInfo.requestAmount)));
    httpParams = httpParams.set("productId", transactionInfo.productId);
    httpParams = httpParams.set("groupId", transactionInfo.clientDto.groupId);
    httpParams = httpParams.set("customerName", transactionInfo.clientDto.displayName);
    httpParams = httpParams.set("ext2", transactionInfo.type);
    httpParams = httpParams.set("BookingInternalDtoListString", transactionInfo.BookingInternalDtoListString);
    httpParams = httpParams.set("ext4", transactionInfo.identifierId);

    if (transactionInfo.accountCash) {
      httpParams = httpParams.set("accountCash", transactionInfo.accountCash);
    }
    if (transactionInfo.minFeeApply && transactionInfo.minFeeApply > 0) {
      httpParams = httpParams.set("minFeeApply", transactionInfo.minFeeApply);
    }
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/create_rollTerm_retail_transaction`,
      httpParams
    );
  }

  submitTransactionRollTermOnDialog(transactionInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("bookingId", transactionInfo.bookingId);
    httpParams = httpParams.set("accountNumber", transactionInfo.panNumber);
    httpParams = httpParams.set("accountBankId", transactionInfo.bankCode);
    httpParams = httpParams.set("accountTypeId", transactionInfo.cardType);
    httpParams = httpParams.set("feeRate", transactionInfo.rate);
    httpParams = httpParams.set("toClientId", transactionInfo.clientId);
    httpParams = httpParams.set("requestAmount", transactionInfo.requestAmount);
    httpParams = httpParams.set("productId", transactionInfo.productId);
    httpParams = httpParams.set("groupId", transactionInfo.groupId);
    httpParams = httpParams.set("customerName", transactionInfo.clientName);
    httpParams = httpParams.set("ext2", transactionInfo.type);
    httpParams = httpParams.set("BookingInternalDtoListString", transactionInfo.BookingInternalDtoListString);
    httpParams = httpParams.set("ext4", transactionInfo.identifierId);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/create_rollTerm_retail_transaction`,
      httpParams
    );
  }

  getTransaction(payload: { fromDate: string; toDate: string }): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("fromDate", payload.fromDate);
    httpParams = httpParams.set("toDate", payload.toDate);

    console.log("this: ", this);
    return this.http.post(`${this.GatewayApiUrlPrefix}/transaction/get_list_pos_transaction`, httpParams);
  }

  getListRollTermTransactionOpenByUserId(
    payload: any,
    limit: number,
    offset: number): Observable<any> {

    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("bankFilter", !payload.bankFilter ? "%%" : payload.bankFilter.bankCode);
    httpParams = httpParams.set("cardTypeFilter", payload.cardTypeFilter == "ALL" ? "%%" : payload.cardTypeFilter);
    httpParams = httpParams.set("createdByFilter", !payload.createdByFilter ? "%%" : payload.createdByFilter);
    httpParams = httpParams.set("customerSearch", !payload.query ? "%%" : `%${payload.query}%`);
    httpParams = httpParams.set("cardNumber", !payload.cardNumber ? "%%" : `%${payload.cardNumber}`);
    httpParams = httpParams.set("officeSearch", !payload.officeFilter ? "%%" : `${payload.officeFilter}`);
    httpParams = httpParams.set("dueDayFilter", !payload.dueDayFilter ? "-1" : `${payload.dueDayFilter}`);
    httpParams = httpParams.set("viewDoneTransaction", `${payload.viewDoneTransaction}`);
    httpParams = httpParams.set("viewOverPaidTransaction", `${payload.viewOverPaidTransaction}`);
    httpParams = httpParams.set("cardHoldFilter", payload.cardHoldFilter == "ALL" ? "%%" : payload.cardHoldFilter);
    httpParams = httpParams.set("isCheckedFilter", payload.isCheckedFilter ? payload.isCheckedFilter : "0");
    httpParams = httpParams.set(
      "checkedByUserName",
      !payload.checkedByUserName ? "%%" : `%${payload.checkedByUserName}%`
    );
    httpParams = httpParams.set("limit", String(limit));
    httpParams = httpParams.set("offset", String(offset));
    httpParams = httpParams.set("fromDate", payload.fromDate);
    httpParams = httpParams.set("toDate", payload.toDate);

    if(payload.rangeAmountCode){

      httpParams = httpParams.set("fromFilterAmount", payload.rangeAmountCode.min);
      httpParams = httpParams.set("toFilterAmount", payload.rangeAmountCode.max);

    }
    return this.http.post(`${this.GatewayApiUrlPrefix}/transaction/get_list_pos_transaction_rollterm`, httpParams);
  }

  getListCardOnDueDayByUserId(payload: {
    fromDate: string;
    toDate: string;
    limit: number;
    offset: number;
    stageFilter: string;
    statusFilter: string;
    staffFilter: string;
    cardHoldFilter: string;
    bankName: any;
    cardType: string;
    query: string;
    viewDoneTransaction: string;
  }): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("query", !payload.query ? `%%` : `%${payload.query}%`);
    httpParams = httpParams.set("agencyName", "%%");
    httpParams = httpParams.set("limit", String(payload.limit));
    httpParams = httpParams.set("offset", String(payload.offset));
    httpParams = httpParams.set("amountTransaction", "%%");
    httpParams = httpParams.set("trackingState", payload.stageFilter === "ALL" ? `%%` : `${payload.stageFilter}`);
    httpParams = httpParams.set("trackingStatus", payload.statusFilter === "ALL" ? `%%` : `${payload.statusFilter}`);
    httpParams = httpParams.set("staffFilter", payload.staffFilter === "ALL" ? `%%` : `${payload.staffFilter}`);
    httpParams = httpParams.set(
      "cardHoldFilter",
      payload.cardHoldFilter === "ALL" ? `%%` : `${payload.cardHoldFilter}`
    );
    httpParams = httpParams.set("bankName", !payload.bankName ? "%%" : payload.bankName.bankCode);
    httpParams = httpParams.set("cardType", payload.cardType === "ALL" ? `%%` : `${payload.cardType}`);
    httpParams = httpParams.set("viewDoneTransaction", `${payload.viewDoneTransaction}`);
    httpParams = httpParams.set("fromDate", payload.fromDate);
    httpParams = httpParams.set("toDate", payload.toDate);

    return this.http.post(`${this.GatewayApiUrlPrefix}/card/get_list_card_on_due_day`, httpParams);
  }

  checkValidRetailCashTransaction(clientId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("clientId", clientId);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/check_valid_for_retail_transaction`,
      httpParams
    );
  }

  checkExtraCardInfo(clientId: string, identifierId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("userIdentifyId", identifierId);
    httpParams = httpParams.set("userId", clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card/check_extra_card_info`, httpParams);
  }

  checkValidCreateRollTermTransaction(identifierId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("documentId", identifierId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/check_valid_rollTerm_transaction`, httpParams);
  }

  getTransactionTemplate(clientId: string, identifierId: string, transactionId?: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("identifyId", identifierId);
    httpParams = httpParams.set("clientId", clientId);
    httpParams = httpParams.set("transactionId", !transactionId ? "" : transactionId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/get_retail_transaction_template`, httpParams);
  }

  getTransactionDetail(transactionId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("transactionId", transactionId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/get_transaction`, httpParams);
  }

  formatLong(value: string) {
    value = String(value);
    const neg = value.startsWith("-");
    value = value.replace(/[^0-9]+/g, "");
    if (neg) {
      value = "-".concat(value);
    }
    return Number(value);
  }

  downloadVoucher(transactionId: string) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const url = `${this.environment.GatewayApiUrl}${this.GatewayApiUrlPrefix}/export/download_voucher?id=${transactionId}&accessToken=${this.accessToken.base64EncodedAuthenticationKey}&createdBy=${this.accessToken.userId}`;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      let a;
      if (xhr.readyState === 4 && xhr.status === 200) {
        a = document.createElement("a");
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = `V_${transactionId}`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
      }
    };

    xhr.open("GET", url);
    if (this.environment.isNewBillPos) {
      xhr.setRequestHeader("Gateway-TenantId", window.localStorage.getItem("Gateway-TenantId"));
    }
    xhr.responseType = "blob";
    xhr.send();
  }

  downloadBill(clientId: string, documentId: string) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      let a;
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        a = document.createElement("a");
        a.href = window.URL.createObjectURL(xhttp.response);
        a.download = "bill_" + clientId + "_" + documentId;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
      }
    };
    const fileUrl =
      this.environment.GatewayApiUrl +
      `${this.environment.apiProvider}${this.environment.apiVersion}/clients/` +
      clientId +
      "/documents/" +
      documentId +
      `/attachment?tenantIdentifier=${window.localStorage.getItem("Fineract-Platform-TenantId")}`;
    xhttp.open("GET", fileUrl);
    xhttp.setRequestHeader("Authorization", "Bearer " + this.accessToken.base64EncodedAuthenticationKey);
    xhttp.responseType = "blob";
    xhttp.send();
  }

  revertTransaction(transactionId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("transactionId", transactionId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/revert_transaction`, httpParams);
  }

  uploadBillForBranchBooking(bookingRefNo: string, base64Image: string): Observable<any> {
    const httpParams = this.commonHttpParams.getCommonHttpParams();
    const Params = {
      createdBy: httpParams.get("createdBy"),
      accessToken: httpParams.get("accessToken"),
      officeId: httpParams.get("officeId"),
      staffId: httpParams.get("staffId"),
      bookingRefNo: bookingRefNo,
      fileSubmitBase64: base64Image,
    };

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/upload_bill_file_branch_booking`, Params);
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const width = image.width;
        const height = image.height;

        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
        }

        let newWidth;
        let newHeight;

        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0, newWidth, newHeight);

        canvas.toBlob((b) => {
          return resolve(<File>b);
        }, file.type);
      };
      image.onerror = reject;
    });
  }

  cancelSubmitTransaction(
    bookingInternalId: string,
    bookingRefNo: string
  ): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("bookingInternalId", bookingInternalId);
    httpParams = httpParams.set("bookingRefNo", bookingRefNo);


    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/cancel_submit_transaction_by_office`, httpParams);
  }

  submitTransactionUpToiNow(
    listTransactionSubmitInfo: any,
    note: string,
    terminalSubmit: string,
    terminalNameSubmit: string,
    fromDate: string,
    toDate: string
  ): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    const Params = {
      createdBy: httpParams.get("createdBy"),
      accessToken: httpParams.get("accessToken"),
      officeId: httpParams.get("officeId"),
      staffId: httpParams.get("staffId"),
      note: note,
      terminalSubmit: terminalSubmit,
      terminalNameSubmit: terminalNameSubmit,
      listTransactionSubmitInfo: listTransactionSubmitInfo,
      fromDate: fromDate,
      toDate: toDate,
    };

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/submit_transaction_by_office`, Params);
  }

  RepaymentRolltermManualTransactionCloseLoan(refId: string, amountPaid: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("txnCode", refId);
    httpParams = httpParams.set("amountPaid", amountPaid);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/repayment_roll_term_manual_transaction_close_loan`,
      httpParams
    );
  }

  undoRevertTransaction(transactionId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("transactionId", transactionId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/undo_revert_transaction`, httpParams);
  }

  uploadBosInformation(transId: string, payload: { traceNo: string; batchNo: string }): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("traceNo", payload.traceNo);
    httpParams = httpParams.set("batchNo", payload.batchNo);
    httpParams = httpParams.set("transId", transId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/update_pending_transaction`, httpParams);
  }

  getExportExcelFile(url: string) {
    const httpOptions = {
      responseType: "blob" as "json",
      headers: new HttpHeaders({
        "Gateway-TenantId": window.localStorage.getItem("Gateway-TenantId"),
      }),
    };

    return this.http.get(url, httpOptions);
  }

  exportTransactionForPartner(query: string) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    // tslint:disable-next-line:max-line-length
    const fileUrl = `${this.environment.GatewayApiUrl}${this.environment.GatewayApiUrlPrefix}/export/export_transaction_partner?ext5=ALL&typeExport=transaction&accessToken=${this.accessToken.base64EncodedAuthenticationKey}&createdBy=${this.accessToken.userId}&${query}`;
    this.getExportExcelFile(fileUrl).subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = "V_transaction_partner.xlsx";
      link.click();
    });
  }

  exportTransaction(query: string) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    // tslint:disable-next-line:max-line-length
    const fileUrl = `${this.environment.GatewayApiUrl}${this.environment.GatewayApiUrlPrefix}/export/export_transaction?ext5=ALL&typeExport=transaction&accessToken=${this.accessToken.base64EncodedAuthenticationKey}&createdBy=${this.accessToken.userId}&staffId=${this.accessToken.staffId}&${query}`;
    this.getExportExcelFile(fileUrl).subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = "V_transaction.xlsx";
      link.click();
    });
  }
  exportTransactionBatch(batchNo: string) {
    // tslint:disable-next-line:max-line-length
    const fileUrl = `${this.environment.GatewayApiUrl}${this.environment.GatewayApiUrlPrefix}/export/pre_export_batch_transaction?ext5=ALL&typeExport=transaction&accessToken=${this.accessToken.base64EncodedAuthenticationKey}&createdBy=${this.accessToken.userId}&batchNo=${batchNo}`;
    this.getExportExcelFile(fileUrl).subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = `batch_${batchNo}_transactions_.xlsx`;
      link.click();
    });
  }
  getFeePaidTransactions(fromDate: string, toDate: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("fromDate", fromDate);
    httpParams = httpParams.set("toDate", toDate);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/get_list_fee_transaction_on_range_date`,
      httpParams
    );
  }

  getPaymentTypes(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_payment`, httpParams);
  }

  getFeePaidTransactionByTnRefNo(trnRefNo: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("trnRefNo", trnRefNo);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/get_list_fee_transaction_by_trn_ref_no`,
      httpParams
    );
  }

  paidFeeForTransaction(form: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    const keys = Object.keys(form);
    for (const key of keys) {
      if (key.includes("amount")) {
        httpParams = httpParams.set(key, String(Number(form[key])));
      } else {
        httpParams = httpParams.set(key, form[key]);
      }
    }
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/paid_fee_for_transaction`, httpParams);
  }

  exportTransactionFeePaid(transactions: string) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const { permissions, officeId } = this.accessToken;
    const permit = permissions.includes("TXN_CREATE");

    // tslint:disable-next-line:max-line-length
    const fileUrl = `${this.environment.GatewayApiUrl}${
      this.environment.GatewayApiUrlPrefix
    }/export/download_export_transaction_fee_paid?
    accessToken=${this.accessToken.base64EncodedAuthenticationKey}
    &permission=${!permit}
    &createdBy=${this.accessToken.userId}&transactionList=${transactions}`;

    this.getExportExcelFile(fileUrl).subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = "F_transaction.xlsx";
      link.click();
    });
  }

  getListFeeSavingTransaction(txnCode: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("tranRefNo", txnCode);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/get_list_fee_saving_transaction`,
      httpParams
    );
  }

  revertFeeByResourceId(txnSavingResource: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("resourceId", txnSavingResource);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/revert_fee_transaction`, httpParams);
  }

  getBatchTransactions(batchTxnName: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("batchTxnName", batchTxnName);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/get_list_batch_transaction`, httpParams);
  }

  getMembersInGroup(groupId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("groupId", groupId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/groups/get_list_member_group`, httpParams);
  }

  getMembersAvailableGroup(groupId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("groupId", groupId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/groups/get_list_member_group_with_identifier`, httpParams);
  }

  getShippersCardTransfer(): Observable<any> {
    // let httpParams = this.commonHttpParams.getCommonHttpParams();
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const Params = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
    };
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card-transfer/get_shippers_staff`, Params);
  }

  saveCardTransfer(data: any) {
    // let httpParams = this.commonHttpParams.getCommonHttpParams();
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const Params = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      transferRefNo: data.transferRefNo,
      senderStaffId: data.senderStaffId,
      actionStaffId: data.actionStaffId,
      receiverStaffId: data.receiverStaffId,
      listCardId: data.listCardId,
    };
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card-transfer/store_card_transfer_info`, Params);
  }

  getDetailByTransferRefNo(transferRefNo: any, officeId: any) {
    // let httpParams = this.commonHttpParams.getCommonHttpParams();
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const Params = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      staffId: "",
      transferRefNo: transferRefNo,
      officeId: officeId,
    };
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card-transfer/get_detail_by_transfer_ref_no`, Params);
  }

  exportCardTransferRequest(transferRefNo: any, officeId: any) {
    // let httpParams = this.commonHttpParams.getCommonHttpParams();
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const Params = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      staffId: "",
      transferRefNo: transferRefNo,
      officeId: officeId,
    };
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card-transfer/export_card_transfer_request`, Params);
  }

  getListTransfer(fromDate: any, toDate: any, officeId: any) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const Params = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      staffId: "",
      fromDate: fromDate,
      toDate: toDate,
      officeId: officeId
    };
    console.log("Params", Params);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card-transfer/get_list_request`, Params);
  }

  deleteCardTransferRequest(transferRefNo: any, officeId: any) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const Params = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      staffId: "",
      transferRefNo: transferRefNo,
      officeId: officeId
    };
    console.log("Params", Params);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card-transfer/delete_card_transfer_request`, Params);
  }

  addDetailCardTransfer(transferRefNo: any, officeId: any, listCardId: any) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const Params = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      staffId: "",
      transferRefNo: transferRefNo,
      officeId: officeId,
      listCardId: listCardId
    };
    console.log("Params", Params);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card-transfer/add_detail_card_transfer`, Params);
  }

  deleteDetailCardTransfer(transferRefNo: any, officeId: any, listCardId: any) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const Params = {
      createdBy: this.accessToken.userId,
      accessToken: this.accessToken.base64EncodedAuthenticationKey,
      staffId: "",
      transferRefNo: transferRefNo,
      officeId: officeId,
      listCardId: listCardId
    };
    console.log("Params", Params);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card-transfer/delete_detail_card_transfer`, Params);
  }

  checkValidTransactionBtach(clientId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("clientId", clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/check_valid_for_batch_transaction`, httpParams);
  }

  checkExtraCardTransactionBatch(userId: string, userIdentifyId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("userId", userId);
    httpParams = httpParams.set("userIdentifyId", userIdentifyId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card/check_extra_card_info`, httpParams);
  }

  getTransactionGroupFee(groupId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("groupId", groupId);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/get_fee_transaction_by_Group`,
      httpParams
    );
  }

  onSaveTransactionBatch(form: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    const keys = Object.keys(form);
    for (const key of keys) {
      httpParams = httpParams.set(key, form[key]);
    }
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/store_single_batch_pos_transaction`,
      httpParams
    );
  }

  getListTransExistingOfBatch(batchTxnName: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("batchTxnName", batchTxnName);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/get_list_batch_transaction`, httpParams);
  }

  getDocumentTemplate(): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_document_templates`, httpParams);
  }

  addIdentifierBatch(clientId: string, listIdentifier: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set("clientId", clientId);
    httpParams = httpParams.set("listIdentifier", listIdentifier);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/client/add_identifier`, httpParams);
  }

  getIdentifierTypeCC(clientId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("clientId", clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/client/get_identifier_midas_by_client_group`, httpParams);
  }

  exportAsExcelFile(exportType: string, data: any) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );

    // tslint:disable-next-line:max-line-length
    //const fileUrl = 'http://119.82.135.181:8001/document/export/';
    const fileUrl = `${this.environment.ICDocumentURL}/document/export/`;
    this.getExportExcelFiles(fileUrl, exportType, data).subscribe((data_response: any) => {
      this.downloadFile(data_response.result.fileName);
    });
  }

  getExportExcelFiles(url: string, exportType: string, data: any) {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set("filterData", JSON.stringify(data)).set("exportType", exportType);
    return this.http.post<any>(url, httpParams);
  }

  downloadFile(fileName: string) {
    //const url = `http://119.82.135.181:8001/document/export/download?fileName=${fileName}`;
    const url = `${this.environment.ICDocumentURL}/document/export/download?fileName=${fileName}`;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      let a;
      if (xhr.readyState === 4 && xhr.status === 200) {
        a = document.createElement("a");
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = `V_${fileName}`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
      }
    };
    xhr.open("GET", url);
    if (this.environment.isNewBillPos) {
      xhr.setRequestHeader("Gateway-TenantId", window.localStorage.getItem("Gateway-TenantId"));
    }
    xhr.responseType = "blob";
    xhr.send();
  }

  exportDataFile(exportType: string, data: any) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );

    // tslint:disable-next-line:max-line-length
    //const fileUrl = 'http://119.82.135.181:8001/document/export/';
    const fileUrl = `${this.environment.ICDocumentURL}/document/export/`;
    this.getExportExcelFiles(fileUrl, exportType, data).subscribe((data_response: any) => {
      this.downloadFile(data_response.result.fileName);
    });
  }

  exportRollTermScheduleTab(exportType: string, data: any) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );

    // tslint:disable-next-line:max-line-length
    //const fileUrl = 'http://119.82.135.181:8001/document/export/';
    const fileUrl = `${this.environment.ICDocumentURL}/document/export/`;
    this.getExportExcelFiles(fileUrl, exportType, data).subscribe((data_response: any) => {
      this.downloadFile(data_response.result.fileName);
    });
  }
}
