import { animate, state, style, transition, trigger } from "@angular/animations";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BanksService } from "app/banks/banks.service";
import { BookingService } from "app/booking-manage/booking.service";
import { CentersService } from "app/centers/centers.service";
import { ClientsService } from "app/clients/clients.service";
import { AlertService } from "app/core/alert/alert.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { OrganizationService } from "app/organization/organization.service";
import { SavingsService } from "app/savings/savings.service";
import { SettingsService } from "app/settings/settings.service";
import { ConfirmDialogComponent } from "app/transactions/dialog/confirm-dialog/confirm-dialog.component";
import { TransactionService } from "app/transactions/transaction.service";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";
import { CreateRollTermScheduleDialogComponent } from "../dialog/create-roll-term-schedule/create-roll-term-schedule-dialog.component";
import { ExecuteLoanDialogComponent } from "../dialog/execute-loan-dialog/execute-loan-dialog.component";
import { RollTermScheduleDialogComponent } from "../dialog/roll-term-schedule/roll-term-schedule-dialog.component";

@Component({
  selector: "midas-roll-term-schedule-tab",
  templateUrl: "./roll-term-schedule-tab.component.html",
  styleUrls: ["./roll-term-schedule-tab.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class RollTermScheduleTabComponent implements OnInit {
  isLoading: boolean = false;
  expandedElement: any;
  displayedColumns: string[] = [
    "panHolderName",
    "isCheck",
    "createdDate",
    // "cardNumber",
    "officeName",
    // "agencyName",
    "requestAmount",
    "paidAmount",
    "remainAmount",
    "txnAmount",
    "waitGetAmount",
    "actions",
  ];
  formDate: FormGroup;
  formFilter: FormGroup;
  dataSource: any[];
  transactionsData: any;
  currentUser: any;
  transactionType: any[] = [
    {
      label: "All",
      value: "",
    },
    {
      label: "Giao dịch Cash",
      value: "CA01",
    },
    {
      label: "Giao dịch Advance",
      value: "AL01",
    },
    {
      label: "Giao dịch test thẻ",
      value: "TEST",
    },
    {
      label: "Giao dịch lô lẻ",
      value: "CA02",
    },
  ];
  statusOption: any[] = [
    {
      label: "ALL",
      value: "",
    },
    {
      label: "Thành công",
      value: "C",
    },
    {
      label: "Chờ đợi",
      value: "P",
    },
    {
      label: "Hủy",
      value: "V",
    },
  ];
  partners: any[];
  staffs: any[];
  banks: any[];
  offices: any[];
  totalTerminalAmount = 0;
  totalFeeAmount = 0;
  totalCogsAmount = 0;
  totalPnlAmount = 0;
  panelOpenState = false;
  permitFee = false;
  filterData: any[];
  today = new Date();
  cardTypeOption: any[] = [];
  cardHoldOption = [
    {
      code: "ALL",
      description: "Tất cả",
    },
    {
      code: "200",
      description: "Giử Thẻ",
    },
    {
      code: "100",
      description: "Không giử thẻ",
    },
  ];

  CheckedFilterOption = [
    {
      code: 0,
      description: "Giao dịch đã/chưa chọn ",
    },
    {
      code: 1,
      description: "Chưa chọn",
    },
    {
      code: 2,
      description: "Đã được chọn",
    },
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private banksServices: BanksService,
    private savingsService: SavingsService,
    private clientServices: ClientsService,
    private bookingService: BookingService,
    private alertService: AlertService
  ) {
    this.formDate = this.formBuilder.group({
      fromDate: [new Date(new Date().setMonth(new Date().getMonth() - 1))],
      toDate: [new Date()],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    this.banksServices.getBanks().subscribe((result) => {
      this.banks = result;
    });

    this.banksServices.getCardType().subscribe((result) => {
      this.cardTypeOption = result?.result?.listCardType;
    });

    this.clientServices.getListUserTeller(this.currentUser.officeId).subscribe((result: any) => {
      this.staffs = result?.result?.listStaff.filter((staff: any) => staff.displayName.startsWith("R"));
      this.staffs?.unshift({
        userId: undefined,
        displayName: "Tất cả",
      });
    });

    this.formFilter = this.formBuilder.group({
      OfficeFilter: [""],
      createdByFilter: [""],
      bankFilter: ["ALL"],
      cardType: ["ALL"],
      cardHoldFilter: ["ALL"],
      dueDay: [""],
      query: [""],
      viewDoneTransaction: [false],
      isCheckedFilter: [0],
      checkedByUserName: [""],
    });

    this.banksServices.getListOfficeCommon().subscribe((offices: any) => {
      this.offices = offices.result.listOffice;
      this.offices?.unshift({
        id: "",
        name: "Tất cả",
      });

      this.formFilter.get("OfficeFilter").valueChanges.subscribe((value) => {
        this.clientServices.getListUserTeller(value).subscribe((result: any) => {
          this.staffs = result?.result?.listStaff.filter((staff: any) => staff.displayName.startsWith("R"));
          this.staffs?.unshift({
            userId: undefined,
            displayName: "Tất cả",
          });
        });
      });
    });

    this.getRollTermScheduleAndCardDueDayInfo();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.getRollTermScheduleAndCardDueDayInfo()))
      .subscribe();
  }

  checkedRollTermBooking(rollTermId: any, isCheck: any) {
    if (!rollTermId) {
      return;
    }

    isCheck = isCheck ? false : true;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Bạn chắc chắn chọn khoản Advance này!`,
        title: "Hoàn thành xác thực",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.bookingService.checkedBranchBookingByRollTermId(rollTermId, isCheck).subscribe((result: any) => {
          if (result?.status) {
            const message = `Xác thực thành công`;

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

          this.getRollTermScheduleAndCardDueDayInfo();
        });
      }

    });
  }

  getRollTermScheduleAndCardDueDayInfo() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    const query = this.formFilter.get("query").value;
    const bankFilter = this.formFilter.get("bankFilter").value;
    const cardTypeFilter = this.formFilter.get("cardType").value;
    const createdByFilter = this.formFilter.get("createdByFilter").value;
    const officeFilter = this.formFilter.get("OfficeFilter").value;
    const dueDayFilter = this.formFilter.get("dueDay").value;
    const cardHoldFilter = this.formFilter.get("cardHoldFilter").value;
    const viewDoneTransaction = this.formFilter.get("viewDoneTransaction").value;
    const isCheckedFilter = this.formFilter.get("isCheckedFilter").value;
    const checkedByUserName = this.formFilter.get("checkedByUserName").value;

    const limit = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const offset = this.paginator.pageIndex * limit;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.isLoading = true;
    this.dataSource = [];
    this.transactionService
      .getListRollTermTransactionOpenByUserId({
        fromDate,
        toDate,
        bankFilter,
        cardTypeFilter,
        query,
        limit,
        createdByFilter,
        offset,
        officeFilter,
        dueDayFilter,
        viewDoneTransaction,
        cardHoldFilter,
        isCheckedFilter,
        checkedByUserName
      })
      .subscribe((result) => {
        this.isLoading = false;
        this.transactionsData = result?.result;
        this.dataSource = result?.result?.listPosTransaction;
      });
  }

  ExportExcel() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    const query = this.formFilter.get("query").value;
    const bankFilter = this.formFilter.get("bankFilter").value;
    const cardTypeFilter = this.formFilter.get("cardType").value;
    const createdByFilter = this.formFilter.get("createdByFilter").value;
    const officeFilter = this.formFilter.get("OfficeFilter").value;
    const dueDayFilter = this.formFilter.get("dueDay").value;
    const cardHoldFilter = this.formFilter.get("cardHoldFilter").value;
    const viewDoneTransaction = this.formFilter.get("viewDoneTransaction").value;
    const isCheckedFilter = this.formFilter.get("isCheckedFilter").value;
    const checkedByUserName = this.formFilter.get("checkedByUserName").value;

    const limit = 999999999;
    const offset = 0;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    var data = [];
    this.transactionService
      .getListRollTermTransactionOpenByUserId({
        fromDate,
        toDate,
        bankFilter,
        cardTypeFilter,
        query,
        limit,
        createdByFilter,
        offset,
        officeFilter,
        dueDayFilter,
        viewDoneTransaction,
        cardHoldFilter,
        isCheckedFilter,
        checkedByUserName
      })
      .subscribe((result) => {
        this.transactionsData = result?.result;
        data = result?.result?.listPosTransaction;
        this.ExportExcel1(data);
      });
  }

  ExportExcel1(data:any[]) {
    let dataCopy = [];
    let i = -1;

    while (++i < data.length) {
      let custIdNo: any[] = [];
      let element = data[i];
      this.clientServices.getClientById(element.custId).subscribe((data) => {
        console.log("clientServices data ===> : ", data);
      });
      console.log("element: ", element);
      let e: any = {
        panHolderName: element.panHolderName, //Tên khách hàng
        externalId: element.externalId, //externalId
        feeReceive: ((element.feePercentage / 100) * element.reqAmount).toFixed(0), //phi thu
        createdDate: this.datePipe.transform(element.createdDate, "dd-MM-yyyy HH:mm:ss"), //Ngày tạo
        panNumber: element.panNumber, //the
        officeName: element.officeName, //Chi nhánh
        principal: element.principal, // Số tiền Tạm ứng
        paidAmount: element.paidAmount, //Đã tạm ứng
        unPaydAmount: element.principal - element.paidAmount, //Còn phải Tạm ứng
        amountPaid: element.amountPaid, //Đã thu hồi
        needToGetAmount: element.paidAmount - element.amountPaid, //Cần thu hồi
      };
      dataCopy.push(e);
    }
    this.transactionService.exportRollTermScheduleTab("RollTermScheduleTab", dataCopy);
  }
  
  // ExportExcel() {
  //   let dataCopy = [];
  //   let i = -1;

  //   while (++i < this.dataSource.length) {
  //     let custIdNo: any[] = [];
  //     let element = this.dataSource[i];
  //     this.clientServices.getClientById(element.custId).subscribe((data) => {
  //       console.log("clientServices data: ", data);
  //     });
  //     console.log("element: ", element);
  //     let e: any = {
  //       panHolderName: element.panHolderName, //Tên khách hàng
  //       externalId: element.externalId, //externalId
  //       feeReceive: ((element.feePercentage / 100) * element.reqAmount).toFixed(0), //phi thu
  //       createdDate: this.datePipe.transform(element.createdDate, "dd-MM-yyyy HH:mm:ss"), //Ngày tạo
  //       panNumber: element.panNumber, //the
  //       officeName: element.officeName, //Chi nhánh
  //       principal: element.principal, // Số tiền Tạm ứng
  //       paidAmount: element.paidAmount, //Đã tạm ứng
  //       unPaydAmount: element.principal - element.paidAmount, //Còn phải Tạm ứng
  //       amountPaid: element.amountPaid, //Đã thu hồi
  //       needToGetAmount: element.paidAmount - element.amountPaid, //Cần thu hồi
  //     };
  //     dataCopy.push(e);
  //   }
  //   this.transactionService.exportRollTermScheduleTab("RollTermScheduleTab", dataCopy);
  // }

  get fromDateAndToDate() {
    const fromDate = this.formDate.get("fromDate").value;
    const toDate = this.formDate.get("toDate").value;
    if (fromDate && toDate) {
      return true;
    }
    return false;
  }

  showRollTermScheduleDialog(rollTermId: string) {
    const data = {
      rollTermId: rollTermId,
    };
    const dialog = this.dialog.open(RollTermScheduleDialogComponent, { height: "auto", width: "80%", data });
    dialog.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const value = response.data.value;
      }
    });
  }

  executeLoanManualDialog(refId: string) {
    const data = {
      refId: refId,
    };
    const dialog = this.dialog.open(ExecuteLoanDialogComponent, { height: "auto", width: "50%", data });
    dialog.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const value = response.data.value;
      }
      this.getRollTermScheduleAndCardDueDayInfo();
    });
  }

  undoRollTermTransaction(transactionId: string, amountPaid: string) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Bạn chắc chắn muốn hủy khoản Advance " + transactionId,
        title: "Hủy giao dịch",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.transactionService
          .RepaymentRolltermManualTransactionCloseLoan(transactionId, amountPaid)
          .subscribe((result) => {
            const message = "Hủy giao dịch " + transactionId + " thành công";
            this.savingsService.handleResponseApiSavingTransaction(result, message, false);
            this.getRollTermScheduleAndCardDueDayInfo();
          });
      }
    });
  }
}
