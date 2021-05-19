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
import { ClientsService } from "app/clients/clients.service";
import { AlertService } from "app/core/alert/alert.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { SavingsService } from "app/savings/savings.service";
import { SettingsService } from "app/settings/settings.service";
import { TerminalsService } from "app/terminals/terminals.service";
import { ThirdPartyService } from "app/third-party/third-party.service";
import { AddFeeDialogComponent } from "../dialog/add-fee-dialog/add-fee-dialog.component";
import { ConfirmDialogComponent } from "../dialog/confirm-dialog/confirm-dialog.component";
import { CreateSuccessTransactionDialogComponent } from "../dialog/create-success-transaction-dialog/create-success-transaction-dialog.component";
import { ValidCheckTransactionHistoryDialogComponent } from "../dialog/valid-check-transaction-history/valid-check-transaction-history-dialog.component";
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
  activateAndApproveAccountForm: FormGroup;
  totalBookingAmount: number;
  currentUser: any;
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
    private formBuilder: FormBuilder,
    private terminalsService: TerminalsService,
    private settingsService: SettingsService,
    private savingsService: SavingsService,
    private clientsService: ClientsService,
    private authenticationService: AuthenticationService
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
    this.currentUser = this.authenticationService.getCredentials();
    const { permissions } = this.currentUser;
    const permit_manager = permissions.includes("POS_UPDATE");

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

        this.transactionCreateForm = this.formBuilder.group({
          requestAmount: ["", Validators.required],
          rate: ["", Validators.required],
          txnAmount: ["", Validators.required],
          terminalAmount: ["", Validators.required],
          batchNo: ["", Validators.required],
          traceNo: ["", Validators.required],
        });

        if (this.transactionInfo.type == "cash") {
          this.transactionInfo.accountCash = data.result.listAccAccount[0].documentKey;
        } else {
          if (this.transactionInfo.type == "rollTerm") {
            this.transactionCreateForm = this.formBuilder.group({
              requestAmount: ["", Validators.required],
              rate: ["", Validators.required],
            });
          } else {
            this.transactionInfo.rate = this.transactionInfo.posTransaction.feePercentage;
            this.transactionInfo.refId = tranId;
            this.transactionCreateForm.get("rate").setValue(this.transactionInfo.rate);
          }
        }

        if (this.transactionCreateForm.get("batchNo") && this.transactionCreateForm.get("traceNo")) {
          if (permit_manager) {
            // remove validator required for batchNo, traceNo on hold transaction
            this.transactionCreateForm.get("batchNo").clearValidators();
            this.transactionCreateForm.get("batchNo").updateValueAndValidity();
            this.transactionCreateForm.get("traceNo").clearValidators();
            this.transactionCreateForm.get("traceNo").updateValueAndValidity();
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
    this.terminalsService.getListTerminalAvailable(amount, "LE").subscribe((data: any) => {
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
      this.transactionInfo.terminalAmount = this.transactionCreateForm.controls["terminalAmount"].value;
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
                message: `${data.error}`,
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
        if (
          typeof data.result.caution != "undefined" &&
          data.result.caution != "NaN" &&
          data.result.amountTransaction > 0
        ) {
          this.showHistoryTransaction(data.result.caution, data.result.listTransaction);
        }
        this.transactionInfo.invoiceMapping = data.result;
        if (data.result.amountTransaction > 0) {
          this.transactionInfo.txnAmount = this.formatCurrency(data.result.amountTransaction);
          this.transactionInfo.terminalAmount = this.formatCurrency(data.result.amountTransaction);
          this.transactionCreateForm.controls["terminalAmount"].setValue(this.transactionInfo.terminalAmount);
          this.transactionCreateForm.controls["txnAmount"].setValue(this.transactionInfo.txnAmount);
          this.calculateFeeTransaction();
        } else {
          this.alertService.alert({
            message: `Lỗi truy xuất số tiền đề xuất giao dịch, vui lòng liên hệ IT support! `,
            msgClass: "cssDanger",
            hPosition: "center",
          });

          return;
        }
      });
  }

  showHistoryTransaction(message: string, listTransaction: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      listTransaction: listTransaction,
      message: message,
    };
    dialogConfig.minWidth = 400;
    dialogConfig.maxWidth = 800;

    this.dialog.open(ValidCheckTransactionHistoryDialogComponent, dialogConfig);
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
      this.transactionCreateForm.get("rate").setValue(this.terminalFee.maxRate);
      this.calculateFeeTransaction();
      this.alertService.alert({
        message: `Tỉ lệ phí không được thấp hơn ${this.terminalFee.minRate} và cao hơn ${this.terminalFee.maxRate} !`,
        msgClass: "cssDanger",
        hPosition: "center",
      });
    } else {
      this.calculateFeeTransaction();
    }
  }

  getFeeByTerminal(): any {
    this.terminalsService
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
    let numOfTransaction = data.result.numTransaction;

    this.transactionInfo.isDone = true;
    this.alertService.alert({
      message: `Tạo giao dịch ${this.transactionInfo.transactionRefNo} thành công!`,
      msgClass: "cssSuccess",
      hPosition: "center",
    });
    this.showSuccessCreateTransactionDialog();

    if (numOfTransaction == 1) {
      let savingAccountId: string = null;
      this.clientsService.getClientAccountDataCross(this.transactionInfo.clientId).subscribe((savings) => {
        let ListAccount = savings?.result?.clientAccount?.savingsAccounts;
        let isHaveActiveSavingsAccount = true;
        if (!ListAccount || ListAccount.length == 0) {
          isHaveActiveSavingsAccount = false;
        } else {
          for (let index = 0; index < ListAccount.length; index++) {
            if (ListAccount[index].status.id == 300) {
              savingAccountId = ListAccount[index].id;
              isHaveActiveSavingsAccount = true;
            }
          }
          if (!savingAccountId) {
            isHaveActiveSavingsAccount = false;
          }
        }

        if (!isHaveActiveSavingsAccount) {
          this.createClientSavingAccountTemplate(
            this.transactionInfo.clientId,
            "2",
            this.transactionInfo.clientDto.displayName
          );
        } else {
          this.savingsService
            .makeFunForMarketing(savingAccountId, this.transactionInfo.clientDto.displayName)
            .subscribe((res: any) => {
              const message = `Áp dụng khuyến mãi từ chương trình marketing thành công cho khách hàng ${this.transactionInfo.clientDto.displayName}!`;
              this.savingsService.handleResponseApiSavingTransaction(res, message, false);
            });
        }
      });
    } else {
      if (numOfTransaction == 2) {
        this.alertService.alert({
          message: `Đây là khách hàng mới đã giao dịch lần 2!`,
          msgClass: "cssSuccess",
          hPosition: "center",
          vPosition: "center",
        });
        return;
      }
    }
  }

  submitTransactionCash() {
    if (this.transactionCreateForm.invalid) {
      return;
    }
    let messageConfirm = `Bạn chắc chắn muốn lưu giao dịch?`;
    let traceNo = this.transactionCreateForm.get("traceNo").value;
    let batchNo = this.transactionCreateForm.get("batchNo").value;

    if (!traceNo || !batchNo || traceNo.trim().length == 0 || batchNo.trim().length == 0) {
      messageConfirm = `Hệ thống ghi nhận đây là giao dịch treo (do không có mã lô và mã hóa đơn), bạn chắc chắn muốn lưu giao dịch?`;
    }

    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: messageConfirm,
        title: "Hoàn thành giao dịch",
      },
    });

    dialog.afterClosed().subscribe((data) => {
      if (data) {
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
    });
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
                msgClass: "cssDanger",
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
    let totalBooking = 0;
    for (let i = 0; i < this.listRollTermBooking.length; i++) {
      let booking = this.listRollTermBooking[i];
      totalBooking += this.transactionService.formatLong(booking.amountBooking);
    }

    if (this.transactionService.formatLong(this.transactionInfo.requestAmount) != totalBooking) {
      this.alertService.alert({
        message: `Tổng số tiền trong lịch đáo hạn thẻ không bằng số tiền cần làm ĐHT (${this.transactionInfo.requestAmount}) `,
        msgClass: "cssDanger",
        hPosition: "center",
      });
      return;
    }

    if (this.transactionCreateForm.invalid) {
      return;
    }

    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Bạn chắc chắn muốn lưu giao dịch",
        title: "Hoàn thành giao dịch",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
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
    });
  }

  calculateTotalBookingAmount() {
    // input max transfer amount accept for rollterm transaction
    // if null or max amount is -1 , set max amount to ignore ( set this value to 1 trillion)
    const maxAmount =
      this.currentUser?.appSettingModule?.maxAmountTransferRollTerm > 0
        ? this.currentUser.appSettingModule.maxAmountTransferRollTerm
        : 1000000000;
    let lastBookingAmountExceptLast = 0;
    let index = 0;

    this.listRollTermBooking.forEach((booking: any) => {
      if (index < this.listRollTermBooking.length - 1) {
        if (this.transactionService.formatLong(booking.amountBooking) > maxAmount) {
          this.alertService.alert({
            message: `Số tiền không được vuợt quá ${this.formatCurrency(String(maxAmount))} đ`,
            msgClass: "cssDanger",
            hPosition: "center",
          });
          booking.amountBooking = this.formatCurrency(String(maxAmount));
        }
        lastBookingAmountExceptLast +=
          this.transactionService.formatLong(booking.amountBooking) > maxAmount
            ? maxAmount
            : this.transactionService.formatLong(booking.amountBooking);
        index++;
      }
    });

    this.listRollTermBooking[this.listRollTermBooking.length - 1].amountBooking = this.formatCurrency(
      String(this.transactionService.formatLong(this.transactionInfo.requestAmount) - lastBookingAmountExceptLast)
    );

    if (
      this.transactionService.formatLong(this.listRollTermBooking[this.listRollTermBooking.length - 1].amountBooking) >
      maxAmount
    ) {
      this.addBookingRow();
    } else {
      if (
        this.transactionService.formatLong(
          this.listRollTermBooking[this.listRollTermBooking.length - 1].amountBooking
        ) < 1
      ) {
        this.removeBookingRow(String(this.listRollTermBooking.length - 1));
        this.calculateTotalBookingAmount();
      }
    }

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
    let rollTerm = this.listRollTermBooking[index];

    this.listRollTermBooking.splice(
      this.listRollTermBooking.findIndex((item: any) => item == rollTerm),
      1
    );

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
      type: this.transactionInfo.type,
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

  createClientSavingAccountTemplate(clientId: string, productId: string, clientName: string) {
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;

    this.savingsService.getSavingsAccountTemplate(clientId, productId, false).subscribe((response: any) => {
      this.savingsService.createClientSavingsAccount(clientId, productId, response).subscribe((savingsAccount: any) => {
        this.activateAndApproveAccountForm = this.formBuilder.group({
          approvedOnDate: [new Date(), Validators.required],
        });
        this.activateAndApproveAccountForm.patchValue({
          approvedOnDate: this.datePipe.transform(new Date(), dateFormat),
        });
        const data = {
          ...this.activateAndApproveAccountForm.value,
          dateFormat,
          locale,
        };
        this.savingsService.executeSavingsAccountCommand(savingsAccount.savingsId, "approve", data).subscribe(() => {
          this.activateAndApproveAccountForm = this.formBuilder.group({
            activatedOnDate: [new Date(), Validators.required],
          });
          this.activateAndApproveAccountForm.patchValue({
            activatedOnDate: this.datePipe.transform(new Date(), dateFormat),
          });
          const data = {
            ...this.activateAndApproveAccountForm.value,
            dateFormat,
            locale,
          };
          this.savingsService.executeSavingsAccountCommand(savingsAccount.savingsId, "activate", data).subscribe(() => {
            this.savingsService.makeFunForMarketing(savingsAccount.savingsId, clientName).subscribe((res: any) => {
              const message = `Thực hiện thành công!`;
              this.savingsService.handleResponseApiSavingTransaction(res, message, false);
            });
          });
        });
      });
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
