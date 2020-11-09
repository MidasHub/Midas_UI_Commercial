import {Component, OnInit, ViewChild} from '@angular/core';
import {TransactionDatasource} from '../transaction.datasource';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TransactionService} from '../transaction.service';
import {MatPaginator} from '@angular/material/paginator';
import {DatePipe} from '@angular/common';
import {SettingsService} from '../../settings/settings.service';
import {AuthenticationService} from '../../core/authentication/authentication.service';
import * as moment from 'moment';
import {MatSort} from '@angular/material/sort';
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'midas-manage-transaction',
  templateUrl: './manage-transaction.component.html',
  styleUrls: ['./manage-transaction.component.scss']
})
export class ManageTransactionComponent implements OnInit {
  displayedColumns: string[] = ['productId', 'txnDate', 'trnRefNo', 'status',
    'officeName', 'agencyName', 'panHolderName', 'terminalAmount',
    'feeAmount', 'cogsAmount', 'pnlAmount', 'actions'
  ];
  formDate: FormGroup;
  dataSource: any[];
  transactionsData: any[] = [];
  currentUser: any;
  transactionType: any[] = [
    {
      label: 'All',
      value: ''
    },
    {
      label: 'Giao dịch RTM',
      value: 'CA01'
    },
    {
      label: 'Giao dịch ĐHT',
      value: 'AL01'
    }, {
      label: 'Giao dịch test thẻ',
      value: 'TEST'
    },
    {
      label: 'Giao dịch lô lẻ',
      value: 'CA02'
    }
  ];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private formBuilder: FormBuilder,
              private transactionService: TransactionService,
              private datePipe: DatePipe,
              private settingsService: SettingsService,
              private authenticationService: AuthenticationService,
  ) {
    this.formDate = this.formBuilder.group({
      'fromDate': [new Date(new Date().setMonth(new Date().getMonth() - 1))],
      'toDate': [new Date()]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    this.dataSource = this.transactionsData;
    this.getTransaction();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.getTransaction())
      )
      .subscribe();
  }

  getTransaction() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get('fromDate').value;
    let toDate = this.formDate.get('toDate').value;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.transactionService.getTransaction({fromDate, toDate}).subscribe(result => {
      const {permissions} = this.currentUser;
      const permit_userTeller = permissions.includes('TXNOFFICE_CREATE');
      if (!permit_userTeller) {
        result?.result?.listPosTransaction?.map((value: any) => {
          if (value?.createdBy === this.currentUser.userId
            || value?.staffId === this.currentUser.staffId) {
            this.transactionsData.push(value);
          }
        });
      } else {
        this.transactionsData = result?.result?.listPosTransaction;
      }

      this.filterTransaction();
    });
  }

  filterTransaction() {
    const limit = this.paginator.pageSize;
    const offset = this.paginator.pageIndex * limit;
    this.dataSource = this.transactionsData.slice(offset, offset + limit);
    console.log(this.dataSource);
  }

  get fromDateAndToDate() {
    const fromDate = this.formDate.get('fromDate').value;
    const toDate = this.formDate.get('toDate').value;
    if (fromDate && toDate) {
      return true;
    }
    return false;
  }

  displayProductId(type: string) {
    return this.transactionType.find(v => v.value === type)?.label || 'N/A';
  }

  menuOpened() {
    console.log('menuOpened');
  }

  menuClosed() {
    console.log('menuClosed');
  }
}
