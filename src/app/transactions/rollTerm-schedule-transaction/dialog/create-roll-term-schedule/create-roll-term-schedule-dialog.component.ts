import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormfieldBase } from "app/shared/form-dialog/formfield/model/formfield-base";
import { BookingService } from "app/booking-internal/booking.service";
import { Router } from "@angular/router";

@Component({
  selector: "midas-create-roll-term-schedule-dialog",
  templateUrl: "./create-roll-term-schedule-dialog.component.html",
  styleUrls: ["./create-roll-term-schedule-dialog.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class CreateRollTermScheduleDialogComponent implements OnInit {
  expandedElement: any;
  transactionInfo: any;
  dataSource: any[];
  displayedColumns: string[] = [
    "transaction",
    "txnDate",
    "amount",
  ];


  form: FormGroup;
  pristine: boolean;

  constructor(
    private router: Router,
    private bookingService : BookingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {

    // this.getRollTermScheduleAndCardDueDayInfo(data.rollTermId);
}

  ngOnInit() {

  }

  getRollTermScheduleAndCardDueDayInfo(rollTermId: string) {

    this.bookingService
      .getBookingInternalByRollTermId(rollTermId)
      .subscribe((result) => {

        this.dataSource = result?.result.bookingInternalResponseDto?.listBookingInternalEntities;
        this.transactionInfo = result?.result.bookingInternalResponseDto?.billPosTransactionDailyEntity;
        this.transactionInfo.feeAmount = ((this.transactionInfo.feePercentage / 100 ) * this.transactionInfo.reqAmount ).toFixed(0) ;
      });
  }


  menuOpened() {
    console.log("menuOpened");
  }

  menuClosed() {
    console.log("menuClosed");
  }


}
