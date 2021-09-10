/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Environment Configuration */
import { environment } from 'environments/environment';
// import {indexOf} from 'lodash';

/** Logger */
import { Logger } from '../logger/logger.service';
const log = new Logger('API-Interceptor');

/**
 * Http request interceptor to prefix a request with `environment.serverUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  /**
   * Intercepts a Http request and prefixes it with `environment.serverUrl`.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    log.debug('Api-prefix starting ... ',request);
    // check if request have 'assets' dir --> don't add prefix
    // if (request.url.indexOf('assets', 1) > 0) {
    //   request = request.clone({ url: request.url });
      // else add prefix for calling API to fineract backend
    // } else {
      if ((request.url.indexOf('http') === -1) && (request.url.indexOf('assets') === -1) ) {
        if (request.url.startsWith(environment.GatewayApiUrlPrefix)) {

          request = request.clone({url: environment.GatewayServerUrl + request.url});

        } else {

          if (request.url.startsWith(environment.IcGatewayApiUrlPrefix)) {

            request = request.clone({url: environment.IcGatewayApiUrl + request.url});

          } else {

            request = request.clone({url: environment.serverUrl + request.url});

          }
        }

      } else {
        request = request.clone({ url: request.url });
      }
    // }

    // log.debug("Add Url Step: ", request)
    return next.handle(request);
  }
}
