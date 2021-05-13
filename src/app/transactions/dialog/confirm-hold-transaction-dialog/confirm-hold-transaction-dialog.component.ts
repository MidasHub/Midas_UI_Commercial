import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'midas-confirm-hold-transaction-dialog',
  templateUrl: './confirm-hold-transaction-dialog.component.html',
  styleUrls: ['./confirm-hold-transaction-dialog.component.scss']
})
export class ConfirmHoldTransactionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmHoldTransactionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

}
