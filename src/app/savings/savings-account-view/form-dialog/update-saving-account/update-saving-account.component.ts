import {Component, Inject, OnInit} from '@angular/core';
import {ClientsService} from '../../../../clients/clients.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SavingsService} from '../../../savings.service';
import * as moment from 'moment';

@Component({
  selector: 'midas-update-saving-account',
  templateUrl: './update-saving-account.component.html',
  styleUrls: ['./update-saving-account.component.scss']
})
export class UpdateSavingAccountComponent implements OnInit {
  form: FormGroup;
  transactions: any;
  templateData: any;
  payments: any;

  constructor(private serviceClient: ClientsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private savingsService: SavingsService) {
    this.transactions = data;
    this.form = this.formBuilder.group({
      'locale': ['en'],
      'dateFormat': ['dd/MM/yyyy'],
      'transactionDate': [''],
      'transactionAmount': [''],
      'paymentTypeId': [''],
      'accountNumber': [''],
      'checkNumber': [''],
      'routingCode': [''],
      'receiptNumber': [''],
      'bankNumber': [''],

      'note': [''],
    });
  }

  ngOnInit(): void { // 19619
    this.savingsService.getSavingsAccountTransaction(this.data?.accountId, this.data?.txnId).subscribe(result => {
      if (result) {
        this.payments = result;
        const keys = ['accountNumber', 'bankNumber',
         'checkNumber', 'paymentType', 'receiptNumber',
          'routingCode', 'note'];
        const {paymentDetailData, date, amount} = this.payments;
        for (const key of keys) {
          // if (paymentDetailData[key]) {
            switch (key) {
              case 'paymentType':
                this.form.get('paymentTypeId').setValue(paymentDetailData?.paymentType?.id);
                break;
              case 'note':
                this.form.get('note').setValue(this.payments?.note);
                break;
              default:
                this.form.get(key).setValue(paymentDetailData[key]);
            }
          // }
        }
        if (date && date.length === 3) {
          this.form.get('transactionDate').setValue(moment(date[0], date[1], date[2]).format('dd/MM/yyyy'));
        }
        if (amount) {
          this.form.get('transactionAmount').setValue(amount);
        }
      }
    });
    this.savingsService.getSavingsTransactionTemplateResource(this.data?.accountId).subscribe(result => {
      this.templateData = result;
    });
  }

}
