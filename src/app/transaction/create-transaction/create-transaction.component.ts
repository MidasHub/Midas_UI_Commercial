/** Angular Imports */
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "app/core/alert/alert.service";
import { SettingsService } from "app/settings/settings.service";
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
  ErrorValidate: any = {};
  listRollTermBooking: any = [];
  isLoading = false;
  registerForm: FormGroup;
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
    private formBuilder: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params: any) => {
      const clientId = params.get("clientId");
      const identifierId = params.get("identifierId");
      const type = params.get("type");
      this.isLoading = true;
      this.transactionService.getTransactionTemplate(clientId, identifierId).subscribe((data: any) => {
        this.isLoading = false;
        this.transactionInfo = data.result;
        this.transactionInfo.isDone = false;
        this.transactionInfo.productId = type == "cash" ? "CA01" : "AL01";
        this.transactionInfo.type = type;
        this.transactionInfo.identifierId = identifierId;
        this.transactionInfo.clientId = clientId;
        this.transactionInfo.accountCash = data.result.listAccAccount[0].documentKey;

        this.registerForm = this.formBuilder.group({
          requestAmount: ['', Validators.required],
          // firstName: ['', Validators.required],
          // lastName: ['', Validators.required],
          // email: ['', [Validators.required, Validators.email]],
          // password: ['', [Validators.required, Validators.minLength(6)]],
          // confirmPassword: ['', Validators.required],
          // acceptTerms: [false, Validators.requiredTrue]
      }, {
          // validator: MustMatch('password', 'confirmPassword')
      });

      });
    });
  }

  clearInfoTransaction() {
    const dateFormat = this.settingsService.dateFormat;
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
      if (this.transactionInfo.type === "cash") {
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
        this.calculateTotalBookingAmount();
      }
    }
  }

  changeAmountTransaction() {
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
      debugger;
      const amount_value = this.transactionInfo.terminalAmount;
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
    this.transactionInfo.identifyClientDto.identifyId = "249";
    this.transactionService
      .mappingInvoiceWithTransaction(
        this.transactionInfo.identifyClientDto.accountTypeId,
        this.transactionInfo.identifyClientDto.accountNumber,
        this.transactionInfo.identifyClientDto.identifyId,
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
        this.calculateFeeTransaction();
      });
  }

  onchangeRateAndCheckValidRate() {
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
        this.onchangeRateAndCheckValidRate();
        // call mapping bill for this transaction
        this.mappingBillForTransaction();
      });
  }

  downloadVoucherTransaction() {
    this.transactionService.downloadVoucher(this.transactionInfo.transactionId);
  }

  submitTransactionCash() {
    if (this.registerForm.invalid) {
      return;
    }
    if (this.validateCashTransaction()) {
      this.transactionService.submitTransactionCash(this.transactionInfo).subscribe((data: any) => {
        this.transactionInfo.transactionId = data.result.id;
        this.transactionInfo.transactionRefNo = data.result.tranRefNo;
        this.transactionInfo.isDone = true;
        this.alertService.alert({
          message: `Tạo giao dịch ${this.transactionInfo.transactionRefNo} thành công!`,
          msgClass: "cssSuccess",
          hPosition: "center",
        });
        this.transactionInfo.requestAmount = "";
        this.transactionInfo.batchNo = "";
        this.transactionInfo.traceNo = "";
        this.clearInfoTransaction();
      });
    }
  }

  submitTransactionRollTerm() {
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
      this.alertService.alert({
        message: `Tạo giao dịch ${this.transactionInfo.transactionRefNo} thành công!`,
        msgClass: "cssSuccess",
        hPosition: "center",
      });
      setTimeout(() => {
        this.router.navigate(["/home"]);
      }, 5000); //5s
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
    debugger;
    if (!this.transactionInfo.requestAmount || this.transactionInfo.requestAmount == 0) {
      this.ErrorValidate.requestAmountError = true;
      return false;
    } else {
      this.ErrorValidate.requestAmountError = false;
    }

    if (!this.transactionInfo.listAccAccount || this.transactionInfo.listAccAccount.length == 0) {
      this.ErrorValidate.requestAccAccountError = true;
      return false;
    } else {
      this.ErrorValidate.requestAccAccountError = false;
    }

    if (!this.transactionInfo.rate || this.transactionInfo.rate == 0) {
      this.ErrorValidate.requestRateError = true;
      return false;
    } else {
      this.ErrorValidate.requestRateError = false;
    }

    if (!this.transactionInfo.txnAmount || this.transactionInfo.txnAmount == 0) {
      this.ErrorValidate.requestTxnAmountError = true;
      return false;
    } else {
      this.ErrorValidate.requestTxnAmountError = false;
    }

    if (!this.transactionInfo.terminalAmount || this.transactionInfo.terminalAmount == 0) {
      this.ErrorValidate.requestTerminalAmountError = true;
      return false;
    } else {
      this.ErrorValidate.requestTerminalAmountError = false;
    }

    if (!this.transactionInfo.batchNo) {
      this.ErrorValidate.requestBatchNoError = true;
      return false;
    } else {
      this.ErrorValidate.requestBatchNoError = false;
    }

    if (!this.transactionInfo.traceNo) {
      this.ErrorValidate.requestTraceNoError = true;
      return false;
    } else {
      this.ErrorValidate.requestTraceNoError = false;
    }

    return true;
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
