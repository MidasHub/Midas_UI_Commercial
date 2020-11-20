import {Component, Inject, OnInit} from '@angular/core';
import {TransactionService} from '../../transaction.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ClientsService} from '../../../clients/clients.service';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {AlertService} from '../../../core/alert/alert.service';

@Component({
  selector: 'midas-add-fee-dialog',
  templateUrl: './add-fee-dialog.component.html',
  styleUrls: ['./add-fee-dialog.component.scss']
})
export class AddFeeDialogComponent implements OnInit {
  paidPaymentType: any[] = [];
  formDialogPaid: FormGroup;
  formDialogGet: FormGroup;
  accountsFee: any[] = [];
  txnCode: string;
  transactions: any[] = [];
  accountsPaid: any[] = [];
  currentUser: any;
  transactionFee: any;
  transactionPaid: any;
  showPaid = false;
  showGet = true;
  showCashAccountPaid = true;
  selectedPaymentTypePaid = '';
  paidAmount = 0;
  feeAmount = 0;
  donePaid = false;
  doneFee = false;
  isBATCH = false;


  constructor(private transactionService: TransactionService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddFeeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private clientService: ClientsService,
              private authenticationService: AuthenticationService,
              private alertServices: AlertService) {
    console.log(this.data);
    this.txnCode = data.data?.txnCode;
    this.formDialogPaid = this.formBuilder.group({
      'paymentCode': [''],
      'savingAccountPaid': [''],
      'amountPaid': [''],
      'notePaid': ['']
    });
    this.formDialogGet = this.formBuilder.group({
      'paymentCodeGet': [''],
      'amountGet': [''],
      'savingAccountGet': [''],
      'noteGet': [''],
    });
    this.formDialogPaid.get('savingAccountPaid').valueChanges.subscribe(value => {
      if (value !== 'DE') {
        this.showGet = true;
      }
    });
    this.transactionService.getFeePaidTransactionByTnRefNo(this.txnCode).subscribe(result => {
      this.transactions = result.result?.listTransactionFee;
      this.transactionFee = this.transactions.find(v => v.txnPaymentType === 'IN');
      this.transactionPaid = this.transactions.find(v => v.txnPaymentType === 'OUT');
      if (this.transactionPaid && this.transactionPaid.txnType === 'BATCH') {
        this.showCashAccountPaid = false;
        this.showGet = false;
        this.isBATCH = true;
        this.selectedPaymentTypePaid = 'DE';
        this.formDialogPaid.get('paymentCode').setValue(this.selectedPaymentTypePaid);
        if (this.paidAmount < this.feeAmount) {
          this.paidAmount = -this.feeAmount - this.paidAmount;
        } else {
          this.paidAmount = this.paidAmount - this.feeAmount;
        }
      } else {
        this.selectedPaymentTypePaid = 'FT';

      }

      this.formDialogPaid.get('paymentCode').setValue(this.selectedPaymentTypePaid);
    });
    // this.clientService.getClientAccountData()
    this.transactionService.getPaymentTypes().subscribe(result => {
      this.paidPaymentType = result?.result?.listPayment;
    });
    this.currentUser = this.authenticationService.getCredentials();
    console.log(this.currentUser);
    this.clientService.getClientOfStaff().subscribe(result => {
      console.log(result);
      const clientId = result?.result?.clientId;
      if (clientId) {
        this.clientService.getClientAccountData(clientId).subscribe(res => {
          console.log(res);
          let totalBalance = 0;
          // @ts-ignore
          this.accountsFee = res.savingsAccounts;
          if (this.accountsFee) {
            totalBalance = this.accountsFee.reduce((total: any, num: any) => {
              if (num.accountBalance && [8, 9].indexOf(num.productId) !== -1) {
                return total + Math.round(num?.accountBalance);
              }
              return total + 0;
            }, 0);
            this.accountsFee.map(v => {
              if (v?.externalI?.indexOf('QTM') !== -1 || v?.externalI?.indexOf('tiền mặt') !== -1) {
                v.flagAccountCa = true;
              } else {
                v.flagAccountCa = false;
              }
            });
            this.accountsPaid = this.accountsFee;
          }
        });
      }
    });
  }
  getPaymentCode() {
    this.formDialogPaid.get('paymentCode')
  }
  ngOnInit(): void {
  }

  submitForm() {
    const form = this.formDialogPaid.value;
    form.txnCode = this.txnCode;
    this.transactionService.paidFeeForTransaction(form).subscribe(result => {
      if (result?.result.status) {
        this.alertServices.alert({
          type: '🎉🎉🎉 Thành công !!!',
          message: '🎉🎉 Thanh toán phí thành công',
        });
        this.dialogRef.close({status: true});
      } else {
        this.alertServices.alert({
          type: '🚨🚨🚨🚨 Lỗi ',
          message: '🚨🚨 Lỗi thanh toán phí, vui lòng liên hệ IT Support để được hổ trợ 🚨🚨',
        });
        this.dialogRef.close({status: false});
      }
    });
  }
}
