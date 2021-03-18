/** Angular Imports */
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { BanksService } from "app/banks/banks.service";
import { AddLimitIdentitiesExtraInfoComponent } from "app/clients/clients-view/identities-tab/dialog-add-limit-extra-info/dialog-add-limit-extra-info.component";
import { AlertService } from "app/core/alert/alert.service";
import { SettingsService } from "app/settings/settings.service";
import { AddFeeDialogComponent } from "../dialog/add-fee-dialog/add-fee-dialog.component";
import { CreateSuccessTransactionDialogComponent } from "../dialog/create-success-transaction-dialog/create-success-transaction-dialog.component";
import { TransactionService } from "../transaction.service";

/**
 * transaction Component.
 */
@Component({
  selector: "midas-create-transaction",
  templateUrl: "./create-transaction.component.html",
  styleUrls: ["./create-transaction.component.scss"],
})
export class CreateTransactionComponent implements OnInit {
  displayedColumns: string[] = ["no", "amountBooking", "txnDate", "action"];

  dataSource: MatTableDataSource<any>;
  transactionInfo: any = {};
  terminalFee: any = {};
  listRollTermBooking: any = [];
  isLoading = false;
  transactionCreateForm: FormGroup;
  totalBookingAmount: number;
  @ViewChild("listBookingRollTermTable") listBookingRollTermTable: MatTable<Element>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  /**
   * @param {AuthenticationService} authenticationService Authentication Service
   * @param {UserService} userService Users Service
   * @param {MatDialog} dialog Mat Dialog
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private bankService: BanksService
  ) {
    this.dataSource = new MatTableDataSource();
    this.transactionCreateForm = new FormGroup({
      requestAmount: new FormControl(),
      rate: new FormControl(),
      txnAmount: new FormControl(),
      terminalAmount: new FormControl(),
      batchNo: new FormControl(),
      traceNo: new FormControl(),
    });

  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params: any) => {
      const clientId = params.get("clientId");
      const identifierId = params.get("identifierId");
      const type = params.get("type");
      const remainValue = params.get("remainValue");
      const tranId = params.get("tranId");
      const bookingId = params.get("bookingId");
      this.isLoading = true;
      this.transactionService.getTransactionTemplate(clientId, identifierId, tranId).subscribe((data: any) => {
        this.isLoading = false;
        this.transactionInfo = data.result;
        this.transactionInfo.isDone = false;
        this.transactionInfo.productId = type == "cash" ? "CA01" : "AL01";
        this.transactionInfo.type = type;
        this.transactionInfo.identifierId = identifierId;
        this.transactionInfo.clientId = clientId;
        this.transactionInfo.bookingId = bookingId;
        this.transactionInfo.remainValue = this.formatCurrency(remainValue);
        if (this.transactionInfo.type == "cash") {
          this.transactionInfo.accountCash = data.result.listAccAccount[0].documentKey;
          this.transactionCreateForm = this.formBuilder.group({
            requestAmount: ["", Validators.required],
            rate: ["", Validators.required],
            txnAmount: ["", Validators.required],
            terminalAmount: ["", [Validators.required]],
            batchNo: ["", [Validators.required]],
            traceNo: ["", Validators.required],
          });
        } else {
          if (this.transactionInfo.type == "rollTerm") {
            this.transactionCreateForm = this.formBuilder.group({
              requestAmount: ["", Validators.required],
              rate: ["", Validators.required],
            });
          } else {
            this.transactionInfo.rate = this.transactionInfo.posTransaction.feePercentage;
            this.transactionInfo.refId = tranId;
            this.transactionCreateForm = this.formBuilder.group({
              requestAmount: ["", Validators.required],
              rate: [this.transactionInfo.rate, Validators.required],
              txnAmount: ["", Validators.required],
              terminalAmount: ["", [Validators.required]],
              batchNo: ["", [Validators.required]],
              traceNo: ["", Validators.required],
            });
          }
        }
      });
    });
  }

  clearInfoTransaction() {
    if (this.transactionInfo.txnAmount && this.transactionService.formatLong(this.transactionInfo.txnAmount) > 0) {
      setTimeout(() => {
        this.transactionCreateForm.controls["txnAmount"].reset();
        this.transactionCreateForm.controls["terminalAmount"].reset();
      }, 0);
    }

    this.transactionInfo.listTerminal = [];
    this.transactionInfo.txnAmount = "";
    this.transactionInfo.terminalAmount = "";
    this.transactionInfo.terminalId = "";
    this.transactionInfo.feeAmount = "";
    this.transactionInfo.txnAmountAfterFee = "";

    if (
      this.transactionInfo.requestAmount &&
      this.transactionService.formatLong(this.transactionInfo.requestAmount) > 0
    ) {
      if (this.transactionInfo.type === "cash" || this.transactionInfo.type === "rollTermGetCash") {
        this.getTerminalListEnoughBalance(this.transactionInfo.requestAmount);
      } else {
        if (this.transactionInfo.type === "rollTerm") {
          this.listRollTermBooking = [];
          this.dataSource.data = [];
          for (let index = 0; index < 4; index++) {
            let amountOnPerBooking = this.transactionService.formatLong(this.transactionInfo.requestAmount) * 0.25;
            let BookingRollTerm = {
              txnDate: new Date(),
              amountBooking: this.formatCurrency(String(amountOnPerBooking)),
            };
            this.listRollTermBooking.push(BookingRollTerm);
          }
        }
        this.dataSource.data = this.listRollTermBooking;
        this.totalBookingAmount = this.transactionInfo.requestAmount;
      }
    }
  }

  changeAmountTransaction(event: any) {
    this.transactionInfo.requestAmount = event.target.value;
    this.clearInfoTransaction();
  }

  getTerminalListEnoughBalance(amountTransaction: string) {
    const amount = this.transactionService.formatLong(amountTransaction);
    this.transactionService.getListTerminalAvailable(amount).subscribe((data: any) => {
      this.transactionInfo.listTerminal = data.result.listTerminal;
    });
  }

  calculateFeeTransaction() {
    if (
      this.transactionInfo.terminalAmount &&
      this.transactionInfo.terminalAmount !== 0 &&
      this.transactionInfo.rate &&
      this.transactionInfo.rate !== 0
    ) {
      this.transactionInfo.terminalAmount = this.transactionCreateForm.controls["terminalAmount"].value ;
      const amount_value = this.transactionInfo.terminalAmount;;
      const rate = this.transactionInfo.rate;
      this.transactionInfo.cogsRate = this.terminalFee.cogsRate;
      this.transactionInfo.feeAmount = (
        this.transactionService.formatLong(amount_value) *
        (Number(rate) / 100)
      ).toFixed(0);
      this.transactionInfo.feeGet = (this.transactionService.formatLong(amount_value) * (Number(rate) / 100)).toFixed(
        0
      );

      if (
        this.transactionInfo.productId === "CA01" &&
        this.transactionService.formatLong(this.transactionInfo.feeAmount) < this.terminalFee.minFeeDefault
      ) {
        this.transactionInfo.feeAmount = this.terminalFee.minFeeDefault;
        this.transactionInfo.feeGet = this.terminalFee.minFeeDefault;
      }
      this.transactionInfo.feeCogs = (
        (this.transactionService.formatLong(amount_value) * Number(this.transactionInfo.cogsRate)) /
        100
      ).toFixed(0);
      this.transactionInfo.feePNL =
        this.transactionService.formatLong(this.transactionInfo.feeAmount) -
        this.transactionService.formatLong(this.transactionInfo.feeCogs);
      this.transactionInfo.txnAmountAfterFee =
        this.transactionService.formatLong(amount_value) - this.transactionInfo.feeAmount;
    } else {
      if (
        this.transactionInfo.requestAmount &&
        this.transactionInfo.requestAmount !== 0 &&
        this.transactionInfo.rate &&
        this.transactionInfo.rate !== 0 &&
        this.transactionInfo.type !== "cash"
      ) {
        const amount_value = this.transactionInfo.requestAmount;
        const rate = this.transactionInfo.rate;
        this.transactionInfo.feeAmount = (
          this.transactionService.formatLong(amount_value) *
          (Number(rate) / 100)
        ).toFixed(0);
      }
    }
  }

  mappingBillForTransaction() {

    this.transactionService
      .mappingInvoiceWithTransaction(
        this.transactionInfo.identifyClientDto.accountTypeId,
        this.transactionInfo.identifyClientDto.accountNumber,
        this.transactionInfo.identifierId,
        this.transactionInfo.requestAmount,
        this.transactionInfo.terminalId
      )
      .subscribe((data: any) => {
        if (data.status != 200) {
          if (data.statusCode == 401) {
            if (data.error == "Unauthorize with Midas") {
              this.alertService.alert({
                message: "Phiên làm việc hết hạn vui lòng đăng nhập lại để tiếp tục",
                msgClass: "cssDanger",
                hPosition: "center",
              });
            }
          }

          if (data.statusCode == 666) {
            if (typeof data.error !== "undefined" && data.error !== "") {
              this.alertService.alert({
                message: `Chú Ý: Giao dịch không vượt hạn mức : ${this.formatCurrency(data.error)} VNĐ`,
                msgClass: "cssDanger",
                hPosition: "center",
              });
            }
          } else {
            this.alertService.alert({
              message: `Lỗi xảy ra : Vui lòng liên hệ ITSupport. ERROR: ${data}`,
              msgClass: "cssDanger",
              hPosition: "center",
            });
          }
          return;
        }
        if (typeof data.result.caution != "undefined" && data.result.caution != "NaN") {
          this.alertService.alert({ message: data.result.caution, msgClass: "cssDanger", hPosition: "center" });
        }
        this.transactionInfo.invoiceMapping = data.result;
        this.transactionInfo.txnAmount = this.formatCurrency(data.result.amountTransaction);
        this.transactionInfo.terminalAmount = this.formatCurrency(data.result.amountTransaction);
        this.transactionCreateForm.controls["terminalAmount"].setValue(this.transactionInfo.terminalAmount);
        this.transactionCreateForm.controls["txnAmount"].setValue(this.transactionInfo.txnAmount);
        this.calculateFeeTransaction();
      });
  }
  onchangeRate(event: any) {
    this.transactionInfo.rate = event.target.value;
    this.CheckValidRate();
  }
  CheckValidRate() {
    if (this.transactionInfo.rate == null || String(this.transactionInfo.rate).length === 0) {
      return;
    }
    if (
      parseFloat(this.transactionInfo.rate) < parseFloat(this.terminalFee.minRate) ||
      parseFloat(this.transactionInfo.rate) > parseFloat(this.terminalFee.maxRate)
    ) {
      this.transactionInfo.rate = this.terminalFee.maxRate;
      this.calculateFeeTransaction();
      this.alertService.alert({
        message: `Tỉ lệ phí không được thấp hơn ${this.terminalFee.maxRate} và cao hơn ${this.terminalFee.minRate} !`,
        msgClass: "cssDanger",
        hPosition: "center",
      });
    } else {
      this.calculateFeeTransaction();
    }
  }

  getFeeByTerminal(): any {
    this.transactionService
      .getFeeByTerminal(this.transactionInfo.identifyClientDto.accountTypeId, this.transactionInfo.terminalId)
      .subscribe((data: any) => {
        this.terminalFee = data.result.feeTerminalDto;
        this.CheckValidRate();
        // call mapping bill for this transaction
        this.mappingBillForTransaction();
      });
  }

  afterSuccessCreateCashTransaction(data: any) {
    this.transactionInfo.transactionId = data.result.id;
    this.transactionInfo.transactionRefNo = data.result.tranRefNo;
    this.transactionInfo.isDone = true;
    this.alertService.alert({
      message: `Tạo giao dịch ${this.transactionInfo.transactionRefNo} thành công!`,
      msgClass: "cssSuccess",
      hPosition: "center",
    });
    this.showSuccessCreateTransactionDialog();
  }

  submitTransactionCash() {
    if (this.transactionCreateForm.invalid) {
      return;
    }

    this.transactionInfo.batchNo = this.transactionCreateForm.value.batchNo;
    this.transactionInfo.traceNo = this.transactionCreateForm.value.traceNo;
    this.transactionInfo.terminalAmount = this.transactionCreateForm.value.terminalAmount;
    if (this.transactionInfo.type == "cash") {
      this.transactionService.submitTransactionCash(this.transactionInfo).subscribe((data: any) => {
        this.afterSuccessCreateCashTransaction(data);
      });
    } else {
      if (this.transactionInfo.type == "rollTermGetCash") {

        this.transactionService
          .submitTransactionCashFromRollTermTransaction(this.transactionInfo)
          .subscribe((data: any) => {
            this.afterSuccessCreateCashTransaction(data);
          });
      }
    }
  }

  addIdentifierExtraInfo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: "Thông tin bổ sung cho thẻ",
      clientIdentifierTemplate: this.transactionInfo.cardExtraInfo,
    };
    dialogConfig.minWidth = 400;
    const addIdentifierDialogRef = this.dialog.open(AddLimitIdentitiesExtraInfoComponent, dialogConfig);
    addIdentifierDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const { limitCard, classCard } = response.data.value;
        const expiredDateString = this.datePipe.transform(this.transactionInfo.cardExtraInfo.expiredDate, "MMyy");

        this.transactionService
          .updateCardTrackingState({
            refId: this.transactionInfo.cardExtraInfo.refid,
            limitCard: limitCard,
            classCard: classCard,
            expiredDateString: expiredDateString,
            dueDay: this.transactionInfo.cardExtraInfo.dueDay,
            isHold: this.transactionInfo.cardExtraInfo.isHold,
          })
          .subscribe((res2: any) => {
            if (res2.result.status) {
              this.transactionInfo.cardExtraInfo.limit = limitCard;
              this.transactionInfo.cardExtraInfo.classCard = classCard;

              this.submitTransactionRollTerm();
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

  submitTransactionRollTerm() {
    if (!this.transactionInfo.cardExtraInfo.limit || !this.transactionInfo.cardExtraInfo.classCard) {
      this.addIdentifierExtraInfo();
      return;
    }

    if (this.transactionCreateForm.invalid) {
      return;
    }
    this.listRollTermBooking.forEach((booking: any) => {
      booking.amountBooking = this.transactionService.formatLong(booking.amountBooking);
      booking.txnDate = this.datePipe.transform(booking.txnDate, "dd/MM/yyyy");
    });
    var listBookingRollTerm = JSON.stringify(this.listRollTermBooking, function (key, value) {
      if (key === "$$hashKey") {
        return undefined;
      }
      return value;
    });
    this.transactionInfo.BookingInternalDtoListString = listBookingRollTerm;
    this.transactionService.submitTransactionRollTerm(this.transactionInfo).subscribe((data: any) => {
      this.listRollTermBooking = [];
      this.transactionInfo.transactionRefNo = data.result.tranRefNo;
      this.transactionInfo.transactionId = data.result.id;
      // this.transactionInfo.isDone = true;

      this.alertService.alert({
        message: `Tạo giao dịch ${this.transactionInfo.transactionRefNo} thành công!`,
        msgClass: "cssSuccess",
        hPosition: "center",
      });
      setTimeout(() => {
        this.router.navigate(["/transaction/rollTermSchedule"]);
      }, 2000); //5s
    });
  }

  calculateTotalBookingAmount() {
    let totalBookingAmountTmp = 0;
    let lastBookingAmountExceptLast = 0;
    let index = 0;
    this.listRollTermBooking.forEach((booking: any) => {
      if (index < this.listRollTermBooking.length - 1) {
        lastBookingAmountExceptLast += this.transactionService.formatLong(booking.amountBooking);
        index++;
      }
    });

    this.listRollTermBooking[this.listRollTermBooking.length - 1].amountBooking = this.formatCurrency(
      String(this.transactionService.formatLong(this.transactionInfo.requestAmount) - lastBookingAmountExceptLast)
    );
    this.listRollTermBooking.forEach((booking: any) => {
      totalBookingAmountTmp += this.transactionService.formatLong(booking.amountBooking);
    });

    this.totalBookingAmount = totalBookingAmountTmp;
    this.listBookingRollTermTable.renderRows();
  }

  addBookingRow = function () {
    let BookingRollTerm = {
      txnDate: new Date(),
      amountBooking: 0,
    };
    this.listRollTermBooking.push(BookingRollTerm);
    this.calculateTotalBookingAmount();
  };

  removeBookingRow(index: string) {
    this.listRollTermBooking.forEach((rollTerm: any) => {
      let indexMember = this.listRollTermBooking.findIndex((elementIdex: any) => elementIdex === rollTerm);

      if (indexMember == index) {
        this.listRollTermBooking.splice(
          this.listRollTermBooking.findIndex((item: any) => item == rollTerm),
          1
        );
      }
    });
    this.calculateTotalBookingAmount();
  }

  validateCashTransaction(): boolean {
    return true;
  }

  showSuccessCreateTransactionDialog() {
    const data = {
      trnRefNo: this.transactionInfo.transactionRefNo,
      transactionId: this.transactionInfo.transactionId,
      panNumber: this.transactionInfo.identifyClientDto.accountNumber,
      clientName: this.transactionInfo.clientDto.displayName,
      clientId: this.transactionInfo.clientId,
      identifierId: this.transactionInfo.identifierId,
    };
    const dialog = this.dialog.open(CreateSuccessTransactionDialogComponent, {
      height: "80%",
      width: "auto",
      disableClose: true,
      data,
    });
    dialog.afterClosed().subscribe((response: any) => {
      this.ngOnInit();
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
}
