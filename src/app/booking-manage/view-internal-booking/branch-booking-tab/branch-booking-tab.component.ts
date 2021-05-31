import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BookingService } from "app/booking-manage/booking.service";
import { EditBookingInternalComponent } from "app/booking-manage/dialog/edit-booking-internal/edit-booking-internal.component";
import { TransferBookingInternalComponent } from "app/booking-manage/dialog/transfer-booking-internal/transfer-booking-internal.component";
import { AlertService } from "app/core/alert/alert.service";
import { SettingsService } from "app/settings/settings.service";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "midas-branch-booking-tab",
  templateUrl: "./branch-booking-tab.component.html",
  styleUrls: ["./branch-booking-tab.component.scss"],
})
export class BranchBookingTabComponent implements OnInit {
  expandedElement: any;
  displayedColumns: any[] =
  ["bookingRefNo", "officeName", "staffName",
   "bookingAmount", "getBookedAmount", "txnDate",
    "actions"];
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

    this.formFilter = this.formBuilder.group({
      officeName: [''],
      staffName: [''],
    });

  }

  textDecorateBooking(status: string) {
    if (status == "A") return " onBookingAmount";
    else if (status == "C") return " onTransactionAmount";
  }

  getBookingInternal() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    // let officeName = this.formFilter.get("officeName").value ;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.bookingService.getManageBookingBranch( fromDate, toDate).subscribe((data: any) => {
      this.staffBookingInfo = data?.result?.bookingInternalResponseDto;
      this.dataSource = data?.result?.bookingInternalResponseDto?.lisBookingManagementDtos;
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

  ngOnInit(): void {}

  loadData() {
    setTimeout(() => {
      const pageIndex = this.paginator.pageIndex;
      const pageSize = this.paginator.pageSize;
      this.BookingList = this.BookingFilter?.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
    });
  }

  transferBookingInternal(bookingInternal: any) {
    const dateFormat = this.settingsService.dateFormat;
    const dialog = this.dialog.open(TransferBookingInternalComponent, {
      data: {
        createdBy: bookingInternal.createdBy,
        staffName: bookingInternal.userName,
      },
    });
    dialog.afterClosed().subscribe((data) => {
      let transferInfo = {
        bookingRefNo: bookingInternal.bookingRefNo,
        savingAccountPaid: data.data.value.buSavingAccount,
        amountPaid: data.data.value.amountTransfer,
        savingAccountGet: data.data.value.clientSavingAccount,
      };

      if (data) {
        this.bookingService.transferBookingAmount(transferInfo,  "BB").subscribe((result) => {
          if (result?.result?.status) {
            const message = `Chi tiền cho booking ${transferInfo.bookingRefNo} thành công`;

            this.alertService.alert({
              type: '🎉🎉🎉 Thành công !!!',
              message: message,
              msgClass: 'cssSuccess'
            });
            this.getBookingInternal();
          } else {
            this.alertService.alert({
              type: '🚨🚨🚨🚨 Lỗi ',
              msgClass: 'cssDanger',
              message: result?.error,
            });
          }

        });
      }
    });
  }

}
