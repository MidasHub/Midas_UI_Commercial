/** Angular Imports */
import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SavingsService} from '../../savings.service';
import {SettingsService} from '../../../settings/settings.service';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';

/**
 * Transactions Tab Component.
 */
@Component({
  selector: 'mifosx-transactions-tab',
  templateUrl: './transactions-tab.component.html',
  styleUrls: ['./transactions-tab.component.scss']
})
export class TransactionsTabComponent implements OnInit {

  /** Savings Account Status */
  status: any;
  /** Transactions Data */
  transactionsData: any;
  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = ['id', 'transactionDate', 'transactionType', 'debit', 'credit', 'type', 'note'];
  /** Data source for transactions table. */
  dataSource: MatTableDataSource<any>;
  transactionDateFrom = new FormControl(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  /** Transaction date to form control. */
  transactionDateTo = new FormControl(new Date());
  form: FormGroup;
  transactions: any[];
  savingsAccountData: any;
  totalDeposit = 0;
  totalWithdraw = 0;
  transactionType: any[] = [{
    id: '',
    name: 'All'
  }, {
    id: 'D',
    name: 'Saving_Account_Component.tabTransactions.lblDeposit'
  }, {
    id: 'W',
    name: 'Saving_Account_Component.tabTransactions.lblWithdraw'
  }];

  /**
   * Retrieves savings account data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private savingsService: SavingsService,
              private formBuilder: FormBuilder,
              private settingsService: SettingsService,
              private datePipe: DatePipe,
  ) {
    this.route.parent.parent.data.subscribe((data: { savingsAccountData: any }) => {
      this.savingsAccountData = data.savingsAccountData; // .transactions?.filter((transaction: any) => !transaction.reversed);
      this.status = data.savingsAccountData.status.value;
    });
  }

  getData() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.transactionDateFrom.value;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    let toDate = this.transactionDateTo.value;
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.totalDeposit = 0;
    this.totalWithdraw = 0;
    const note = this.form.get('note').value;
    const txnCode = this.form.get('txnCode').value;
    const paymentDetail = this.form.get('paymentDetail').value;
    const queryParams: Params = {
      fromDate: fromDate,
      toDate: toDate,
      note: note,
      txnCode: txnCode,
      paymentDetail: paymentDetail
    };
    this.router.navigate([],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
    this.savingsService.getSearchTransactionCustom({
      fromDate: fromDate,
      toDate: toDate,
      accountId: this.savingsAccountData.id,
      note: note,
      txnCode: txnCode,
      paymentDetail: paymentDetail
    }).subscribe(result => {
      this.transactionsData = result?.result?.listDetailTransaction;
      this.transactionsData.forEach((item: any) => {
        if (item.txnCode === 'D') {
          this.totalDeposit += Number(item.amount);
        }
        if (item.txnCode === 'W') {
          this.totalWithdraw += Number(item.amount);
        }
      });
      this.dataSource = new MatTableDataSource(this.transactionsData);
    });
  }

  downloadReport() {
    let transactions = '';
    this.transactionsData.map((item: any) => {
      if (!transactions) {
        transactions = item.txnId;
      } else {
        transactions += '-' + item.txnId;
      }
    });
    return this.savingsService.downloadReport(transactions);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'note': [''],
      'txnCode': [''],
      'paymentDetail': [''],
    });
    // @ts-ignore
    const {value} = this.route.queryParams;
    if (value) {
      const {txnCode, paymentDetail, note, fromDate, toDate} = value;
      if (txnCode) {
        this.form.get('txnCode').setValue(txnCode);
      }
      if (paymentDetail) {
        this.form.get('paymentDetail').setValue(paymentDetail);
      }
      if (note) {
        this.form.get('note').setValue(note);
      }
      if (fromDate) {
        this.transactionDateFrom.setValue(moment(fromDate, 'DD/MM/YYYY').toDate());
      }
      if (toDate) {
        this.transactionDateTo.setValue(moment(toDate, 'DD/MM/YYYY').toDate());
      }
    }
    this.getData();
    this.dataSource = new MatTableDataSource(this.transactionsData);
  }

  /**
   * Checks if transaction is debit.
   * @param {any} transactionType Transaction Type
   */
  isDebit(transactionType: any) {
    return transactionType.withdrawal === true || transactionType.feeDeduction === true
      || transactionType.overdraftInterest === true || transactionType.withholdTax === true;
  }

  /**
   * Checks transaction status.
   */
  checkStatus() {
    if (this.status === 'Active' || this.status === 'Closed' || this.status === 'Transfer in progress' ||
      this.status === 'Transfer on hold' || this.status === 'Premature Closed' || this.status === 'Matured') {
      return true;
    }
    return false;
  }

  /**
   * Show Transactions Details
   * @param transactionsData Transactions Data
   */
  showTransactions(transactionsData: any) {
    console.log(transactionsData);
    if (transactionsData.transferId) {
      this.router.navigate([`account-transfers/account-transfers/${transactionsData.transferId}`], {relativeTo: this.route});
    } else {
      // location.path('/viewsavingtrxn/' + savingsAccountId + '/trxnId/' + transactionId);
      this.router.navigate([transactionsData.txnId], {relativeTo: this.route});
    }
  }

  /**
   * Stops the propagation to view pages.
   * @param $event Mouse Event
   */
  routeEdit($event: MouseEvent) {
    $event.stopPropagation();
  }

}
