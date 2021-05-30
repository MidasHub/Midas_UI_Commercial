import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AlertService } from "app/core/alert/alert.service";
import { SettingsService } from "app/settings/settings.service";
import { ConfirmDialogComponent } from "app/transactions/dialog/confirm-dialog/confirm-dialog.component";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";
import { BookingService } from "../booking.service";
import { AddBookingInternalComponent } from "../dialog/add-booking-internal/add-booking-internal.component";
import { EditBookingInternalComponent } from "../dialog/edit-booking-internal/edit-booking-internal.component";

@Component({
  selector: "midas-create-internal-booking",
  templateUrl: "./create-internal-booking.component.html",
  styleUrls: ["./create-internal-booking.component.scss"],
})
export class CreateInternalBookingComponent implements OnInit {
  expandedElement: any;
  displayedColumns: any[] = [
    "bookingRefNo",
    "bookingAmount",
    "getBookedAmount",
    "txnDate",
    "actions",
  ];
  totalBooking: any;
  staffBookingInfo: any;
  dataSource: any[] = [];
  formFilter: FormGroup;
  formDate: FormGroup;
  BookingFilter: any[] = [];
  BookingList: any[] = [];
  staffs: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  TrancheNoOption: any[] = [
    {
      label: "Tất cả ca tiền",
      value: "",
    },
    {
      label: "8h-10h30",
      value: "1",
    },
    {
      label: "10h30-12h",
      value: "2",
    },
    {
      label: "12h-14h30",
      value: "3",
    },
    {
      label: "14h30-16h00",
      value: "4",
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private settingsService: SettingsService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private alertService: AlertService
  ) {
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
    });
    this.getBookingInternal();
  }

  textDecorateBooking(status: string) {
    if (status == "A") return " onBookingAmount";
    else if (status == "C") return " onTransactionAmount";
  }

  displayTrancheNo(tranche: string) {
    return this.TrancheNoOption.find((v) => v.value == tranche)?.label || "N/A";
  }

  getBookingInternal() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.bookingService.getBookingInternal(fromDate, toDate).subscribe((data: any) => {
      this.staffBookingInfo =  data?.result?.bookingInternalResponseDto;
      this.dataSource = data?.result?.bookingInternalResponseDto?.listBookingInternalEntities;
      this.BookingFilter = this.dataSource;
      this.loadData();
    });
  }



  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadData()))
      .subscribe();
  }

  ngOnInit(): void {

  }

  loadData() {

    setTimeout(() => {
      const pageIndex = this.paginator.pageIndex;
      const pageSize = this.paginator.pageSize;
      this.BookingList = this.BookingFilter.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
    });
  }

  addBooking() {
    const dateFormat = this.settingsService.dateFormat;
    const dialog = this.dialog.open(AddBookingInternalComponent, {
      data: {
        btnTitle: 'Thêm',
      },
    });
    dialog.afterClosed().subscribe((data) => {
      let bookingInfo = {

        txnDate: this.datePipe.transform(data.data.value.txnDate , dateFormat),
        amountBooking: data.data.value.bookingAmount,
        note: data.data.value.note,

      }
      if (data) {
        this.bookingService.addBookingInternal(bookingInfo).subscribe((result) => {
          if (result.status === "200") {
            const message = `Thêm booking ${bookingInfo.amountBooking} thành công`;
            this.alertService.alert({
              msgClass: "cssInfo",
              message: message,
            });
            this.getBookingInternal();
          }
        });
      }
    });
  }

  editBooking(bookingInternal: any) {
    const dateFormat = this.settingsService.dateFormat;
    const dialog = this.dialog.open(EditBookingInternalComponent, {
      data: {
        btnTitle: 'Cập nhật',
        txnDate: bookingInternal.txnDate,
        bookingAmount: bookingInternal.bookingAmount
      },
    });
    dialog.afterClosed().subscribe((data) => {
      let bookingInfo = {
        bookingInternalId: bookingInternal.refid,
        txnDate: this.datePipe.transform(data.data.value.txnDate , dateFormat),
        amountBooking: data.data.value.bookingAmount,
      }

      if (data) {
        this.bookingService.editBookingInternal(bookingInfo).subscribe((result) => {
          if (result.status === "200") {
            const message = `Cập nhật booking ${bookingInfo.amountBooking} thành công`;
            this.alertService.alert({
              msgClass: "cssInfo",
              message: message,
            });
            this.getBookingInternal();
          }
        });
      }
    });
  }

  removeBooking(bookingInfo: any) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Bạn chắc chắn muốn xóa hiện thị booking của [${bookingInfo.bookingRefNo}]`,
        title: `Xóa booking`,
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.bookingService.removeBookingInternal(bookingInfo.refid).subscribe((result) => {
          if (result.status === "200") {
            const message = `Xóa booking ${bookingInfo.userNameTelegram} thành công`;
            this.alertService.alert({
              msgClass: "cssInfo",
              message: message,
            });
            this.getBookingInternal();
          }
        });
      }
    });
  }
}
