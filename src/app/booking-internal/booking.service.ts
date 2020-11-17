/** Angular Imports */
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';

/** rxjs Imports */
import {Observable} from 'rxjs';

/**
 * Booking service.
 */
@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private credentialsStorageKey = 'mifosXCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;
  private environment: any;

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) {

    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
    this.environment = environment;
    console.log('accessToken', this.accessToken);
  }


  getBookingInternalByRollTermId(rollTermId: string): Observable<any> {

    const httpParams = new HttpParams()

      .set('rollTermId', rollTermId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/bookingInternal/get_booking_internal_by_roll_term_id`, httpParams);
  }

  exportTransaction(query: string) {
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
