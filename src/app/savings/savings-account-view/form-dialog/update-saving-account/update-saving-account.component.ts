import {Component, Inject, OnInit} from '@angular/core';
import {ClientsService} from '../../../../clients/clients.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'midas-update-saving-account',
  templateUrl: './update-saving-account.component.html',
  styleUrls: ['./update-saving-account.component.scss']
})
export class UpdateSavingAccountComponent implements OnInit {
  form: FormGroup;

  constructor(private serviceClient: ClientsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {
    console.log(data);
    this.form = this.formBuilder.group({
      'locale': ['en'],
      'dateFormat': ['dd MMMM yyyy'],
      'transactionDate': [new Date()],
      'transactionAmount': ['500'],
      'paymentTypeId': ['14'],
      'accountNumber': ['acc123'],
      'checkNumber': ['che123'],
      'routingCode': ['rou123'],
      'receiptNumber': ['rec123'],
      'bankNumber': ['ban123']
    });
  }

  ngOnInit(): void {
  }

}
