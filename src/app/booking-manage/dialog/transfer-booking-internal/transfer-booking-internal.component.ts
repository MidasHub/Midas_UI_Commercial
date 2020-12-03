import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BookingService } from "app/booking-manage/booking.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "midas-transfer-booking-internal",
  templateUrl: "./transfer-booking-internal.component.html",
  styleUrls: ["./transfer-booking-internal.component.scss"],
})
export class TransferBookingInternalComponent implements OnInit {
  bookingInfo: any;
  constructor(
    private bookingService: BookingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.bookingInfo = data;
  }

  form: FormGroup;
  listSavingAccount: any;
  buSavingAccounts: any;
  filteredClient: any[];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      clientSavingAccount: [""],
      buSavingAccount: [""],
      amountTransfer: [""],
    });
    this.bookingService.getTransferBookingAmountTemplate(this.bookingInfo.createdBy).subscribe((cl: any) => {
      this.listSavingAccount = cl.result.listSavingAccountStaff;
      this.buSavingAccounts = cl.result.listSavingAccountManager;
    });

  }

}
