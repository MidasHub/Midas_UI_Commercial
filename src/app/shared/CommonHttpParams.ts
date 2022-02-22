import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class CommonHttpParams {
  private credentialsStorageKey = "midasCredentials";
  constructor() {}
  getCommonHttpParams(): HttpParams {
    const accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    let httpParams = new HttpParams()
      .set('fromOfficeId', accessToken?.officeId)
      .set('toOfficeId', accessToken?.officeId)
      .set('staffId', accessToken?.staffId ? accessToken?.staffId: "" )
      .set("officeId", accessToken?.officeId)
      .set("createdBy", accessToken?.userId)
      .set("accessToken", accessToken?.base64EncodedAuthenticationKey);

    return httpParams;
  }
}
