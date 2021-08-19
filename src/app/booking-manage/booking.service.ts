/** Angular Imports */
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { CommonHttpParams } from 'app/shared/CommonHttpParams';

/**
 * Booking service.
 */
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private credentialsStorageKey = 'midasCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private environment: any;

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient, private commonHttpParams: CommonHttpParams) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
    this.environment = environment;
  }

  checkedBranchBookingByRefNo(bookingRefNo: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('bookingRefNo', bookingRefNo);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/change_booking_branch_status`,
      httpParams
    );
  }

  getDetailBranchBookingByRefNo(bookingRefNo: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('bookingRefNo', bookingRefNo);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/get_detail_branch_booking_by_booking_ref_no`,
      httpParams
    );
  }

  getDetailRollTermScheduleBookingByRefNo(bookingRefNo: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('refNo', bookingRefNo);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/get_booking_internal_by_txn_date_by_refNo`,
      httpParams
    );
  }

  transferBookingAmount(transferInfo: any, typeTransferBooking: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();

    httpParams = httpParams.set('txnCode', transferInfo.bookingRefNo);
    httpParams = httpParams.set('amountPaid', transferInfo.amountPaid);
    httpParams = httpParams.set('savingAccountPaid', transferInfo.savingAccountPaid);
    httpParams = httpParams.set('savingAccountGet', transferInfo.savingAccountGet);
    httpParams = httpParams.set('typeTransferBooking', typeTransferBooking);


    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/transfer_booking_amount`, httpParams);
  }

  getTransferBookingAmountTemplate(createBy: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('staffCreateById', createBy);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/get_transfer_booking_amount_template`,
      httpParams
    );
  }

  removeBookingInternal(bookingInternalId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('bookingInternalId', bookingInternalId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/remove_booking_internal`, httpParams);
  }

  editBookingInternal(bookingInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('bookingInternalId', bookingInfo.bookingInternalId);
    httpParams = httpParams.set('txnDate', bookingInfo.txnDate);
    httpParams = httpParams.set('amountBooking', bookingInfo.amountBooking);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/edit_booking_internal`, httpParams);
  }

  addBookingInternal(bookingInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('txnDate', bookingInfo.txnDate);
    httpParams = httpParams.set('amountBooking', bookingInfo.amountBooking);
    httpParams = httpParams.set('note', bookingInfo.note);


    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/save_booking_internal`, httpParams);
  }

  cancelBookingAgency(bookingId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('bookingId', bookingId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/check_use_on_booking_dly`, httpParams);
  }

  removeBookingAgency(bookingId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('bookingId', bookingId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/remove_on_booking_dly`, httpParams);
  }

  getBookingAgency(fromDate: string, toDate: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('fromDate', fromDate);
    httpParams = httpParams.set('toDate', toDate);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/get_list_booking_agency_daily`, httpParams);
  }

  getBookingInternal(fromDate: string, toDate: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('fromDate', fromDate);
    httpParams = httpParams.set('toDate', toDate);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/get_booking_internal_by_txn_date`,
      httpParams
    );
  }

  getManageBookingInternal(officeName: string, staffName: string, fromDate: string, toDate: string): Observable<any> {

    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    officeName = officeName === '' ? '%%' : `%${officeName}%`;
    staffName = staffName === '' ? '%%' : `%${staffName}%`;
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('fromDate', fromDate);
    httpParams = httpParams.set('toDate', toDate);
    httpParams = httpParams.set('staffName', staffName);
    httpParams = httpParams.set(
      'officeName',
      this.accessToken.officeId === 1 ? officeName : `${this.accessToken.officeName}`
    );

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/management_booking_internal_by_txn_date`,
      httpParams
    );
  }

  getManageBookingRollTermSchedule(
    officeName: string,
    staffName: string,
    clientName: string,
    fromDate: string,
    toDate: string
  ): Observable<any> {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    officeName = officeName === '' ? '%%' : `%${officeName}%`;
    staffName = staffName === '' ? '%%' : `%${staffName}%`;
    clientName = clientName === '' ? '%%' : `%${clientName}%`;

    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('fromDate', fromDate);
    httpParams = httpParams.set('toDate', toDate);
    httpParams = httpParams.set('staffName', staffName);
    httpParams = httpParams.set('clientName', clientName);
    httpParams = httpParams.set(
      'officeName',
      this.accessToken.officeId === 1 ? officeName : `${this.accessToken.officeName}`
    );

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/management_booking_roll_term_schedule_by_txn_date`,
      httpParams
    );
  }

  removeRowBookingInternalOnRollTermSchedule(bookingInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('bookingInternalId', bookingInfo.bookingInternalId);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/remove_booking_internal_roll_term`,
      httpParams
    );
  }

  getManageBookingBranch( fromDate: string, toDate: string): Observable<any> {

    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    // officeName = officeName === "" ? "%%" : `%${officeName}%`;
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('fromDate', fromDate);
    httpParams = httpParams.set('toDate', toDate);


    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/management_booking_internal_by_branch`,
      httpParams
    );
  }

  addRowBookingInternalOnRollTermSchedule(bookingInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('bookingRefNo', bookingInfo.bookingRefNo);
    httpParams = httpParams.set('isIsTmpBooking', bookingInfo.isIsTmpBooking);
    httpParams = httpParams.set('txnDate', bookingInfo.txnDate);
    httpParams = httpParams.set('productId', bookingInfo.productId);
    httpParams = httpParams.set('rollTermId', bookingInfo.rollTermId);
    httpParams = httpParams.set('cardId', bookingInfo.cardId);
    httpParams = httpParams.set('amountBooking', bookingInfo.amountBooking);
    httpParams = httpParams.set('clientId', bookingInfo.clientId);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/save_booking_rollTerm`, httpParams);
  }

  editBookingInternalOnRollTermSchedule(bookingInfo: any): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('amountBooking', bookingInfo.amountBooking);
    httpParams = httpParams.set('txnDate', bookingInfo.txnDate);
    httpParams = httpParams.set('bookingInternalId', bookingInfo.bookingInternalId);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/edit_booking_internal_roll_term`,
      httpParams
    );
  }

  getBookingInternalByRollTermId(rollTermId: string): Observable<any> {
    let httpParams = this.commonHttpParams.getCommonHttpParams();
    httpParams = httpParams.set('rollTermId', rollTermId);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/get_booking_internal_by_roll_term_id`,
      httpParams
    );
  }

  exportTransaction(query: string) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey) || ''
    );
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      let a;
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhttp.response);
        a.download = `transactions`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
      }
    };
    const fileUrl = `${this.environment.GatewayApiUrl}${this.environment.GatewayApiUrlPrefix}/export/pre_export_transaction?ext5=ALL&typeExport=transaction&accessToken=${this.accessToken.base64EncodedAuthenticationKey}&createdBy=${this.accessToken.userId}&${query}`;
    xhttp.open('GET', fileUrl);
    xhttp.responseType = 'blob';
    xhttp.send();
  }
}
