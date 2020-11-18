import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormfieldBase } from "app/shared/form-dialog/formfield/model/formfield-base";
import { BookingService } from "app/booking-internal/booking.service";
import { Router } from "@angular/router";

@Component({
  selector: "midas-roll-term-schedule-dialog",
  templateUrl: "./roll-term-schedule-dialog.component.html",
  styleUrls: ["./roll-term-schedule-dialog.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class RollTermScheduleDialogComponent implements OnInit {
  expandedElement: any;
  transactionInfo: any;
  dataSource: any[];
  displayedColumns: string[] = [
    "transaction",
    "txnDate",
    "amount",
    "fee",
    "paidAmount",
    "getAmount",
    "actions",
  ];


  form: FormGroup;
  pristine: boolean;

  constructor(
    private router: Router,
    private bookingService : BookingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {
    this.getRollTermScheduleAndCardDueDayInfo(data.rollTermId);
}

  ngOnInit() {

  }

routeToMakeRollTermGetCash(tranId: string, remainValue: string){
  this.router.navigate(["/transaction/create"], {
    queryParams: {
      tranId: tranId,
      remainValue: remainValue,
      type: 'rollTermGetCash',
    },
  });
}

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

  getRollTermScheduleAndCardDueDayInfo(rollTermId: string) {

    this.bookingService
      .getBookingInternalByRollTermId(rollTermId)
      .subscribe((result) => {

        this.dataSource = result?.result.bookingInternalResponseDto?.listBookingInternalEntities;
        this.transactionInfo = result?.result.bookingInternalResponseDto?.billPosTransactionDailyEntity;
        this.transactionInfo.feeAmount = this.formatCurrency(((this.transactionInfo.feePercentage / 100 ) * this.transactionInfo.reqAmount ).toFixed(0)) ;
        this.transactionInfo.reqAmount = this.formatCurrency(this.transactionInfo.reqAmount) ;

      });
  }


  menuOpened() {
    console.log("menuOpened");
  }

  menuClosed() {
    console.log("menuClosed");
  }


}
