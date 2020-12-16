/** Angular Imports */
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';

/** rxjs Imports */
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketingServices {

  private credentialsStorageKey = 'midasCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) {

    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
  }

  getCampaign(): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/campaign/get_list_campaign_booking`, httpParams);

  }

  getBooking(campaignId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('campaignId', campaignId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/campaign/get_booking_campaign_by_id`, httpParams);
  }

  getCampaignTemplate(): Observable<any> {
    const httpParams = new HttpParams()
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/campaign/template`, httpParams);
  }

  createBooking(campaignId: string, userNameTelegram: string, amountBooking: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('campaignId', campaignId)
      .set('userName', userNameTelegram)
      .set('amountBooking', amountBooking)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/campaign/booking_pos_campain_manual`, httpParams);
  }

  updateBooking(campaignId: string, amountBooking: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('bookingId', campaignId)
      .set('bookingAmount', amountBooking)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/campaign/booking_pos_campain_manual`, httpParams);
  }

  RemoveBooking(bookingId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('bookingId', bookingId)
      .set('createdBy', this.accessToken.userId)
      .set('accessToken', this.accessToken.base64EncodedAuthenticationKey);

    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/campaign/inactive_booking_campain`, httpParams);
  }
}
