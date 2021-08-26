/** Angular Imports */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SavingsService } from '../../savings.service';
import { SettingsService } from '../../../settings/settings.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../transactions/dialog/confirm-dialog/confirm-dialog.component';
import { UpdateSavingAccountComponent } from '../form-dialog/update-saving-account/update-saving-account.component';
import { AlertService } from '../../../core/alert/alert.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

/**
 * Transactions Tab Component.
 */
@Component({
  selector: 'mifosx-transactions-ic-tab',
  templateUrl: './transactions-ic-tab.component.html',
  styleUrls: ['./transactions-ic-tab.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TransactionsIcTabComponent implements OnInit {
  /** Savings Account Status */
  status: any;
  /** Transactions Data */
  transactionsData: any;
  /** Columns to be displayed in transactions table. */
  displayedColumns: string[] = [
    'id',
    'transactionDate',
    'transactionType',
    'debit',
    'credit',
    'type',
    'note',
    'actions',
  ];
  /** Data source for transactions table. */
  dataSource: any;
  transactionDateFrom = new FormControl(new Date());
  /** Đến ngày form control. */
  transactionDateTo = new FormControl(new Date());
  form: FormGroup = new FormGroup({});
  isLoading = false;
  transactions: any[] = [];
  savingsAccountData: any;
  totalTransactions = 0;
  totalDeposit = 0;
  totalWithdraw = 0;
  transactionType: any[] = [
    {
      id: '',
      name: 'Tất cả',
    },
    {
      id: 'D',
      name: 'Saving_Account_Component.tabTransactions.lblDeposit',
    },
    {
      id: 'W',
      name: 'Saving_Account_Component.tabTransactions.lblWithdraw',
    },
  ];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  /**
   * Retrieves savings account data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private savingsService: SavingsService,
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private alterServices: AlertService
  ) {

    this.route.parent?.data.subscribe((data: { savingsAccountData: any }|Data) => {
      this.savingsAccountData = data.savingsAccountData.result.savingInfo;
      // .transactions?.filter((transaction: any) => !transaction.reversed);
      this.status = data.savingsAccountData.status.value;
    });
  }

  changeTabTransaction($event: any) {
    let isRevert = 0;
    if ($event.index === 0) {
      isRevert = 0;
    } else {
      if ($event.index === 1) {
        isRevert = 1;
      }
    }
    this.paginator.pageIndex = 0;
    this.form.get('isRevert')?.setValue(isRevert);
    this.getData();
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
    const note = this.form.get('note')?.value;
    const txnCode = this.form.get('txnCode')?.value;
    const paymentDetail = this.form.get('paymentDetail')?.value;
    const isRevert = this.form.get('isRevert')?.value;
    const limit = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const offset = this.paginator.pageIndex * limit;
    const queryParams: Params = {
      fromDate: fromDate,
      toDate: toDate,
      note: note,
      txnCode: txnCode,
      paymentDetail: paymentDetail,
    };

    this.dataSource = [];
    this.isLoading = true;

    this.savingsService
      .getIcSearchTransactionCustom({
        fromDate: fromDate,
        toDate: toDate,
        accountId: this.savingsAccountData.id,
        note: note,
        isRevert: isRevert,
        txnCode: txnCode,
        paymentDetail: paymentDetail,
        limit: limit,
        offset: offset,
      })
      .subscribe((result) => {
        this.isLoading = false;
        this.transactionsData = result?.result?.listDetailTransaction;
        this.totalTransactions = result?.result?.totalTransactions;
        this.transactionsData.forEach((item: any) => {
          if (item.txnCode === 'D') {
            this.totalDeposit += Number(item.amount);
          }
          if (item.txnCode === 'W') {
            this.totalWithdraw += Number(item.amount);
          }
        });
        this.dataSource = this.transactionsData;
      });
  }

  downloadReport() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.transactionDateFrom.value;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    let toDate = this.transactionDateTo.value;
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    const note = this.form.get('note')?.value;
    const txnCode = this.form.get('txnCode')?.value;
    const paymentDetail = this.form.get('paymentDetail')?.value;
    const isRevert = this.form.get('isRevert')?.value;

    this.savingsService.downloadIcReport(
      this.savingsAccountData.id,
      toDate,
      fromDate,
      note,
      txnCode,
      paymentDetail
    );
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      note: [''],
      txnCode: [''],
      paymentDetail: [''],
      isRevert: [0],
    });
    // @ts-ignore
    const { value } = this.route.queryParams;
    if (value) {
      const { txnCode, paymentDetail, note, fromDate, toDate } = value;
      if (txnCode) {
        this.form.get('txnCode')?.setValue(txnCode);
      }
      if (paymentDetail) {
        this.form.get('paymentDetail')?.setValue(paymentDetail);
      }
      if (note) {
        this.form.get('note')?.setValue(note);
      }
      if (fromDate) {
        this.transactionDateFrom.setValue(moment(fromDate, 'DD/MM/YYYY').toDate());
      }
      if (toDate) {
        this.transactionDateTo.setValue(moment(toDate, 'DD/MM/YYYY').toDate());
      }
    }
    this.getData();
  }

  /**
   * Checks if transaction is debit.
   * @param {any} transactionType Transaction Type
   */
  isDebit(transactionType: any) {
    return (
      transactionType.withdrawal === true ||
      transactionType.feeDeduction === true ||
      transactionType.overdraftInterest === true ||
      transactionType.withholdTax === true
    );
  }

  /**
   * Checks transaction status.
   */
  checkStatus() {
    if (
      this.status === 'Active' ||
      this.status === 'Closed' ||
      this.status === 'Transfer in progress' ||
      this.status === 'Transfer on hold' ||
      this.status === 'Premature Closed' ||
      this.status === 'Matured'
    ) {
      return true;
    }
    return false;
  }

  /**
   * Show Transactions Details
   * @param transactionsData Transactions Data
   */
  showTransactions(transferId: any, txnId: any) {
    if (transferId) {
      this.router.navigate([`account-transfers/account-transfers/${transferId}`], { relativeTo: this.route });
    } else {
      // location.path('/viewsavingtrxn/' + savingsAccountId + '/trxnId/' + transactionId);
      this.router.navigate([txnId], { relativeTo: this.route });
    }
  }

  updateTransaction(txnId: any) {
    const transaction = this.transactionsData.find((v: any) => v.txnId === txnId);
    const dialog = this.dialog.open(UpdateSavingAccountComponent, {
      data: transaction,
      width: '400px',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        const { data } = result;
        this.savingsService
          .updateAccountTransactions(transaction.accountId, txnId, data?.paymentTypeId, data?.note)
          .subscribe((response) => {
            if (response && response?.result?.status) {
              this.alterServices.alert({ message: 'Cập nhập tài khoản thành công', msgClass: 'cssSuccess' });
              this.getData();
            }
          });
      }
    });
  }

  /**
   * Stops the propagation to view pages.
   * @param $event Mouse Event
   */
  routeEdit($event: MouseEvent) {
    $event.stopPropagation();
  }
}
