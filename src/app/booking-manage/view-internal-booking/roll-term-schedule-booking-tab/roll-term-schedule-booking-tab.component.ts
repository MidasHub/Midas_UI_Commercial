import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BookingService } from "app/booking-manage/booking.service";
import { DetailBookingRollTermScheduleComponent } from "app/booking-manage/dialog/detail-booking-roll-term-schedule/detail-booking-roll-term-schedule.component";
import { EditBookingInternalComponent } from "app/booking-manage/dialog/edit-booking-internal/edit-booking-internal.component";
import { AlertService } from "app/core/alert/alert.service";
import { SettingsService } from "app/settings/settings.service";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "midas-roll-term-schedule-booking-tab",
  templateUrl: "./roll-term-schedule-booking-tab.component.html",
  styleUrls: ["./roll-term-schedule-booking-tab.component.scss"],
})
export class RollTermScheduleBookingTabComponent implements OnInit {
  expandedElement: any;
  displayedColumns: any[] = ["bookingRefNo",
   "officeName", "userName", "clientName",
    "bookingAmount",  "actions"];
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
  ) {
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
    });
    this.formFilter = this.formBuilder.group({
      officeName: [''],
      staffName: [''],
      clientName: [''],
    });
    this.getBookingInternal();
  }

  textDecorateBooking(status: string) {
    if (status == "A") return " onBookingAmount";
    else if (status == "C") return " onTransactionAmount";
  }

  getBookingInternal() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    let staffName = this.formFilter.get("staffName").value;
    let officeName = this.formFilter.get("officeName").value ;
    let clientName = this.formFilter.get("clientName").value ;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.bookingService.getManageBookingRollTermSchedule(officeName, staffName, clientName, fromDate, toDate).subscribe((data: any) => {
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

  viewBookingInternal(bookingInternal: any) {
    const dialog = this.dialog.open(DetailBookingRollTermScheduleComponent, {
      data: {
        bookingRefNo: bookingInternal.bookingRefNo,
      },
    });

  }

}
