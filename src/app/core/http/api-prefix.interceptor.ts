/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Environment Configuration */
import { environment } from 'environments/environment';
import { indexOf } from 'lodash';

/**
 * Http request interceptor to prefix a request with `environment.serverUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {

  /**
   * Intercepts a Http request and prefixes it with `environment.serverUrl`.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // check if request have 'assets' dir --> don't add prefix
    if (request.url.indexOf('assets',1 )>0 ){
      request = request.clone({ url:request.url });
  // else add prefix for calling API to fineract backend
    }else{

      if (request.url.startsWith(environment.GatewayApiUrlPrefix)){

        request = request.clone({ url: environment.GatewayServerUrl + request.url });
      }else{
        request = request.clone({ url: environment.serverUrl + request.url });
      }
    }

    return next.handle(request);
  }

}
