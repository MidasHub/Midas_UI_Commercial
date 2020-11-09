/** Angular Imports */
import {CollectionViewer, DataSource} from '@angular/cdk/collections';

/** rxjs Imports */
import {Observable, BehaviorSubject} from 'rxjs';
import {TransactionService} from './transaction.service';

/** Custom Services */


export class TransactionDatasource implements DataSource<any> {

  private transactionSubject = new BehaviorSubject<any[]>([]);
  private recordsSubject = new BehaviorSubject<number>(0);
  public records$ = this.recordsSubject.asObservable();

  constructor(private transactionData: any[]) {
  }

  getTransactions(filterBy: any, orderBy: string = '', sortOrder: string = '', pageIndex: number = 0, limit: number = 10) {
    this.transactionSubject.next([]);
    orderBy = (orderBy === 'debit' || orderBy === 'credit') ? 'amount' : orderBy;
    // this.accountingService.getJournalEntries(filterBy, orderBy, sortOrder, pageIndex * limit, limit)
    //   .subscribe((journalEntries: any) => {
    //     this.recordsSubject.next(journalEntries.totalFilteredRecords);
    //     this.journalEntriesSubject.next(journalEntries.pageItems);
    //   });
  }

  /**
   * @param {CollectionViewer} collectionViewer
   */
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.transactionSubject.asObservable();
  }

  /**
   * @param {CollectionViewer} collectionViewer
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.transactionSubject.complete();
    this.recordsSubject.complete();
  }

}
