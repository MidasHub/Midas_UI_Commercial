import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'midas-valid-check-transaction-history-dialog',
  templateUrl: './valid-check-transaction-history-dialog.component.html',
  styleUrls: ['./valid-check-transaction-history-dialog.component.scss'],
})
export class ValidCheckTransactionHistoryDialogComponent implements OnInit {
  dataSource: any[];
  message: string;
  displayedColumns: string[] = ['no', 'amount', 'terminal', 'txnDate', 'createdBy'];

  form!: FormGroup;
  pristine?: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource = data.listTransaction;
    this.message = data.message;
  }

  ngOnInit() {}

  displayTransactionType(type: string) {
    if (type.startsWith('B')) { return 'Lô'; }
    switch (type) {
      case 'cash':
        return 'Cash';
      case 'rollTerm':
        return 'Advance';
      default:
        return '';
    }
  }
}
