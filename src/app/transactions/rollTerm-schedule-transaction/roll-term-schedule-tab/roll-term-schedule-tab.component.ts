import { animate, state, style, transition, trigger } from "@angular/animations";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { CentersService } from "app/centers/centers.service";
import { AlertService } from "app/core/alert/alert.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { SettingsService } from "app/settings/settings.service";
import { ConfirmDialogComponent } from "app/transactions/dialog/coifrm-dialog/confirm-dialog.component";
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

  expandedElement: any;
  displayedColumns: string[] = [
    "panHolderName",
    "createdDate",
    "clientBalance",
    "cardNumber",
    "officeName",
    "agencyName",
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
      label: "Giao dịch RTM",
      value: "CA01",
    },
    {
      label: "Giao dịch ĐHT",
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
    // {
    //   label: 'F',
    //   value: 'F'
    // },
    {
      label: "Hủy",
      value: "V",
    },
  ];
  partners: any[];
  staffs: any[];
  offices: any[];
  totalTerminalAmount = 0;
  totalFeeAmount = 0;
  totalCogsAmount = 0;
  totalPnlAmount = 0;
  panelOpenState = false;
  filterData: any[];
  today = new Date();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private centersService: CentersService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {
    this.formDate = this.formBuilder.group({
      fromDate: [new Date(new Date().setMonth(new Date().getMonth() - 1))],
      toDate: [new Date()],
    });
    this.formFilter = this.formBuilder.group({
      productId: [""],
      status: [""],
      partnerCode: [""],
      officeId: [""],
      panHolderName: [""],
      terminalId: [""],
      traceNo: [""],
      batchNo: [""],
      terminalAmount: [""],
      staffId: [""],
      trnRefNo: [""],
      RetailsChoose: [true],
      wholesaleChoose: [true],
      agencyName: [""],
    });
    this.formFilter.get("officeId").valueChanges.subscribe((value) => {
      // const office = this.offices.find(v => v.name === value);
      this.centersService.getStaff(value).subscribe((staffs: any) => {
        this.staffs = staffs?.staffOptions;
      });
    });
    this.formFilter.valueChanges.subscribe((value) => {
      this.getRollTermScheduleAndCardDueDayInfo();
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    this.getRollTermScheduleAndCardDueDayInfo();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.getRollTermScheduleAndCardDueDayInfo()))
      .subscribe();
  }

  getRollTermScheduleAndCardDueDayInfo() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    let clientName = null;
    let cardNumber = null;
    const limit = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const offset = this.paginator.pageIndex * limit ? this.paginator.pageSize * limit : 0;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.transactionService
      .getListRollTermTransactionOpenByUserId({ fromDate, toDate, clientName, cardNumber, limit, offset })
      .subscribe((result) => {
        this.transactionsData = result?.result;
        this.dataSource = result?.result.listPosTransaction;
      });
  }

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
      console.log(response);
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
      console.log(response);
      if (response.data) {
        const value = response.data.value;

      }
    });
  }

  undoRollTermTransaction(transactionId: string) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Bạn chắc chắn muốn hủy giao dịch ' + transactionId,
        title: 'Hủy giao dịch'
      },
    });
    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.transactionService.revertTransaction(transactionId).subscribe(result => {
          if (result.status === '200') {
            // this.getTransaction();
            // const message = 'Hủy giao dịch ' + transactionId + ' thành công';
            // this.alertService.alert({
            //   msgClass: 'cssInfo',
            //   message: message
            // });
            // this.getTransaction();
          }
        });
      }
    });
  }
}
