import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private credentialsStorageKey = 'mifosXCredentials';
  private accessToken: any;
  private GatewayApiUrlPrefix: any;

  constructor(private http: HttpClient) {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey)
      || localStorage.getItem(this.credentialsStorageKey)
    );
    this.GatewayApiUrlPrefix = environment.GatewayApiUrlPrefix;
  }

  getListBank(): Observable<any> {
    console.log(environment.baseApiUrl);
    return this.http.post<any>(`${this.GatewayApiUrlPrefix}/get_list_bank`, {
      'accessToken': this.accessToken.base64EncodedAuthenticationKey,
    });
  }
}
