import { element } from "protractor";
import { forEach } from "lodash";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BookingService } from "app/booking-manage/booking.service";
import { DetailBranchBookingDialogComponent } from "app/booking-manage/dialog/detail-branch-booking/detail-branch-booking.component";
import { TransferBookingInternalComponent } from "app/booking-manage/dialog/transfer-booking-internal/transfer-booking-internal.component";
import { AlertService } from "app/core/alert/alert.service";
import { SettingsService } from "app/settings/settings.service";
import { TerminalsService } from "app/terminals/terminals.service";
import { ConfirmDialogComponent } from "app/transactions/dialog/confirm-dialog/confirm-dialog.component";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "midas-branch-booking-tab",
  templateUrl: "./branch-booking-tab.component.html",
  styleUrls: ["./branch-booking-tab.component.scss"],
})
export class BranchBookingTabComponent implements OnInit {
  expandedElement: any;
  partners: any[];
  displayedColumns: any[] = [
    "bookingRefNo",
    "officeName",
    "status",
    "bookingAmount",
    "partner",
    "getBookedAmount",
    "needBookedAmount",
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
  totalAmountBooking = 0;
  totalAmountFromBooking = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private settingsService: SettingsService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private alertService: AlertService,
    private terminalsService: TerminalsService
  ) {
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
    });

    this.formFilter = this.formBuilder.group({
      officeName: [""],
      userName: [""],
      partnerCode: [""],
    });
  }
  showDetailBooking(bookingRefNo: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      bookingRefNo: bookingRefNo,
    };
    dialogConfig.minWidth = 1200;
    this.dialog.open(DetailBranchBookingDialogComponent, dialogConfig);
  }

  displayPartnerName(code: string) {
    const partnerInfo = this.partners?.filter((partner: any) => partner.code == code);
    return partnerInfo ? partnerInfo[0]?.desc : code;
  }

  textDecorateBooking(status: string) {
    if (status == "A") return " onBookingAmount";
    else if (status == "C") return " onTransactionAmount";
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

    this.bookingService.getManageBookingBranch(fromDate, toDate).subscribe((data: any) => {
      this.staffBookingInfo = data?.result?.bookingInternalResponseDto;
      this.staffBookingInfo.lisBookingManagementDtos.forEach((detail: any) => {
        detail.partnerCode = "";
        detail.listSumBooking.forEach((partner: any) => {
          detail.partnerCode += partner.partnerPos;
        });
      });
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

  ngOnInit(): void {
    this.formFilter.valueChanges.subscribe((e) => [this.filterData()]);
    this.terminalsService.getPartnersTerminalTemplate().subscribe((partner) => {
      this.partners = partner?.result?.partners;
      // @ts-ignore
      this.partners?.unshift({ code: "ALL", desc: "Tất cả đối tác" });
    });
  }

  filterData() {
    this.BookingFilter = [];
    const form = this.formFilter.value;
    const keys = Object.keys(form);
    this.BookingFilter = this.dataSource.filter((v) => {
      for (const key of keys) {
        if ("partnerCode".indexOf(key) != -1) {
          if (form[key] && form[key] == "ALL") {
            return true;
          }
        }

        if (form[key] && !String(v[key]).trim().toLowerCase().includes(String(form[key]).trim().toLowerCase())) {
          return false;
        }
      }
      return true;
    });
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      const pageIndex = this.paginator.pageIndex;
      const pageSize = this.paginator.pageSize;
      this.BookingList = this.BookingFilter?.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
      this.totalAmountBooking = this.BookingFilter?.reduce((total: any, num: any) => {
        return total + Math.round(num?.totalBooking);
      }, 0);
      this.totalAmountFromBooking = this.BookingFilter?.reduce((total: any, num: any) => {
        return total + Math.round(num?.totalPaid);
      }, 0);
    });
  }

  checkedBranchBooking(booking: any) {
    if (!booking) {
      return;
    }
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Bạn chắc chắn dòng booking này của '${booking.officeName}' là hợp lệ`,
        title: "Hoàn thành xác thực",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.bookingService.checkedBranchBookingByRefNo(booking.bookingRefNo).subscribe((result: any) => {
          if (result?.status) {
            const message = `Xác thực booking của ${booking.officeName} thành công`;

            this.alertService.alert({
              type: "🎉🎉🎉 Thành công !!!",
              message: message,
              msgClass: "cssSuccess",
            });
          } else {
            this.alertService.alert({
              type: "🚨🚨🚨🚨 Lỗi ",
              msgClass: "cssDanger",
              message: result?.error,
            });
          }
          this.getBookingInternal();
        });
      } else {
        this.getBookingInternal();
      }
    });
  }

  transferBookingInternal(bookingInternal: any) {
    const dateFormat = this.settingsService.dateFormat;
    const dialog = this.dialog.open(TransferBookingInternalComponent, {
      data: {
        createdBy: bookingInternal.createdBy,
        staffName: bookingInternal.userName,
        amount: bookingInternal.totalBooking - bookingInternal.totalPaid,
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
        this.bookingService.transferBookingAmount(transferInfo, "BB").subscribe((result) => {
          if (result?.result?.status) {
            const message = `Chi tiền cho booking ${transferInfo.bookingRefNo} thành công`;

            this.alertService.alert({
              type: "🎉🎉🎉 Thành công !!!",
              message: message,
              msgClass: "cssSuccess",
            });
            this.getBookingInternal();
          } else {
            this.alertService.alert({
              type: "🚨🚨🚨🚨 Lỗi ",
              msgClass: "cssDanger",
              message: result?.error,
            });
          }
        });
      }
    });
  }
}
