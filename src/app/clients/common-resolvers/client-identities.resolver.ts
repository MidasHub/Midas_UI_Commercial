/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable, forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { ClientsService } from '../clients.service';

/**
 * Client Identities resolver.
 */
@Injectable()
export class ClientIdentitiesResolver implements Resolve<Object> {
    /**
     * @param {ClientsService} ClientsService Clients service.
     */
    constructor(private clientsService: ClientsService) { }
    /**
     * Returns the Client Identities data.
     * @returns {Observable<any>}
     */
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const clientId = route.parent.paramMap.get('clientId');
        let identitiesData: any;
        return this.clientsService.getIdentifierClientCross(clientId).pipe(map((identities: any) => {
        //return this.clientsService.getClientIdentifiers(clientId).pipe(map((identities: any) => {
        // identitiesData = identities;
        identitiesData = identities.result.listIdentifier;
            const docObservable: Observable<any>[] = [];
            identities.result.listIdentifier.forEach((identity: any) => {
                docObservable.push(this.clientsService.getClientIdentificationDocuments(identity.id));
            });
            forkJoin(docObservable).subscribe(documents => {
                documents.forEach((document, index) => {
                    identitiesData[index].documents = document;
                    console.log("load document");
                });
                this.LoadImageIdentifier(identitiesData);
            });
            return identitiesData;
        }));
    }

    LoadImageIdentifier(identitiesData: any) {
      let listPersonalIdentifier: any = [];
      identitiesData.forEach((element: any) => {
        if (element.documentType.id >= 1 && element.documentType.id <= 3) {
          let imageIds = element.documents;
          imageIds.forEach((image: any) => {

           this.clientsService.loadImageIdentifier(element.id, image.id)
            .subscribe((imageResult: any) => {

            var reader = new FileReader();
            reader.readAsDataURL(imageResult);
            reader.onloadend = function () {
                var base64data = reader.result;
                let object = {
                  key: element.description,
                  base64data: base64data
                }
                listPersonalIdentifier.push(object);
            }
            image.imageIdentifier = listPersonalIdentifier;
            });

          })
        }

      });
      debugger;
    }
}
