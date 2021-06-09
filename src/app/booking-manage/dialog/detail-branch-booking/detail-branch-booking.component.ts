import { TransactionService } from "app/transactions/transaction.service";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormfieldBase } from "app/shared/form-dialog/formfield/model/formfield-base";
import { Router } from "@angular/router";
import { BookingService } from "app/booking-manage/booking.service";
import { ClientsService } from "app/clients/clients.service";
import { AlertService } from "app/core/alert/alert.service";

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
  displayedColumns: string[] = ["terminal", "batchNo", "amount", "bill"];
  form: FormGroup;
  pristine: boolean;

  constructor(
    private clientService: ClientsService,
    private bookingService: BookingService,
    private transactionService: TransactionService,
    private alertService: AlertService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getDetailBookingBranch(data.bookingRefNo);
  }

  ngOnInit() {}

  download(parentEntityId: string, documentId: string) {
    this.clientService.downloadClientDocument(parentEntityId, documentId).subscribe((res) => {
      const url = window.URL.createObjectURL(res);
      window.open(url);
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

  getDetailBookingBranch(bookingRefNo: string) {
    this.bookingService.getDetailBranchBookingByRefNo(bookingRefNo).subscribe((result) => {
      this.dataSource = result?.result.listDetailBooking;
    });
  }

  async changeListener($event: any, bookingRefNo: string) {
    await this.readThis($event.target, bookingRefNo);
  }

  async readThis(inputValue: any, bookingRefNo: string) {
    var file: File = inputValue.files[0];
    if (!file) {
      return;
    }

    file = await this.transactionService.resizeImage(file, 1920, 1080 );

    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.dataSource.forEach((transaction) => {
        if (transaction.bookingRefNo == bookingRefNo) {
          let fileSubmitBase64 = myReader.result;
          this.transactionService
            .uploadBillForBranchBooking(bookingRefNo, String(fileSubmitBase64))
            .subscribe((result) => {
              if (result.status === "200") {
                const message = "Tải lên thành công!";
                this.alertService.alert({
                  msgClass: "cssInfo",
                  message: message,
                });
                this.getDetailBookingBranch(bookingRefNo);
              } else {
                this.alertService.alert({
                  msgClass: "cssDanger",
                  message: result.error,
                });
              }
            });
        }
      });
    };
    myReader.readAsDataURL(file);
  }
}
