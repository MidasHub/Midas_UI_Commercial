import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { DatePipe } from "@angular/common";
import { MatSort } from "@angular/material/sort";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TransactionService } from "app/transactions/transaction.service";
import { SettingsService } from "app/settings/settings.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { CentersService } from "app/centers/centers.service";
import { AlertService } from "app/core/alert/alert.service";
import { RollTermScheduleDialogComponent } from "../dialog/roll-term-schedule/roll-term-schedule-dialog.component";
import { CreateRollTermScheduleDialogComponent } from "../dialog/create-roll-term-schedule/create-roll-term-schedule-dialog.component";
import { MatTableDataSource } from "@angular/material/table";
import { AdvanceFeeRollTermComponent } from "../dialog/advance-fee-roll-term/advance-fee-roll-term.component";
import { SavingsService } from "app/savings/savings.service";
import { TransactionHistoryDialogComponent } from "../dialog/transaction-history/transaction-history-dialog.component";
import {BanksService} from '../../../banks/banks.service';

@Component({
  selector: "midas-on-roll-term-card-tab",
  templateUrl: "./on-roll-term-card-tab.component.html",
  styleUrls: ["./on-roll-term-card-tab.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class OnRollTermCardTabComponent implements OnInit {
  expandedElement: any;
  displayedColumns: string[] = [
    "panHolderName",
    "phone",
    "cardNumber",
    "bankName",
    "dueDay",
    "expiredDate",
    "isHold",
    "status",
    "note",
    "actions",
  ];
  isLoading: boolean = false;
  formDate: FormGroup;
  formFilter: FormGroup;
  dataSource: any[];
  listBank: any[];
  transactionsData: any;
  currentUser: any;

  statusOption: any[] = [
    {
      label: "Khởi tạo",
      value: "A",
    },
    {
      label: "Chờ phí",
      value: "P",
    },
    {
      label: "Đã nhận phí",
      value: "C",
    },
    {
      label: "Từ chối",
      value: "R",
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
    private savingsService: SavingsService,
    private bankService: BanksService,
    private transactionService: TransactionService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {
    this.formDate = this.formBuilder.group({
      fromDate: [new Date(new Date().setMonth(new Date().getMonth() - 1))],
      toDate: [new Date()],
    });
    this.formFilter = this.formBuilder.group({
      bankName: [""],
      query: [""],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    // this.dataSource = this.transactionsData;
    this.getOnCardDueDayInfo();
    this.bankService.getListBank().subscribe((data: any) => {
      this.listBank = data.result.listBank;
      this.listBank.unshift({ bankCode: "", bankName: "Tất cả ngân hàng" });
    });
  }

  advanceCash(cardId: string, clientId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: "Ứng tiền cho khách hàng",
      currentUser: this.currentUser,
      clientId: clientId,
    };
    dialogConfig.minWidth = 400;
    const refDialog = this.dialog.open(AdvanceFeeRollTermComponent, dialogConfig);
    refDialog.afterClosed().subscribe((response: any) => {
      const { buSavingAccount, clientAdvanceCash, noteAdvance, amountAdvance, typeAdvanceCash } = response?.data?.value;
      this.savingsService
        .advanceCashForDueDayCardTransaction({
          cardId: cardId,
          buSavingAccount: buSavingAccount,
          clientSavingAccount: clientAdvanceCash,
          noteAdvance: noteAdvance,
          amountAdvanceCash: amountAdvance,
          typeAdvanceCash: typeAdvanceCash,
        })
        .subscribe((result: any) => {
          console.log(result);
          const message = `Ứng tiền thành công cho tài khoản: ${clientAdvanceCash} với số tiền ${
            String(amountAdvance).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") + " đ"
          }`;
          this.alertService.alert({ message: message, msgClass: "cssInfo" });
          this.getOnCardDueDayInfo();
        });
    });
  }

  displayCardStatusId(type: string) {
    return this.statusOption.find((v) => v.value === type)?.label || "N/A";
  }

  getOnCardDueDayInfo() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    let statusFilter = "C";
    let bankName = this.formFilter.get("bankName").value;
    let query = this.formFilter.get("query").value;
    const limit = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const offset = this.paginator.pageIndex * limit;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.dataSource = [];
    this.isLoading = true;
    this.transactionService
      .getListCardOnDueDayByUserId({
        fromDate,
        toDate,
        limit,
        offset,
        statusFilter,
        bankName,
        query,
      })
      .subscribe((result) => {
        this.isLoading = false;
        this.transactionsData = result?.result;
        this.dataSource = result?.result.lisCardTransactionTracking;
        this.dataSource.forEach((element) => {
          element.expiredDateString = this.datePipe.transform(element.expiredDate, "MMyy");
        });
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

  showCreateRollTermScheduleDialog(card: any) {
    let info: any = {};
    const data = {
      clientId: card.clientId,
      panHolderName: card.clientName,
      panNumber: card.cardNumber,
      identifierId: card.cardId,
    };
    const dialog = this.dialog.open(CreateRollTermScheduleDialogComponent, { height: "auto", width: "80%", data });
    dialog.afterClosed().subscribe((response: any) => {

      const { rollTermBooking, requestAmount, feeRate } = response?.data?.value;
      rollTermBooking.forEach((booking: any) => {
        booking.amountBooking = booking.amountBooking;
        booking.txnDate = this.datePipe.transform(booking.txnDate, "dd/MM/yyyy");
      });
      var listBookingRollTerm = JSON.stringify(rollTermBooking, function (key, value) {
        if (key === "$$hashKey") {
          return undefined;
        }
        return value;
      });

      // prepare value for create schedule roll term transaction
      info.type = "rollTerm";
      info.productId = "AL01";
      info.rate = feeRate;
      info.requestAmount = requestAmount;
      info.BookingInternalDtoListString = listBookingRollTerm;
      info.clientName = card.clientName;
      info.panNumber = card.cardNumber;
      info.identifierId = card.cardId;
      info.groupId = card.groupId ? card.groupId:'0';
      info.cardType = card.cardType;
      info.bankCode = card.bankCode;
      info.bookingId = card.bookingId;
      info.clientId = card.clientId;

      this.isLoading = true;
      this.transactionService.submitTransactionRollTermOnDialog(info).subscribe((data: any) => {
        this.isLoading = false;
        let transactionRefNo = data.result.tranRefNo;
        this.alertService.alert({
          message: `Tạo giao dịch ${transactionRefNo} thành công!`,
          msgClass: "cssSuccess",
          hPosition: "center",
        });

        this.getOnCardDueDayInfo();
      });
    });
  }

  updateCardTrackingState(index: number) {
    let updateData = this.dataSource[index];
    this.isLoading = true;
    this.transactionService.updateCardTrackingState(updateData).subscribe((result) => {
      this.isLoading = false;
      const message = `Cập nhật thành công cho thẻ: ${updateData.cardNumber} `;
      // this.alertService.alertMsgTop({alertMsg: message});
      this.alertService.alert({ message: message, msgClass: "cssInfo" });
    });
  }

  showHistoryTransaction(clientId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      clientId: clientId,
    };
    dialogConfig.minWidth = 800;
    this.dialog.open(TransactionHistoryDialogComponent, dialogConfig);
  }
}
