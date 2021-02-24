import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AuthenticationService } from "../../../core/authentication/authentication.service";
import { AlertService } from "../../../core/alert/alert.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { BookingService } from "app/booking-manage/booking.service";

@Component({
  selector: "midas-detail-booking-roll-term-schedule",
  templateUrl: "./detail-booking-roll-term-schedule.component.html",
  styleUrls: ["./detail-booking-roll-term-schedule.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class DetailBookingRollTermScheduleComponent implements OnInit {
  bookingRefNo: any;
  transactions: any[] = [];
  expandedElement: any;
  displayedColumns: string[] = ["bookingRefNo", "txnDate","clientName", "bookingAmount"];

  constructor(
    public dialogRef: MatDialogRef<DetailBookingRollTermScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookingService: BookingService,
    public dialog: MatDialog
  ) {
    this.bookingRefNo = data.bookingRefNo;
    this.getData();
  }

  getData() {
    this.bookingService.getDetailRollTermScheduleBookingByRefNo(this.bookingRefNo).subscribe((result) => {
      this.transactions = result?.result?.bookingInternalResponseDto?.listBookingInternalEntities;
    });
  }

  ngOnInit(): void {}
}
