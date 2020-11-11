/** Angular Imports */
import {CollectionViewer, DataSource} from '@angular/cdk/collections';

/** rxjs Imports */
import {Observable, BehaviorSubject} from 'rxjs';

/** Custom Services */
import {ClientsService} from './clients.service';
import {MidasClientService} from '../midas-client/midas-client.service';

/**
 * Clients custom data source to implement server side filtering, pagination and sorting.
 */
export class ClientsDataSource implements DataSource<any> {

  /** clients behavior subject to represent loaded journal clients page. */
  private clientsSubject = new BehaviorSubject<any[]>([]);
  /** Records subject to represent total number of filtered clients records. */
  private recordsSubject = new BehaviorSubject<number>(0);
  /** Records observable which can be subscribed to get the value of total number of filtered clients records. */
  public records$ = this.recordsSubject.asObservable();
  public old_key: string;
  public old_result: any[];

  /**
   * @param {ClientsService} clientsService Clients Service
   */
  constructor(private clientsService: ClientsService, private midasClientService: MidasClientService) {
  }

  /**
   * Gets clients on the basis of provided parameters and emits the value.
   * @param {any} filterBy Properties by which clients should be filtered.
   * @param {string} orderBy Property by which clients should be sorted.
   * @param {string} sortOrder Sort order: ascending or descending.
   * @param {number} pageIndex Page number.
   * @param {number} limit Number of clients within the page.
   */
  getClients(orderBy: string = '', sortOrder: string = '', pageIndex: number = 0, limit: number = 10, clientActive: boolean = true) {
    this.clientsSubject.next([]);
    this.clientsService.getClients(orderBy, sortOrder, pageIndex * limit, limit)
      .subscribe((clients: any) => {
        console.log(clients)
        clients.pageItems = (clientActive) ? (clients.pageItems.filter((client: any) => client.active)) : (clients.pageItems.filter((client: any) => !client.active));
        this.recordsSubject.next(clients.totalFilteredRecords);
        this.clientsSubject.next(clients.pageItems);
      });
  }

  /**
   * @param {CollectionViewer} collectionViewer
   */
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.clientsSubject.asObservable();
  }

  /**
   * @param {CollectionViewer} collectionViewer
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.clientsSubject.complete();
    this.recordsSubject.complete();
  }

  /** Filter Active Client Data.
   * @param {string} filterValue Filter Value which clients should be filtered.
   * @param {string} orderBy Property by which clients should be sorted.
   * @param {string} sortOrder Sort order: ascending or descending.
   * @param {number} pageIndex Page number.
   * @param {number} limit Number of clients within the page.
   */
  filterClients(filter: string, orderBy: string = '', sortOrder: string = '', pageIndex: number = 0, limit: number = 10, clientActive: boolean = true) {
    this.clientsSubject.next([]);
    if (this.old_key !== filter) {
      this.old_key = filter;
      this.old_result = [];
      this.midasClientService.searchClientByNameAndExternalIdAndPhoneAndDocumentKey(filter)
        .subscribe((clients: any) => {
          console.log(clients)
          this.old_result = clients?.result?.listClientSearch;
          this.recordsSubject.next(this.old_result.length);
          const l = this.old_result.filter((client: any) => client.active === clientActive);
          this.clientsSubject.next(l.slice(pageIndex * limit, pageIndex * limit + limit));
        });
    } else {
      this.recordsSubject.next(this.old_result.length);
      const l = this.old_result.filter((client: any) => client.active === clientActive);
      this.clientsSubject.next(l.slice(pageIndex * limit, pageIndex * limit + limit));
    }
  }

}
