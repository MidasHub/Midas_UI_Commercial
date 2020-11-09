/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ClientsService } from 'app/clients/clients.service';

/** rxjs Imports */
import { Observable } from 'rxjs';


/** Custom Services */

/**
 * Client Identifier Template resolver.
 */
@Injectable()
export class MidasClientIdentifierTemplateResolver implements Resolve<Object> {
    /**
     * @param {ClientsService} ClientsService Clients service.
     */
    constructor(private clientsService: ClientsService) { }
    /**
     * Returns the Client Identities data.
     * @returns {Observable<any>}
     */
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let clientId = route.paramMap.get('clientId');
        if (!clientId) {
          clientId = '1';
        }
        return this.clientsService.getClientIdentifierTemplate(clientId);
    }
}

