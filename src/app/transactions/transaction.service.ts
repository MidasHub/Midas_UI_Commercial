/** Angular Imports */
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

/** rxjs Imports */
import {Observable} from 'rxjs';

/**
 * Transaction service.
 */
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private credentialsStorageKey = 'mifosXCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private environment: any;

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
    this.environment = environment;
    console.log('accessToken', this.accessToken);
  }

  getTransactionHistoryByClientId(clientId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('clientId', clientId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/get_list_transaction_by_client`, httpParams);
  }

  updateCardTrackingState(updateData: any): Observable<any> {
    const httpParams = new HttpParams()
      .set(
        'expiredDate',
        `${updateData.dueDay}/${updateData.expiredDateString.substring(0, 2)}/${updateData.expiredDateString.substring(
          2,
          4
        )}`
      )
      .set('refId', updateData.refId)
      .set('note', updateData.note)
      .set('state', updateData.trackingState)
      .set('dueDay', updateData.dueDay)
      .set('isHold', updateData.isHold ? '1' : '0')
      .set('officeId', this.accessToken.officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.put<any>(`${this.GatewayApiUrlPrefix}/card/update_card_on_due_day`, httpParams);
  }

  submitTransactionCash(transactionInfo: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('accountNumber', transactionInfo.identifyClientDto.accountNumber)
      .set('accountBankId', transactionInfo.identifyClientDto.accountBankId)
      .set('accountTypeId', transactionInfo.identifyClientDto.accountTypeId)
      .set('accountCash', transactionInfo.accountCash)
      .set('bNo', transactionInfo.traceNo)
      .set('tid', transactionInfo.batchNo)
      .set('terminalAmount', String(this.formatLong(transactionInfo.terminalAmount)))
      .set('feeRate', transactionInfo.rate)
      .set('toClientId', transactionInfo.clientId)
      .set('feeAmount', transactionInfo.feeAmount)
      .set('cogsRate', transactionInfo.cogsRate)
      .set('cogsAmount', transactionInfo.feeCogs)
      .set('pnlAmount', transactionInfo.feePNL)
      .set('invoiceAmount', String(this.formatLong(transactionInfo.txnAmount)))
      .set('requestAmount', String(this.formatLong(transactionInfo.requestAmount)))
      .set('transferAmount', String(this.formatLong(transactionInfo.txnAmount)))
      .set('bills', transactionInfo.invoiceMapping.listInvoice)
      .set('productId', transactionInfo.productId)
      .set('groupId', transactionInfo.clientDto.groupId)
      .set('customerName', transactionInfo.clientDto.displayName)
      .set('terminalId', transactionInfo.terminalId)
      .set('ext2', transactionInfo.type)
      .set('ext4', transactionInfo.identifierId)
      .set('officeId', this.accessToken.officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/create_cash_retail_transaction`, httpParams);
  }

  submitTransactionCashFromRollTermTransaction(transactionInfo: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('accountNumber', transactionInfo.identifyClientDto.accountNumber)
      .set('accountBankId', transactionInfo.identifyClientDto.accountBankId)
      .set('accountTypeId', transactionInfo.identifyClientDto.accountTypeId)
      .set('refid', transactionInfo.refId)
      .set('bNo', transactionInfo.traceNo)
      .set('tid', transactionInfo.batchNo)
      .set('terminalAmount', String(this.formatLong(transactionInfo.terminalAmount)))
      .set('feeRate', transactionInfo.rate)
      .set('feeAmount', transactionInfo.feeAmount)
      .set('cogsRate', transactionInfo.cogsRate)
      .set('cogsAmount', transactionInfo.feeCogs)
      .set('pnlAmount', transactionInfo.feePNL)
      .set('invoiceAmount', String(this.formatLong(transactionInfo.txnAmount)))
      .set('requestAmount', String(this.formatLong(transactionInfo.requestAmount)))
      .set('transferAmount', String(this.formatLong(transactionInfo.txnAmount)))
      .set('bills', transactionInfo.invoiceMapping.listInvoice)
      .set('productId', transactionInfo.productId)
      .set('customerName', transactionInfo.clientDto.displayName)
      .set('terminalId', transactionInfo.terminalId)
      .set('officeId', this.accessToken.officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/create_retail_cash_from_rollTerm_transaction`,
      httpParams
    );
  }

  submitTransactionRollTerm(transactionInfo: any): Observable<any> {
    const httpParams = new HttpParams()
      .set('accountNumber', transactionInfo.identifyClientDto.accountNumber)
      .set('accountBankId', transactionInfo.identifyClientDto.accountBankId)
      .set('accountTypeId', transactionInfo.identifyClientDto.accountTypeId)
      .set('accountCash', transactionInfo.accountCash)
      .set('feeRate', transactionInfo.rate)
      .set('toClientId', transactionInfo.clientId)
      .set('requestAmount', String(this.formatLong(transactionInfo.requestAmount)))
      .set('productId', transactionInfo.productId)
      .set('groupId', transactionInfo.clientDto.groupId)
      .set('customerName', transactionInfo.clientDto.displayName)
      .set('ext2', transactionInfo.type)
      .set('BookingInternalDtoListString', transactionInfo.BookingInternalDtoListString)
      .set('ext4', transactionInfo.identifierId)
      .set('officeId', this.accessToken.officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/create_rollTerm_retail_transaction`,
      httpParams
    );
  }

  mappingInvoiceWithTransaction(
    accountTypeCode: string,
    accountNumber: string,
    identifierId: string,
    amountTransaction: number,
    terminalId: string
  ): Observable<any> {
    const httpParams = new HttpParams()
      .set('accountNumber', accountNumber)
      .set('ext4', identifierId)
      .set('AmountMappingInvoice', String(this.formatLong(String(amountTransaction))))
      .set('accountTypeId', accountTypeCode)
      .set('terminalId', terminalId)
      .set('officeId', this.accessToken.officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/mapping_invoice_transaction`, httpParams);
  }

  getTransaction(payload: { fromDate: string; toDate: string }): Observable<any> {
    const {permissions, officeId} = this.accessToken;
    const permit = permissions.includes('TXN_CREATE');
    const httpParams = new HttpParams()
      .set('officeId', officeId)
      .set('permission', String(!permit))
      .set('fromDate', payload.fromDate)
      .set('toDate', payload.toDate)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post(`${this.GatewayApiUrlPrefix}/transaction/get_list_pos_transaction`, httpParams);
  }

  getListRollTermTransactionOpenByUserId(payload: {
    fromDate: string;
    toDate: string;
    clientName: string;
    cardNumber: string;
    limit: number;
    offset: number;
  }): Observable<any> {
    const httpParams = new HttpParams()
      .set('cardNumber', !payload.cardNumber ? '%%' : payload.cardNumber)
      .set('customerName', !payload.clientName ? '%%' : payload.clientName)
      .set('agencyName', '%%')
      .set('limit', String(payload.limit))
      .set('offset', String(payload.offset))
      .set('amountTransaction', '%%')
      .set('fromDate', payload.fromDate)
      .set('toDate', payload.toDate)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post(`${this.GatewayApiUrlPrefix}/transaction/get_list_pos_transaction_rollterm`, httpParams);
  }

  getListCardOnDueDayByUserId(payload: {
    fromDate: string;
    toDate: string;
    limit: number;
    offset: number;
    statusFilter: string;
    bankName: string;
    query: string;
  }): Observable<any> {
    const httpParams = new HttpParams()
      .set('query', !payload.query ? `%%` : `%${payload.query}%`)
      .set('agencyName', '%%')
      .set('limit', String(payload.limit))
      .set('offset', String(payload.offset))
      .set('amountTransaction', '%%')
      .set('trackingState', payload.statusFilter === '' ? `%%` : `%${payload.statusFilter}%`)
      .set('createdUser', '%%')
      .set('bankName', payload.bankName === '' ? `%%` : `%${payload.bankName}%`)
      .set('fromDate', payload.fromDate)
      .set('toDate', payload.toDate)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post(`${this.GatewayApiUrlPrefix}/card/get_list_card_on_due_day`, httpParams);
  }

  getFeeByTerminal(accountTypeCode: string, terminalId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('accountTypeId', accountTypeCode)
      .set('terminalId', terminalId)
      .set('officeId', this.accessToken.officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/get_fee_by_terminal`, httpParams);
  }

  checkValidRetailCashTransaction(clientId: string): Observable<any> {
    const httpParams = new HttpParams()

      .set('clientId', clientId)
      .set('officeId', this.accessToken.officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/check_valid_for_retail_transaction`,
      httpParams
    );
  }

  checkExtraCardInfo(clientId: string, identifierId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('userIdentifyId', identifierId)
      .set('userId', clientId)
      .set('officeId', this.accessToken.officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/card/check_extra_card_info`, httpParams);
  }

  checkValidCreateRollTermTransaction(identifierId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('documentId', identifierId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/check_valid_rollTerm_transaction`, httpParams);
  }

  getListTerminalAvailable(amount: number): Observable<any> {
    const httpParams = new HttpParams()
      .set('id', this.accessToken.officeId)
      .set('amountTransaction', amount.toString())
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/pos/get_list_terminal_by_office`, httpParams);
  }

  getTransactionTemplate(clientId: string, identifierId: string, transactionId?: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('identifyId', identifierId)
      .set('clientId', clientId)
      .set('transactionId', !transactionId ? '' : transactionId)
      .set('officeId', this.accessToken.officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/get_retail_transaction_template`, httpParams);
  }

  getTransactionDetail(transactionId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('transactionId', transactionId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/get_transaction`, httpParams);
  }

  formatLong(value: string) {
    value = String(value);
    const neg = value.startsWith('-');
    value = value.replace(/[^0-9]+/g, '');
    if (neg) {
      value = '-'.concat(value);
    }
    return Number(value);
  }

  downloadVoucher(transactionId: string) {
    const url = `${this.environment.GatewayApiUrl}${this.GatewayApiUrlPrefix}/export/download_voucher?id=${transactionId}&accessToken=${this.accessToken.base64EncodedAuthenticationKey}&createdBy=${this.accessToken.userId}`;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      let a;
      if (xhr.readyState === 4 && xhr.status === 200) {
        a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = `V_${transactionId}`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
      }
    };

    xhr.open('GET', url);
    xhr.setRequestHeader('Gateway-TenantId', this.environment.GatewayTenantId);
    xhr.responseType = 'blob';
    xhr.send();
  }

  downloadBill(clientId: string, documentId: string) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      let a;
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhttp.response);
        a.download = 'bill_' + clientId + '_' + documentId;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
      }
    };
    const fileUrl =
      this.environment.GatewayApiUrl +
      '/fineract-provider/api/v1/clients/' +
      clientId +
      '/documents/' +
      documentId +
      '/attachment?tenantIdentifier=tiktik';
    xhttp.open('GET', fileUrl);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + this.accessToken.base64EncodedAuthenticationKey);
    xhttp.responseType = 'blob';
    xhttp.send();
  }

  revertTransaction(transactionId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('transactionId', transactionId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/revert_transaction`, httpParams);
  }

  undoRevertTransaction(transactionId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('transactionId', transactionId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/undo_revert_transaction`, httpParams);
  }

  uploadBosInformation(transId: string, payload: { traceNo: string; batchNo: string }): Observable<any> {
    const httpParams = new HttpParams()
      .set('traceNo', payload.traceNo)
      .set('batchNo', payload.batchNo)
      .set('transId', transId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/transaction/update_pending_transaction`, httpParams);
  }

  getExportExcelFile(url: string) {
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Gateway-TenantId': this.environment.GatewayTenantId
      })
    };

    return this.http.get(url, httpOptions);
  }

  exportTransaction(query: string) {
    // tslint:disable-next-line:max-line-length
    const fileUrl = `${this.environment.GatewayApiUrl}${this.environment.GatewayApiUrlPrefix}/export/pre_export_transaction?ext5=ALL&typeExport=transaction&accessToken=${this.accessToken.base64EncodedAuthenticationKey}&createdBy=${this.accessToken.userId}&${query}`;
    this.getExportExcelFile(fileUrl).subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'V_transaction.xlsx';
      link.click();

    });
  }

  getFeePaidTransactions(fromDate: string, toDate: string): Observable<any> {
    const {permissions, officeId} = this.accessToken;
    const permit = permissions.includes('TXN_CREATE');
    const httpParams = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('permission', String(!permit))
      .set('officeId', officeId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/transaction/get_list_fee_transaction_on_range_date`,
      httpParams
    );
  }

  getPaymentTypes(): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/common/get_list_payment`, httpParams);
  }

  getFeePaidTransactionByTnRefNo(trnRefNo: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('trnRefNo', trnRefNo)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/get_list_fee_transaction_by_trn_ref_no`,
      httpParams
    );
  }

  paidFeeForTransaction(form: any): Observable<any> {
    let httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    const keys = Object.keys(form);
    for (const key of keys) {
      if (key.includes('amount')) {
        httpParams = httpParams.set(key, String(Number(form[key])));
      } else {
        httpParams = httpParams.set(key, form[key]);
      }
    }
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/savingTransaction/paid_fee_for_transaction`, httpParams);
  }

  exportTransactionFeePaid(transactions: string) {
    const {permissions, officeId} = this.accessToken;
    const permit = permissions.includes('TXN_CREATE');

    // tslint:disable-next-line:max-line-length
    const fileUrl = `${this.environment.GatewayApiUrl}${
      this.environment.GatewayApiUrlPrefix
    }/export/download_export_transaction_fee_paid?
    accessToken=${this.accessToken.base64EncodedAuthenticationKey}
    &permission=${!permit}
    &createdBy=${this.accessToken.userId}&transactionList=${transactions}`;

    this.getExportExcelFile(fileUrl).subscribe((data: any) => {

      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'F_transaction.xlsx';
      link.click();

    });
  }

  getListFeeSavingTransaction(txnCode: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('tranRefNo', txnCode)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/get_list_fee_saving_transaction`,
      httpParams
    );
  }

  revertFeeByResourceId(txnSavingResource: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('resourceId', txnSavingResource)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/savingTransaction/revert_fee_transaction`,
      httpParams
    );
  }
}
