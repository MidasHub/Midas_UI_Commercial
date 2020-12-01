import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "midas-edit-booking-internal",
  templateUrl: "./edit-booking-internal.component.html",
  styleUrls: ["./edit-booking-internal.component.scss"],
})
export class EditBookingInternalComponent implements OnInit {
  formDialog: FormGroup;
  member: any;

  constructor(
    public dialogRef: MatDialogRef<EditBookingInternalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {

    this.formDialog = this.formBuilder.group({
      txnDate: [data.txnDate, Validators.required],
      bookingAmount: [data.bookingAmount, Validators.required],
    });
  }

  ngOnInit(): void {}
}
