import {Component, Inject, OnInit} from '@angular/core';
import {TransactionService} from '../../transaction.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ClientsService} from '../../../clients/clients.service';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {AlertService} from '../../../core/alert/alert.service';
import {MidasClientService} from '../../../midas-client/midas-client.service';

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
  disableAmountPaid = false;
  clientId: any;
  clientAccount: any;
  messageNoti: string;

  constructor(private transactionService: TransactionService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddFeeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private clientService: ClientsService,
              private authenticationService: AuthenticationService,
              private alertServices: AlertService,
              private midasClientServices: MidasClientService) {
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
    this.formDialogPaid.get('paymentCode').valueChanges.subscribe(value => {
      this.checkAccountAndAmountPaid();
    });
    this.formDialogGet.get('paymentCodeGet').valueChanges.subscribe(value => {
      this.checkAccountFee();
    });
  }

  getPaymentCode() {
    return this.formDialogPaid.get('paymentCode').value;
  }

  checkAccountAndAmountPaid() {
    const value = this.formDialogPaid.get('paymentCode').value;
    if (value !== 'DE') {
      this.showGet = true;
      this.formDialogPaid.get('amountPaid').enable({onlySelf: true});
    } else {
      this.showGet = false;
      this.formDialogPaid.get('amountPaid').setValue(-(this.transactionPaid?.feeRemain - this.transactionFee?.feeRemain));
      if (!this.isBATCH) {
        this.formDialogPaid.get('amountPaid').disable({onlySelf: true});
      }
    }
    this.formDialogPaid.get('savingAccountPaid').setValue('');
    const AC = value === 'CA' ? 9 : 8;
    this.accountsPaid.map(v => {
      if (v.productId !== AC) {
        v.hide = true;
      } else {
        v.hide = false;
      }
    });
  }

  checkAccountFee() {
    const value = this.formDialogGet.get('paymentCodeGet').value;
    if (value === 'AM') {
      if (!this.clientAccount) {
        this.midasClientServices.getListSavingAccountByClientId(this.clientId).subscribe(result => {
          this.clientAccount = result?.result?.listSavingAccount;
          this.accountsFee = this.clientAccount;
        });
      } else {
        this.accountsFee = this.clientAccount;
      }
    } else {
      const AC = value === 'CA' ? 9 : 8;
      this.accountsFee = this.accountsPaid;
      this.accountsFee.map(v => {
        if (v.productId !== AC) {
          v.hide = true;
        } else {
          v.hide = false;
        }
      });
    }
    this.formDialogGet.get('savingAccountGet').setValue('');
  }

  ngOnInit(): void {
    this.transactionService.getFeePaidTransactionByTnRefNo(this.txnCode).subscribe(result => {
      this.transactions = result.result?.listTransactionFee;
      this.clientId = this.transactions[0].customerId;
      this.transactionFee = this.transactions.find(v => v.txnPaymentType === 'IN');
      this.transactionPaid = this.transactions.find(v => v.txnPaymentType === 'OUT');
      if (this.transactionPaid && this.transactionPaid.txnType === 'BATCH') {
        this.showCashAccountPaid = false;
        this.showGet = false;
        this.isBATCH = true;
        this.selectedPaymentTypePaid = 'DE';
      } else {
        this.selectedPaymentTypePaid = 'FT';
      }
      if (this.transactionPaid) {
        this.paidAmount = this.transactionPaid.feeRemain;
      }
      if (this.transactionFee) {
        this.feeAmount = this.transactionFee.feeRemain;
      }
      this.formDialogPaid.get('amountPaid').setValue(this.paidAmount);
      this.formDialogGet.get('amountGet').setValue(this.feeAmount);
      if ((this.feeAmount <= 0) && (this.paidAmount <= 0)) {
        this.messageNoti = 'Tài khoản không khả dụng';
      }
      this.formDialogPaid.get('paymentCode').setValue(this.selectedPaymentTypePaid);
    });
    // this.clientService.getClientAccountData()
    this.transactionService.getPaymentTypes().subscribe(result => {
      this.paidPaymentType = result?.result?.listPayment;
    });
    this.currentUser = this.authenticationService.getCredentials();
    this.midasClientServices.getListSavingAccountByUserId().subscribe(result => {
      this.accountsFee = result?.result?.listSavingAccount;
      this.accountsPaid = this.accountsFee;
      this.checkAccountAndAmountPaid();
    });
  }

  submitForm() {
    if (this.formDialogGet.invalid && this.formDialogPaid.invalid) {
      this.formDialogPaid.markAllAsTouched();
      this.formDialogGet.markAllAsTouched();
      return;
    }
    const form = {
      ...this.formDialogGet.value,
      ...this.formDialogPaid.value
    };
    form.txnCode = this.txnCode;
    this.transactionService.paidFeeForTransaction(form).subscribe(result => {
      if (result?.result?.status) {
        this.alertServices.alert({
          type: '🎉🎉🎉 Thành công !!!',
          message: '🎉🎉 Thanh toán phí thành công',
          msgClass: 'cssSuccess'
        });
        this.dialogRef.close({status: true});
      } else {
        this.alertServices.alert({
          type: '🚨🚨🚨🚨 Lỗi ',
          msgClass: 'cssBig',
          message: '🚨🚨 Lỗi thanh toán phí, vui lòng liên hệ IT Support để được hổ trợ 🚨🚨',
        });
        this.dialogRef.close({status: false});
      }
    });
  }
}
