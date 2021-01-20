import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'midas-create-transaction-booking',
  templateUrl: './create-transaction-booking.component.html',
  styleUrls: ['./create-transaction-booking.component.scss']
})
export class CreateTransactionBookingComponent implements OnInit {
  formDialog: FormGroup;
  booking: any;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CreateTransactionBookingComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formDialog = this.formBuilder.group({
      'userNameTelegram': [''],
      'bookingAmount': ['']
    });
    this.booking = data.booking;
    if (this.booking) {

    }
  }

  ngOnInit(): void {
  }

  submitForm() {
    if (this.formDialog.invalid) {
      return this.formDialog.markAllAsTouched();
    }
    return this.dialogRef.close(this.formDialog.value);
  }
}
