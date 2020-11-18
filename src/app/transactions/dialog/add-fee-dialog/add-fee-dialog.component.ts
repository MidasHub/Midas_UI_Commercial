import {Component, Inject, OnInit} from '@angular/core';
import {TransactionService} from '../../transaction.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ClientsService} from '../../../clients/clients.service';
import {AuthenticationService} from '../../../core/authentication/authentication.service';

@Component({
  selector: 'midas-add-fee-dialog',
  templateUrl: './add-fee-dialog.component.html',
  styleUrls: ['./add-fee-dialog.component.scss']
})
export class AddFeeDialogComponent implements OnInit {
  paidPaymentType: any[] = [];
  formDialog: FormGroup;
  accountsFee: any[] = [];
  txnCode: string;
  transactions: any[] = [];
  accountPaid: any[] = [];
  currentUser: any;
  constructor(private transactionService: TransactionService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private clientService: ClientsService,
              private authenticationService: AuthenticationService) {
    console.log(this.data);
    this.txnCode = data.data?.txnCode;
    this.transactionService.getFeePaidTransactionByTnRefNo(this.txnCode).subscribe(result => {
      this.transactions = result.result?.listTransactionFee;
    });
    this.formDialog = this.formBuilder.group({
      'paymentTypeFee': [''],
      'accountFee': [''],
      'amountFee': [''],
      'noteFee': [''],
      'paymentTypePaid': [''],
      'accountPaid': [''],
      'amountPaid': [''],
      'notePaid': ['']
    });
    // this.clientService.getClientAccountData()
    this.transactionService.getPaymentTypes().subscribe(result => {
      this.paidPaymentType = result?.result?.listPayment;
    });
    this.currentUser = this.authenticationService.getCredentials();
    console.log(this.currentUser)
  }

  ngOnInit(): void {
  }

}
