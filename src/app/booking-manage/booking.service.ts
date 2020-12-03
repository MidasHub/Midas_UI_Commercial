/** Angular Imports */
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

/** rxjs Imports */
import { Observable } from "rxjs";

/**
 * Booking service.
 */
@Injectable({
  providedIn: "root",
})
export class BookingService {
  private credentialsStorageKey = "mifosXCredentials";
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
  }

  getDetailRollTermScheduleBookingByRefNo(bookingRefNo: string): Observable<any> {
    const httpParams = new HttpParams()
      .set("refNo", bookingRefNo)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/get_booking_internal_by_txn_date_by_refNo`,
      httpParams
    );
  }

  transferBookingAmount(transferInfo: any): Observable<any> {
    const httpParams = new HttpParams()
      .set("fromOfficeId", this.accessToken.officeId)
      .set("toOfficeId", this.accessToken.officeId)
      .set("txnCode", transferInfo.bookingRefNo)
      .set("amountPaid", transferInfo.amountPaid)
      .set("savingAccountPaid", transferInfo.savingAccountPaid)
      .set("savingAccountGet", transferInfo.savingAccountGet)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/transfer_booking_amount`, httpParams);
  }

  getTransferBookingAmountTemplate(createBy: string): Observable<any> {
    const httpParams = new HttpParams()
      .set("staffCreateById", createBy)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/get_transfer_booking_amount_template`,
      httpParams
    );
  }

  removeBookingInternal(bookingInternalId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set("bookingInternalId", bookingInternalId)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/remove_booking_internal`, httpParams);
  }

  editBookingInternal(bookingInfo: any): Observable<any> {
    const httpParams = new HttpParams()
      .set("bookingInternalId", bookingInfo.bookingInternalId)
      .set("txnDate", bookingInfo.txnDate)
      .set("amountBooking", bookingInfo.amountBooking)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/edit_booking_internal`, httpParams);
  }

  addBookingInternal(bookingInfo: any): Observable<any> {
    const httpParams = new HttpParams()
      .set("txnDate", bookingInfo.txnDate)
      .set("amountBooking", bookingInfo.amountBooking)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/save_booking_internal`, httpParams);
  }

  cancelBookingAgency(bookingId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set("bookingId", bookingId)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/check_use_on_booking_dly`, httpParams);
  }

  removeBookingAgency(bookingId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set("bookingId", bookingId)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/remove_on_booking_dly`, httpParams);
  }

  getBookingAgency(fromDate: string, toDate: string): Observable<any> {
    const httpParams = new HttpParams()
      .set("fromDate", fromDate)
      .set("toDate", toDate)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/get_list_booking_agency_daily`, httpParams);
  }

  getBookingInternal(fromDate: string, toDate: string): Observable<any> {
    const httpParams = new HttpParams()
      .set("fromDate", fromDate)
      .set("toDate", toDate)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/get_booking_internal_by_txn_date`,
      httpParams
    );
  }

  getManageBookingInternal(officeName: string, staffName: string, fromDate: string, toDate: string): Observable<any> {

    officeName = officeName === "" ? "%%" : `%${officeName}%`;
    staffName = staffName === "" ? '%%':`%${staffName}%`
    const httpParams = new HttpParams()
      .set("fromDate", fromDate)
      .set("toDate", toDate)
      .set("staffName", staffName)
      .set("officeName", this.accessToken.officeId == 1 ? officeName : `${this.accessToken.officeName}`)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/management_booking_internal_by_txn_date`,
      httpParams
    );
  }

  getManageBookingRollTermSchedule(officeName: string, staffName: string,  clientName: string, fromDate: string, toDate: string): Observable<any> {

    officeName = officeName === "" ? "%%" : `%${officeName}%`;
    staffName = staffName === "" ? '%%':`%${staffName}%`
    clientName = clientName === "" ? '%%':`%${clientName}%`

    const httpParams = new HttpParams()
      .set("fromDate", fromDate)
      .set("toDate", toDate)
      .set("staffName", staffName)
      .set("clientName", clientName)
      .set("officeName", this.accessToken.officeId == 1 ? officeName : `${this.accessToken.officeName}`)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/management_booking_roll_term_schedule_by_txn_date`,
      httpParams
    );
  }

  removeRowBookingInternalOnRollTermSchedule(bookingInfo: any): Observable<any> {
    const httpParams = new HttpParams()

      .set("bookingInternalId", bookingInfo.bookingInternalId)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/remove_booking_internal_roll_term`,
      httpParams
    );
  }

  addRowBookingInternalOnRollTermSchedule(bookingInfo: any): Observable<any> {
    const httpParams = new HttpParams()
      .set("bookingRefNo", bookingInfo.bookingRefNo)
      .set("isIsTmpBooking", bookingInfo.isIsTmpBooking)
      .set("txnDate", bookingInfo.txnDate)
      .set("productId", bookingInfo.productId)
      .set("rollTermId", bookingInfo.rollTermId)
      .set("cardId", bookingInfo.cardId)
      .set("amountBooking", bookingInfo.amountBooking)
      .set("clientId", bookingInfo.clientId)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/save_booking_rollTerm`, httpParams);
  }

  editBookingInternalOnRollTermSchedule(bookingInfo: any): Observable<any> {
    const httpParams = new HttpParams()
      .set("amountBooking", bookingInfo.amountBooking)
      .set("txnDate", bookingInfo.txnDate)
      .set("bookingInternalId", bookingInfo.bookingInternalId)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/edit_booking_internal_roll_term`,
      httpParams
    );
  }

  getBookingInternalByRollTermId(rollTermId: string): Observable<any> {
    const httpParams = new HttpParams()

      .set("rollTermId", rollTermId)
      .set("createdBy", this.accessToken.userId)
      .set("accessToken", this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/get_booking_internal_by_roll_term_id`,
      httpParams
    );
  }

  exportTransaction(query: string) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      let a;
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        a = document.createElement("a");
        a.href = window.URL.createObjectURL(xhttp.response);
        a.download = `transactions`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
      }
    };
    const fileUrl = `${this.environment.GatewayApiUrl}${this.environment.GatewayApiUrlPrefix}/export/pre_export_transaction?ext5=ALL&typeExport=transaction&accessToken=${this.accessToken.base64EncodedAuthenticationKey}&createdBy=${this.accessToken.userId}&${query}`;
    xhttp.open("GET", fileUrl);
    xhttp.responseType = "blob";
    xhttp.send();
  }
}
