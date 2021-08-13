import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {AlertService} from '../../../core/alert/alert.service';
import {TransactionService} from '../../transaction.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'midas-view-fee-paid-transaction-dialog',
  templateUrl: './view-fee-paid-transaction-dialog.component.html',
  styleUrls: ['./view-fee-paid-transaction-dialog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewFeePaidTransactionDialogComponent implements OnInit {
  txnCode: any;
  transactions: any[] = [];
  today = new Date();
  expandedElement: any;
  displayedColumns: string[] = ['txnSavingResource',
    'createdDate', 'txnSavingType', 'txnPaymentCode', 'txnSavingId', 'paidAmount', "routingCode",
    'actions',
  ];

  constructor(
    public dialogRef: MatDialogRef<ViewFeePaidTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alertServices: AlertService,
    private settingsService: SettingsService,
    private transactionServices: TransactionService,
    public dialog: MatDialog,
    private datePipe: DatePipe,

  ) {
    this.txnCode = data.data?.txnCode;
    this.getData();
  }

  getData() {
    this.transactionServices.getListFeeSavingTransaction(this.txnCode).subscribe(result => {
      this.transactions = result?.result?.listTransactionAlready;
    });
  }

  ngOnInit(): void {

  }

  revertTransaction(txnSavingResource: string, createdDate :any) {
    const dateFormat = this.settingsService.dateFormat;
    const todayString = this.datePipe.transform(this.today, dateFormat);
    const createdDateString = this.datePipe.transform(createdDate, dateFormat);

    if (todayString != createdDateString){
      this.alertServices.alert({
        type: '🚨🚨🚨🚨 Lỗi ',
        msgClass: 'cssBig',
        message: 'Lỗi không thể hoàn tác dòng chi tiền trong ngày quá khứ',
      });
      return;
    }

    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Bạn chắc chắn muốn hoàn tác giao dịch ' + txnSavingResource,
        title: 'Hoàn tác giao dịch'
      },
    });

    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.transactionServices.revertFeeByResourceId(txnSavingResource).subscribe(result => {
          if (Number(result?.status) === 200) {
            this.alertServices.alert({message: 'Hoàn tác giao dịch thành công ! 🎉🎉🎉', msgClass: 'cssSuccess'});
            this.getData();
          } else {
            this.alertServices.alert({
              type: '🚨🚨🚨🚨 Lỗi ',
              msgClass: 'cssBig',
              message: '🚨🚨 Lỗi thanh toán phí, vui lòng liên hệ IT Support để được hổ trợ 🚨🚨',
            });
          }
        });
      }
    });
  }
}
