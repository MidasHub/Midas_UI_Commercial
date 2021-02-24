import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormfieldBase } from "app/shared/form-dialog/formfield/model/formfield-base";
import { BookingService } from "app/booking-manage/booking.service";
import { Router } from "@angular/router";
import { AddFeeDialogComponent } from "app/transactions/dialog/add-fee-dialog/add-fee-dialog.component";
import { TransactionService } from "app/transactions/transaction.service";
import { AlertService } from "app/core/alert/alert.service";
import { ViewFeePaidTransactionDialogComponent } from "app/transactions/dialog/view-fee-paid-transaction-dialog/view-fee-paid-transaction-dialog.component";
import { DatePipe } from "@angular/common";

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
  isLoading = false;
  displayedColumns: string[] = ["transaction", "txnDate", "amount", "fee", "getAmount", "actions"];
  rollTermId: string;
  form: FormGroup;
  pristine: boolean;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private bookingService: BookingService,
    private alertService: AlertService,
    private changeDetectorRefs: ChangeDetectorRef,
    private transactionService: TransactionService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.rollTermId = data.rollTermId;
    this.getRollTermScheduleAndCardDueDayInfo(data.rollTermId);
  }

  ngOnInit() {}

  routeToMakeRollTermGetCash(tranId: string, bookingId: string, remainValue: string) {
    if (this.transactionInfo?.totalAmountPaid <= this.transactionInfo?.totalAmountGet) {
      const message = "Vui lòng thực hiện chi tiền trước!";
      this.alertService.alert({
        msgClass: "cssDanger",
        message: message,
      });
      return;
    }
    this.router.navigate(["/transaction/create"], {
      queryParams: {
        tranId: tranId,
        bookingId: bookingId,
        remainValue: remainValue,
        type: "rollTermGetCash",
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
    this.dataSource = [];
    this.isLoading = true;

    this.bookingService.getBookingInternalByRollTermId(rollTermId).subscribe((result) => {
      this.isLoading = false;
      this.dataSource = result?.result.bookingInternalResponseDto?.listBookingInternalEntities;

      this.transactionInfo = result?.result.bookingInternalResponseDto?.billPosTransactionDailyEntity;
      this.transactionInfo.feeAmount = (
        (this.transactionInfo.feePercentage / 100) *
        this.transactionInfo?.reqAmount
      ).toFixed(0);
      this.transactionInfo.totalAmountGet = 0;

      this.dataSource.forEach((element) => {
        this.transactionInfo.rollTermId = element.rollTermId;
        this.transactionInfo.totalAmountPaid = element.totalPaid;
        this.transactionInfo.totalAmountGet += element.totalGet;
      });
    });
  }

  addFeeDialogByTransactionId(isTrnRefNo: boolean, transactionId: string) {
    if (isTrnRefNo) {
      this.addFeeDialog(transactionId);
    } else {
      this.transactionService.getTransactionDetail(transactionId).subscribe((result) => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          data: {
            txnCode: result?.result?.detailTransactionDto?.trnRefNo,
          },
        };
        // dialogConfig.minWidth = 400;
        const dialog = this.dialog.open(AddFeeDialogComponent, dialogConfig);
        dialog.afterClosed().subscribe((data) => {
          if (data) {
            this.getRollTermScheduleAndCardDueDayInfo(data.rollTermId);
          }
        });
      });
    }
  }

  viewFeeDialogHistory(isTrnRefNo: boolean, txnCode: string) {
    if (isTrnRefNo) {
      this.viewFeeDialog(txnCode);
    } else {
      this.transactionService.getTransactionDetail(txnCode).subscribe((result) => {
        let txnCode = result?.result?.detailTransactionDto?.trnRefNo;
        this.viewFeeDialog(txnCode);
      });
    }
  }

  viewFeeDialog(txnCode: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: {
        txnCode: txnCode,
      },
    };
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(ViewFeePaidTransactionDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe((data) => {
      if (data && data.status) {
      }
    });
  }
  addFeeDialog(txnCode: string) {
    if (!txnCode) {
      const message = "Vui lòng thực hiện giao dịch thu hồi trước!";
      this.alertService.alert({
        msgClass: "cssDanger",
        message: message,
      });
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: {
        txnCode: txnCode,
      },
    };
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(AddFeeDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.getRollTermScheduleAndCardDueDayInfo(data.rollTermId);
      }
    });
  }
  menuOpened() {
    console.log("menuOpened");
  }

  menuClosed() {
    console.log("menuClosed");
  }

  calculateTotalBookingAmount(indexEdit: number) {
    let lastAmountBooking = 0;
    let totalBookingAmountTmp = 0;
    let bookingEdited = this.dataSource[indexEdit];
    for (let index = 0; index < this.dataSource.length; index++) {
      totalBookingAmountTmp += this.dataSource[index].bookingAmount;
    }
    lastAmountBooking = this.dataSource[this.dataSource.length - 1].bookingAmount;

    // check valid amount change
    if (totalBookingAmountTmp > this.transactionInfo.reqAmount + lastAmountBooking) {
      const message = "Tổng số tiền lịch đáo hạn sau điều chỉnh không thể vượt quá giá trị khoản đáo hạn! ";
      this.alertService.alert({
        msgClass: "cssDanger",
        message: message,
      });

      this.getRollTermScheduleAndCardDueDayInfo(this.rollTermId);
      return;
    } else {
      if (bookingEdited.trnRefNo && bookingEdited.totalGet > bookingEdited.bookingAmount) {
        const message = "Số tiền điều chỉnh không thể nhỏ hơn số tiền đã thu hồi! ";
        this.alertService.alert({
          msgClass: "cssDanger",
          message: message,
        });

        this.getRollTermScheduleAndCardDueDayInfo(this.rollTermId);
        return;
      } else {
        // save change amount of booking
        this.editBookingRow(bookingEdited);
        // set lastAmount of booking
        lastAmountBooking = this.transactionInfo.reqAmount - totalBookingAmountTmp;
        this.dataSource[this.dataSource.length - 1].bookingAmount += lastAmountBooking;
        this.editBookingRow(this.dataSource[this.dataSource.length - 1]);
      }
    }
  }

  addBookingRow = function () {
    let BookingRollTerm = {
      txnDate: this.datePipe.transform(new Date(), "dd/MM/yyyy"),
      amountBooking: 0,
      bookingRefNo: this.dataSource[0].bookingRefNo,
      isIsTmpBooking: false,
      productId: "AL01",
      rollTermId: this.rollTermId,
      cardId: this.dataSource[0].identifierId,
      clientId: this.dataSource[0].customerId,
    };
    this.bookingService.addRowBookingInternalOnRollTermSchedule(BookingRollTerm).subscribe((data: any) => {
      this.getRollTermScheduleAndCardDueDayInfo(this.rollTermId);
    });
  };

  removeBookingRow(index: number) {
    let bookingInfo = this.dataSource[index];
    let BookingRollTerm = {
      bookingInternalId: bookingInfo.refid,
    };
    this.bookingService.removeRowBookingInternalOnRollTermSchedule(BookingRollTerm).subscribe((data: any) => {
      this.getRollTermScheduleAndCardDueDayInfo(this.rollTermId);
    });
  }

  editBookingRow(booking: any) {
    let BookingRollTerm = {
      bookingInternalId: booking.refid,
      amountBooking: booking.bookingAmount,
      txnDate: this.datePipe.transform(booking.txnDate, "dd/MM/yyyy"),
    };
    this.bookingService.editBookingInternalOnRollTermSchedule(BookingRollTerm).subscribe((data: any) => {
      this.getRollTermScheduleAndCardDueDayInfo(this.rollTermId);
    });
  }
}
