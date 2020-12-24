import {Component, Inject, OnInit} from '@angular/core';
import {ClientsService} from '../../../../clients/clients.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SavingsService} from '../../../savings.service';

@Component({
  selector: 'midas-update-saving-account',
  templateUrl: './update-saving-account.component.html',
  styleUrls: ['./update-saving-account.component.scss']
})
export class UpdateSavingAccountComponent implements OnInit {
  form: FormGroup;
  transactions: any;
  templateData: any;

  constructor(private serviceClient: ClientsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private savingsService: SavingsService) {
    console.log(data);
    this.transactions = data;
    this.form = this.formBuilder.group({
      // 'locale': ['en'],
      // 'dateFormat': ['dd MMMM yyyy'],
      // 'transactionDate': [new Date()],
      // 'transactionAmount': ['500'],
      'paymentTypeId': ['14'],
      'accountNumber': ['acc123'],
      'checkNumber': ['che123'],
      'routingCode': ['rou123'],
      'receiptNumber': ['rec123'],
      'bankNumber': ['ban123']
    });
  }

  ngOnInit(): void {
    this.savingsService.getSavingsAccountTransaction(this.data?.accountId, this.data.txnId).subscribe(result => {
      console.log({result});
    });
    this.savingsService.getSavingsTransactionTemplateResource(this.data?.accountId).subscribe(result => {
      console.log(result);
      this.templateData = result;
    });
  }

}
