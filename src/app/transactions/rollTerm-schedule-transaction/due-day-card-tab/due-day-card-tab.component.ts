import { animate, state, style, transition, trigger } from "@angular/animations";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { CentersService } from "app/centers/centers.service";
import { AddLimitIdentitiesExtraInfoComponent } from "app/clients/clients-view/identities-tab/dialog-add-limit-extra-info/dialog-add-limit-extra-info.component";
import { AlertService } from "app/core/alert/alert.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { SavingsService } from "app/savings/savings.service";
import { SettingsService } from "app/settings/settings.service";
import { TransactionService } from "app/transactions/transaction.service";
import { BanksService } from "../../../banks/banks.service";
import { AdvanceFeeRollTermComponent } from "../dialog/advance-fee-roll-term/advance-fee-roll-term.component";
import { CreateRollTermScheduleDialogComponent } from "../dialog/create-roll-term-schedule/create-roll-term-schedule-dialog.component";
import { TransactionHistoryDialogComponent } from "../dialog/transaction-history/transaction-history-dialog.component";
import { map, startWith, tap } from "rxjs/operators";

@Component({
  selector: "midas-due-day-card-transaction",
  templateUrl: "./due-day-card-tab.component.html",
  styleUrls: ["./due-day-card-tab.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class DueDayCardTabComponent implements OnInit {
  expandedElement: any;
  displayedColumns: string[] = [
    "panHolderName",
    "phone",
    "cardNumber",
    "dueDay",
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
  minDate: any;
  staffs: any[];
  offices: any[];
  noteOption: any[] = [];
  statusOption: any[] = [];
  cardTypeOption: any[] = [];
  cardHoldOption: any[] = [];
  totalTerminalAmount = 0;
  totalFeeAmount = 0;
  totalCogsAmount = 0;
  totalPnlAmount = 0;
  panelOpenState = false;
  filterData: any[];
  filteredBankOptions: any;
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
    private centersService: CentersService,
    public dialog: MatDialog
  ) {
    this.minDate = new Date();
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date(new Date().setMonth(new Date().getMonth() + 1))],
    });
    this.cardHoldOption = [
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

    this.formFilter = this.formBuilder.group({
      OfficeFilter: [""],
      staffFilter: ["ALL"],
      cardHoldFilter: ["ALL"],
      bankName: [undefined],
      cardType: ["ALL"],
      statusFilter: ["ALL"],
      stageFilter: ["ALL"],
      query: [""],
      viewDoneTransaction: [false],
    });
  }

  displayBank(bank: any): string | undefined {
    return bank?.bankName;

  }
  private _filter(value: any): string[] {
    const filterValue =  value?.toString()?.toLowerCase();

    return this.listBank?.filter(option => option?.bankName?.toLowerCase()?.includes(filterValue));
  }

  resetAutoCompleteBank() {
    this.filteredBankOptions = this.listBank;
    this.formFilter?.controls?.bankFilter?.setValue("");
     this.filteredBankOptions = this.formFilter.get('bankName').valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filter(value))
     );
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    this.getRollTermScheduleAndCardDueDayInfo();
    this.listBank = [];
    this.bankService.getBanks().subscribe((data: any) => {
      if (data) {
        this.listBank = data;
        this.filteredBankOptions = this.formFilter.get('bankName').valueChanges.pipe(
          startWith(""),
          map((value: any) => this._filter(value)),
      );
      }
    });

    this.bankService.getListOfficeCommon().subscribe((offices: any) => {
      this.offices = offices.result.listOffice;
      this.offices?.unshift({
        id: "",
        name: "Tất cả",
      });

      this.formFilter.get("OfficeFilter").valueChanges.subscribe((value) => {
        this.centersService.getStaff(value).subscribe((staffs: any) => {
          this.staffs = staffs?.staffOptions.filter((staff: any) => staff.displayName.startsWith("R"));
          this.staffs?.unshift({
            id: "ALL",
            displayName: "Tất cả",
          });
        });
      });
    });

    this.transactionService.getCardDueDayTemplate().subscribe((data: any) => {
      if (data) {
        this.noteOption = data.result.listLeadStatus;
        this.statusOption = data.result.listSaleStage;
        this.cardTypeOption = data.result.listCard;
        this.noteOption?.unshift({
          refid: "ALL",
          value: "Tất cả",
        });
        this.statusOption?.unshift({
          refid: "ALL",
          value: "Tất cả",
        });
      }
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
        .advanceCashTransaction({
          buSavingAccount: buSavingAccount,
          clientSavingAccount: clientAdvanceCash,
          noteAdvance: noteAdvance,
          amountAdvanceCash: amountAdvance,
          typeAdvanceCash: typeAdvanceCash,
        })
        .subscribe((result: any) => {
          const message = `Ứng tiền thành công cho tài khoản: ${clientAdvanceCash} với số tiền ${
            String(amountAdvance).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") + " đ"
          }`;
          this.savingsService.handleResponseApiSavingTransaction(result, message, false);
          this.getRollTermScheduleAndCardDueDayInfo();

        });
    });
  }

  showCreateRollTermScheduleDialog(card: any) {
    const data = {
      clientId: card.clientId,
      panHolderName: card.clientName,
      panNumber: card.cardNumber,
      identifierId: card.cardId,
    };
    const dialog = this.dialog.open(CreateRollTermScheduleDialogComponent, { height: "auto", width: "80%", data });
    dialog.afterClosed().subscribe((response: any) => {
      const { rollTermBooking, requestAmount, feeRate } = response?.data?.value;
      if (!card.limit || !card.cardClass) {
        this.addIdentifierExtraInfo(card, rollTermBooking, requestAmount, feeRate);
        return;
      } else {
        this.submitTransactionRollTerm(card, rollTermBooking, requestAmount, feeRate);
        return;
      }
    });
  }

  submitTransactionRollTerm(card: any, rollTermBooking: any, requestAmount: any, feeRate: any) {
    let info: any = {};
    rollTermBooking.forEach((booking: any) => {
      booking.amountBooking = booking.amountBooking;
      booking.txnDate = this.datePipe.transform(booking.txnDate, "dd/MM/yyyy");
    });
    const listBookingRollTerm = JSON.stringify(rollTermBooking, function (key: string, value: string) {
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
    info.groupId = card.groupId ? card.groupId : "0";
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

      this.getRollTermScheduleAndCardDueDayInfo();
    });
  }

  addIdentifierExtraInfo(card: any, rollTermBooking: any, requestAmount: any, feeRate: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: "Thông tin bổ sung cho thẻ",
      clientIdentifierTemplate: card,
    };
    dialogConfig.minWidth = 400;
    const addIdentifierDialogRef = this.dialog.open(AddLimitIdentitiesExtraInfoComponent, dialogConfig);
    addIdentifierDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const { limitCard, classCard } = response.data.value;
        const expiredDateString = this.datePipe.transform(card.expiredDate, "MMyy");

        this.transactionService
          .updateCardTrackingState({
            refId: card.refId,
            limitCard: limitCard,
            classCard: classCard,
            expiredDateString: expiredDateString,
            dueDay: card.dueDay,
            isHold: card.isHold,
          })
          .subscribe((res2: any) => {
            if (res2.result.status) {
              card.limit = limitCard;
              card.classCard = classCard;

              this.submitTransactionRollTerm(card, rollTermBooking, requestAmount, feeRate);
            } else {
              this.alertService.alert({
                message: res2.result.message ? res2.result.message : "Lỗi thêm thông tin hạn mức, hạng thẻ!",
                msgClass: "cssError",
                hPosition: "center",
              });
              return;
            }
          });
      }
    });
  }

  displayCardStatusId(type: string) {
    return this.statusOption.find((v) => v.value === type)?.label || "N/A";
  }

  getRollTermScheduleAndCardDueDayInfo() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    const stageFilter = this.formFilter.get("stageFilter").value;
    const statusFilter = this.formFilter.get("statusFilter").value;
    const staffFilter = this.formFilter.get("staffFilter").value;
    const cardHoldFilter = this.formFilter.get("cardHoldFilter").value;
    const bankName = this.formFilter.get("bankName").value;
    if(bankName && !bankName.bankCode) {
      this.alertService.alert({
        type: "🚨🚨🚨🚨 Lỗi ",
        msgClass: "cssDanger",
        message: 'Vui Lòng chọn lại ngân hàng trước!',
      });
      return;
    };
    const cardType = this.formFilter.get("cardType").value;
    const query = this.formFilter.get("query").value;
    const limit = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const offset = this.paginator.pageIndex * limit;
    const viewDoneTransaction = this.formFilter.get("viewDoneTransaction").value;

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
        stageFilter,
        statusFilter,
        staffFilter,
        cardHoldFilter,
        bankName,
        cardType,
        query,
        viewDoneTransaction,
      })
      .subscribe((result) => {
        this.isLoading = false;
        this.transactionsData = result?.result;
        this.dataSource = result?.result.lisCardTransactionTracking;
        this.dataSource.forEach((item) => {
          item.expiredDateString = this.datePipe.transform(item.expiredDate, "MMyy");
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

  updateCardTrackingState(index: number) {
    let updateData = this.dataSource[index];

    let fromDate = this.formDate.get("fromDate").value;
    updateData.month = this.datePipe.transform(fromDate, "MM");
    updateData.year = this.datePipe.transform(fromDate, "yyyy");

    this.isLoading = true;
    this.transactionService.updateCardTrackingState(updateData).subscribe((result) => {
      this.isLoading = false;
      const message = `Cập nhật thành công cho thẻ: ${updateData.cardNumber} `;
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
