import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "midas-add-booking-internal",
  templateUrl: "./add-booking-internal.component.html",
  styleUrls: ["./add-booking-internal.component.scss"],
})
export class AddBookingInternalComponent implements OnInit {
  formDialog: FormGroup;
  member: any;

  constructor(
    public dialogRef: MatDialogRef<AddBookingInternalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {

    this.formDialog = this.formBuilder.group({
      txnDate: [new Date(), Validators.required],
      bookingAmount: [0, Validators.required],
      note: [""],
    });
  }

  ngOnInit(): void {}
}
