import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {AlertService} from '../../../core/alert/alert.service';
import {TransactionService} from '../../transaction.service';

@Component({
  selector: 'midas-view-fee-paid-transaction-dialog',
  templateUrl: './view-fee-paid-transaction-dialog.component.html',
  styleUrls: ['./view-fee-paid-transaction-dialog.component.scss']
})
export class ViewFeePaidTransactionDialogComponent implements OnInit {
  txnCode: any;
  transactions: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ViewFeePaidTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authenticationService: AuthenticationService,
    private alertServices: AlertService,
    private transactionServices: TransactionService
  ) {
    this.txnCode = data.data?.txnCode;
    this.transactionServices.getListFeeSavingTransaction(this.txnCode).subscribe(result => {
      console.log(result);
      this.transactions = result?.result?.listTransactionAlready;
    });
  }

  ngOnInit(): void {

  }

}
