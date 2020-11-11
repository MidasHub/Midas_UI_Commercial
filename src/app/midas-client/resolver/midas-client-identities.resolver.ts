/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ClientsService } from 'app/clients/clients.service';

/** rxjs Imports */
import { Observable, forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */

/**
 * Client Identities resolver.
 */
@Injectable()
export class MidasClientIdentitiesResolver implements Resolve<Object> {
    /**
     * @param {ClientsService} ClientsService Clients service.
     */
    constructor(private clientsService: ClientsService) { }
    /**
     * Returns the Client Identities data.
     * @returns {Observable<any>}
     */
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const clientId = route.paramMap.get('clientId');
        let identitiesData: any;
        return this.clientsService.getClientIdentifiers(clientId).pipe(map((identities: any) => {
            identitiesData = identities;
            const docObservable: Observable<any>[] = [];
            identities.forEach((identity: any) => {
                docObservable.push(this.clientsService.getClientIdentificationDocuments(identity.id));
            });
            forkJoin(docObservable).subscribe(documents => {
                documents.forEach((document, index) => {
                    identitiesData[index].documents = document;
                });
            });
            return identitiesData;
        }));
    }
}
