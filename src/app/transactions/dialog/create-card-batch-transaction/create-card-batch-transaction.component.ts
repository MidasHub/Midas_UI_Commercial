import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'midas-create-card-batch-transaction',
  templateUrl: './create-card-batch-transaction.component.html',
  styleUrls: ['./create-card-batch-transaction.component.scss']
})
export class CreateCardBatchTransactionComponent implements OnInit {
  formDialog: FormGroup;
  clients: any[] = [];
  banks: any[] = [];
  typeCards: any[] = [];

  constructor(public dialogRef: MatDialogRef<CreateCardBatchTransactionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {
    this.formDialog = this.formBuilder.group({
      'memberAddIdentifier': [''],
      'documentClientIdentifierType': [''],
      'documentClientIdentifierDescription': [''],
      'documentClientIdentifierKey': [''],
      'documentCardBankClientIdentifierKey': [''],
      'documentCardTypeClientIdentifierKey': ['']
    });
  }

  ngOnInit(): void {
  }

  submitForm() {

  }

}
