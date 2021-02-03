import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AlertService } from "app/core/alert/alert.service";
import { SettingsService } from "app/settings/settings.service";
import { ConfirmDialogComponent } from "app/transactions/dialog/coifrm-dialog/confirm-dialog.component";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";
import { BookingService } from "../booking.service";

@Component({
  selector: "midas-agency-booking",
  templateUrl: "./agency-booking.component.html",
  styleUrls: ["./agency-booking.component.scss"],
})
export class BookingAgencyComponent implements OnInit {
  expandedElement: any;
  displayedColumns: any[] = [
    "officeName",
    "txnDate",
    "trancheNo",
    "agencyInfo",
    "bookingAmount",
    "amountTransaction",
    "amountCancel",
    "amountRemain",
    "batchTxnName",
    "actions",
  ];
  totalBooking: any;
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
      fromDate: [new Date(new Date().setMonth(new Date().getMonth() - 4))],
      toDate: [new Date()],
    });
    this.formFilter = this.formBuilder.group({
      officeName: [""],
      trancheNo: [""],
      userNameTelegram: [""],
    });
    this.getBookingAgency();
  }

  textDecorateBooking(status: string) {
    if (status == "A") return " onBookingAmount";
    else if (status == "C") return " onTransactionAmount";
  }

  displayTrancheNo(tranche: string) {
    return this.TrancheNoOption.find((v) => v.value == tranche)?.label || "N/A";
  }

  getBookingAgency() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.bookingService.getBookingAgency(fromDate, toDate).subscribe((data: any) => {
      this.dataSource = data?.result?.lisBookingDaily;
      this.BookingFilter = this.dataSource;
      this.loadData();
    });
  }

  sortData(sort: any) {
    this.BookingFilter = this.BookingFilter.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "trancheNo":
          return this.compare(a.trancheNo, b.trancheNo, isAsc);
        case "txnDate":
          return this.compare(a.txnDate, b.txnDate, isAsc);
        case "bookingAmount":
          return this.compare(a.bookingAmount, b.bookingAmount, isAsc);
        case "amountTransaction":
          return this.compare(a.amountTransaction, b.amountTransaction, isAsc);
        default:
          return 0;
      }
    });
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadData()))
      .subscribe();
  }

  ngOnInit(): void {
    this.formFilter.valueChanges.subscribe((e) => [this.filterData()]);
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  loadData() {
    this.totalBooking = {
      totalAmountBooking: 0,
      totalAmountUsed: 0,
      totalAmountCanceled: 0,
    };
    // setting none agency   transaction
    this.BookingFilter.forEach((element) => {
      this.totalBooking.totalAmountBooking += element.bookingAmount;
      if (element.status == "C" || element.amountTransaction > 0) {
        this.totalBooking.totalAmountUsed += element.status == "C" ? 0 : element.amountTransaction;
        this.totalBooking.totalAmountCanceled += element.status == "C" ? element.bookingAmount : 0;
      }
    });

    setTimeout(() => {
      const pageIndex = this.paginator.pageIndex;
      const pageSize = this.paginator.pageSize;
      this.BookingList = this.BookingFilter.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
    });
  }

  filterData() {
    const form = this.formFilter.value;
    const keys = Object.keys(form);
    this.BookingFilter = this.dataSource.filter((v) => {
      for (const key of keys) {
        if (form[key] && !String(v[key]).toLowerCase().includes(String(form[key]).toLowerCase())) {
          return false;
        }
      }
      return true;
    });

    this.paginator.pageIndex = 0;
    this.loadData();
  }

  cancelBooking(bookingInfo: any) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Bạn chắc chắn muốn hủy booking của [${bookingInfo.userNameTelegram}]`,
        title: `Hủy booking`,
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.bookingService.cancelBookingAgency(bookingInfo.refid).subscribe((result) => {
          if (result.status === "200") {
            const message = `Hủy booking ${bookingInfo.userNameTelegram} thành công`;
            this.alertService.alert({
              msgClass: "cssInfo",
              message: message,
            });
            this.getBookingAgency();
          }
        });
      }
    });
  }

  removeBooking(bookingInfo: any) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Bạn chắc chắn muốn xóa hiện thị booking của [${bookingInfo.userNameTelegram}]`,
        title: `Xóa booking`,
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.bookingService.removeBookingAgency(bookingInfo.refid).subscribe((result) => {
          if (result.status === "200") {
            const message = `Xóa booking ${bookingInfo.userNameTelegram} thành công`;
            this.alertService.alert({
              msgClass: "cssInfo",
              message: message,
            });
            this.getBookingAgency();
          }
        });
      }
    });
  }
}
