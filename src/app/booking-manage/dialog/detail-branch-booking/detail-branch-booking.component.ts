import { TransactionService } from "app/transactions/transaction.service";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormfieldBase } from "app/shared/form-dialog/formfield/model/formfield-base";
import { Router } from "@angular/router";
import { BookingService } from "app/booking-manage/booking.service";

@Component({
  selector: "midas-detail-branch-booking",
  templateUrl: "./detail-branch-booking.component.html",
  styleUrls: ["./detail-branch-booking.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class DetailBranchBookingDialogComponent implements OnInit {
  expandedElement: any;
  transactionInfo: any;
  dataSource: any[];
  displayedColumns: string[] = ["terminal", "batchNo", "amount"];
  form: FormGroup;
  pristine: boolean;

  constructor(
    private transactionService: TransactionService,
    private bookingService: BookingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.getDetailBookingBranch(data.bookingRefNo);
  }

  ngOnInit() {}


  formatCurrency(value: string) {
    value = String(value);
    const neg = value.startsWith("-");
    value = value.replace(/[-\D]/g, "");
    value = value.replace(/(\d{3})$/, ",$1");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    value = value !== "" ? "" + value : "";
    if (neg) {
      value = "-".concat(value);
    }

    return value;
  }

  getDetailBookingBranch(bookingRefNo: string) {
    this.bookingService.getDetailBranchBookingByRefNo(bookingRefNo).subscribe((result) => {
      this.dataSource = result?.result.listDetailBooking;
    });
  }

  displayTransactionType(type: string) {
    if (type.startsWith("B")) return "Lô";
    switch (type) {
      case "cash":
        return "Cash";
      case "rollTerm":
        return "Advance";
      default:
        return "";
    }
  }
}
