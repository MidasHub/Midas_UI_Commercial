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
    console.log("accessToken", this.accessToken);
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

    return this.http.post<any>(
      `${this.GatewayApiUrlPrefix}/bookingInternal/save_booking_internal_by_txn_date`,
      httpParams
    );
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
