/** Angular Imports */
import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";

/** rxjs Imports */
import { Observable } from "rxjs";

/** Environment Configuration */
import { environment } from "../../../environments/environment";

/** Logger */
import { Logger } from "../logger/logger.service";
import { SystemService } from "app/system/system.service";
import { BanksService } from "app/banks/banks.service";
const log = new Logger("Authen-interceptor");

/** Authorization header. */
const authorizationHeader = "Authorization";
/** Two factor access token header. */
const twoFactorAccessTokenHeader = "Fineract-Platform-TFA-Token";
/** Http request options headers. */
const httpOptions = {
  headers: {
    "Fineract-Platform-TenantId": window.localStorage.getItem("Fineract-Platform-TenantId")
      ? window.localStorage.getItem("Fineract-Platform-TenantId")
      : environment.fineractPlatformTenantId,
  },
};
const httpOptionsGateway = {
  headers: {
    "Gateway-TenantId": window.localStorage.getItem("Gateway-TenantId")
      ? window.localStorage.getItem("Gateway-TenantId")
      : environment.GatewayTenantId,
  },
};

const httpOptionsIcGateway = {
  headers: {
    "Gateway-TenantId": window.localStorage.getItem("Gateway-TenantId")
      ? window.localStorage.getItem("Gateway-TenantId")
      : environment.GatewayTenantId,
    "IC-TenantId": "default",
  },
};
/**
 * Http Request interceptor to set the request headers.
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private systemService: SystemService) {
    const subdomain = window.location.hostname.split(".")[0];
    this.systemService.getTenantInfo(subdomain).subscribe((data) => {
      const tenantId = data.result.tenantIdentifier;
      window.localStorage.setItem("Fineract-Platform-TenantId", tenantId);
      window.localStorage.setItem("Gateway-TenantId", tenantId);
      /** Http request options headers. */
      httpOptions.headers["Fineract-Platform-TenantId"] = window.localStorage.getItem("Fineract-Platform-TenantId");
      httpOptionsGateway.headers["Gateway-TenantId"] = window.localStorage.getItem("Gateway-TenantId");
      httpOptionsIcGateway.headers["Gateway-TenantId"] = window.localStorage.getItem("Gateway-TenantId");
      httpOptionsIcGateway.headers["IC-TenantId"] = "default";
    });
  }

  /**
   * Intercepts a Http request and sets the request headers.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(environment.GatewayApiUrlPrefix)) {
      request = request.clone({ setHeaders: httpOptionsGateway.headers });
    } else {
      if (request.url.includes(environment.IcGatewayApiUrlPrefix)) {
        request = request.clone({ setHeaders: httpOptionsIcGateway.headers });
      } else {
        request = request.clone({ setHeaders: httpOptions.headers });
      }
    }

    //  log.debug("Authen Step: ", request)
    return next.handle(request);
  }

  /**
   * Sets the basic/oauth authorization header depending on the configuration.
   * @param {string} authenticationKey Authentication key.
   */
  setAuthorizationToken(authenticationKey: string) {
    if (environment.oauth.enabled) {
      httpOptions.headers[authorizationHeader] = `Bearer ${authenticationKey}`;
    } else {
      httpOptions.headers[authorizationHeader] = `Basic ${authenticationKey}`;
      httpOptionsGateway.headers[authorizationHeader] = `Basic ${authenticationKey}`;
    }
  }

  /**
   * Sets the two factor access token header.
   * @param {string} twoFactorAccessToken Two factor access token.
   */
  setTwoFactorAccessToken(twoFactorAccessToken: string) {
    httpOptions.headers[twoFactorAccessTokenHeader] = twoFactorAccessToken;
  }

  /**
   * Removes the authorization header.
   */
  removeAuthorization() {
    delete httpOptions.headers[authorizationHeader];
  }

  /**
   * Removes the two factor access token header.
   */
  removeTwoFactorAuthorization() {
    delete httpOptions.headers[twoFactorAccessTokenHeader];
  }
}
