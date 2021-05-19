import { Component, Inject, OnInit } from "@angular/core";
import { TransactionService } from "../../transaction.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from "../../../core/authentication/authentication.service";
import { AlertService } from "../../../core/alert/alert.service";
import { MidasClientService } from "../../../midas-client/midas-client.service";
import { GroupsService } from "app/groups/groups.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { SavingsService } from "app/savings/savings.service";

@Component({
  selector: "midas-add-fee-dialog",
  templateUrl: "./add-fee-dialog.component.html",
  styleUrls: ["./add-fee-dialog.component.scss"],
})
export class AddFeeDialogComponent implements OnInit {
  paidPaymentType: any[] = [];
  formDialogPaid: FormGroup;
  formDialogGet: FormGroup;
  accountsFee: any[] = [];
  txnCode: string;
  transactions: any[] = [];
  accountsPaid: any[] = [];
  currentUser: any;
  transactionFee: any;
  transactionPaid: any;
  showPaid = false;

  showGet = true;
  showCashAccountPaid = true;
  selectedPaymentTypePaid = "";
  paidAmount = 0;
  feeAmount = 0;
  donePaid = false;
  doneFee = false;
  isBATCH = false;
  disableAmountPaid = false;
  clientId: any;
  clientAccount: any;
  messageError: string;
  isLoading: boolean = false;
  amountPaidBooking: number;
  maxAmount: number = 0;

  constructor(
    private transactionService: TransactionService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddFeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authenticationService: AuthenticationService,
    private alertServices: AlertService,
    private midasClientServices: MidasClientService,
    private groupsService: GroupsService,
    private dialog: MatDialog,
    private savingsService: SavingsService
  ) {
    this.txnCode = data.data?.txnCode;
    this.amountPaidBooking = data.data?.amountPaid;
    this.formDialogPaid = this.formBuilder.group({
      paymentCode: [""],
      savingAccountPaid: [""],
      amountPaid: [""],
      notePaid: [""],
    });
    this.formDialogGet = this.formBuilder.group({
      paymentCodeGet: [""],
      amountGet: [""],
      savingAccountGet: [""],
      noteGet: [""],
    });
    this.formDialogPaid.get("paymentCode").valueChanges.subscribe((value) => {
      this.checkAccountAndAmountPaid();
    });
    this.formDialogGet.get("paymentCodeGet").valueChanges.subscribe((value) => {
      this.checkAccountFee();
    });
  }

  getPaymentCode() {
    return this.formDialogPaid.get("paymentCode").value;
  }

  checkAccountAndAmountPaid() {
    this.formDialogPaid.value;
    const paymentCode = this.formDialogPaid.get("paymentCode").value;
    if (paymentCode !== "DE") {
      this.midasClientServices.getListSavingAccountByUserId().subscribe((result) => {
        this.accountsPaid = result?.result?.listSavingAccount;
        this.showGet = true;
        this.formDialogPaid.get("amountPaid").enable();
        this.transactionFee = this.transactions.find((v) => v.txnPaymentType === "IN");
        this.transactionPaid = this.transactions.find((v) => v.txnPaymentType === "OUT");

        if (!this.transactionPaid) {
          this.formDialogPaid.get("amountPaid").setValue(0);
        } else {
          this.formDialogPaid.get("amountPaid").setValue(this.transactionPaid?.feeRemain);
        }

        if (!this.transactionFee) {
          this.formDialogGet.get("amountGet").setValue(0);
        } else {
          this.formDialogGet.get("amountGet").setValue(this.transactionFee?.feeRemain);
        }

        const AC = paymentCode === "CA" ? 9 : 8;
        let NoAccount = 0;
        this.accountsPaid.map((v) => {
          if (v.productId !== AC) {
            v.hide = true;
          } else {
            v.hide = false;
            if (NoAccount == 0) {
              this.formDialogPaid.get("savingAccountPaid").setValue(v.id);
            }
            NoAccount += 1;
          }
        });
      });
    } else {
      this.showGet = false;
      this.formDialogPaid.get("amountPaid").setValue(this.transactionPaid?.feeRemain - this.transactionFee?.feeRemain);
      if (!this.isBATCH) {
        this.formDialogPaid.get("amountPaid").disable();
      } else {
        this.accountsPaid = [];
        let groupId = this.transactions[0].agencyId;
        this.groupsService.getGroupAccountsData(groupId).subscribe((savings) => {
          this.clientAccount = savings?.savingsAccounts;
          let savingAccountId = null;
          if (this.clientAccount) {
            for (let index = 0; index < this.clientAccount.length; index++) {
              if (this.clientAccount[index].status.id == 300) {
                savingAccountId = this.clientAccount[index].id;
              }
            }

            if (savingAccountId != null) {
              this.accountsPaid = this.clientAccount;
              this.formDialogPaid.get("savingAccountPaid").setValue(savingAccountId);
            } else {
              this.alertServices.alert({
                message: "Đại lý hưa có tài khoản thanh toán còn hoạt động, vui lòng thêm tài khoản trước!",
                msgClass: "cssWarning",
              });
            }
          } else {
            this.alertServices.alert({
              message: "Đại lý chưa có tài khoản thanh toán, vui lòng thêm tài khoản trước!",
              msgClass: "cssWarning",
            });
          }
        });
      }
    }
  }

  checkAccountFee() {
    const value = this.formDialogGet.get("paymentCodeGet").value;
    this.formDialogGet.get("savingAccountGet").setValue("");

    if (value === "AM" || value === "AR") {
      if (value === "AM") {
        this.midasClientServices.getListSavingAccountByClientId(this.clientId).subscribe((result) => {
          this.clientAccount = result?.result?.listSavingAccount;
          this.accountsFee = this.clientAccount;

          if (this.accountsFee.length > 0) {
            this.formDialogGet.get("savingAccountGet").setValue(this.accountsFee[0].id);
          }
        });
      } else {
        if (value === "AR") {
          let groupId = this.transactions[0].agencyId;
          this.groupsService.getGroupAccountsData(groupId).subscribe((savings) => {
            this.clientAccount = savings?.savingsAccounts;
            this.clientAccount.filter((account: any) => {
              return (account.status.id = 300);
            });
            this.accountsFee = this.clientAccount;

            if (this.accountsFee.length > 0) {
              this.formDialogGet.get("savingAccountGet").setValue(this.accountsFee[0].id);
            }
          });
        }
      }
    } else {
      this.midasClientServices.getListSavingAccountByUserId().subscribe((result) => {
        this.accountsFee = result?.result?.listSavingAccount;

        const AC = value === "CA" ? 9 : 8;
        // this.accountsFee = this.accountsPaid;
        let NoAccount = 0;
        this.accountsFee.map((v) => {
          if (v.productId !== AC) {
            v.hide = true;
          } else {
            v.hide = false;
            if (NoAccount == 0) {
              this.formDialogGet.get("savingAccountGet").setValue(v.id);
            }
            NoAccount += 1;
          }
        });
      });
    }
  }

  displaySavingAccount(externalId: string, accountNo: string) {
    let result = "";
    if (!accountNo) {
      result = externalId;
    } else {
      if (!externalId) {
        result = accountNo;
      } else {
        result = externalId;
      }
    }

    return `${result} `;
  }

  ngOnInit(): void {
    this.transactionService.getFeePaidTransactionByTnRefNo(this.txnCode).subscribe((result) => {
      this.transactions = result.result?.listTransactionFee;
      this.clientId = this.transactions[0].customerId;
      this.transactionFee = this.transactions.find((v) => v.txnPaymentType === "IN");
      this.transactionPaid = this.transactions.find((v) => v.txnPaymentType === "OUT");
      this.selectedPaymentTypePaid = "FT";

      // check is get amount paid from booking
      if (this.amountPaidBooking && this.amountPaidBooking > 0) {
        this.transactionPaid.feeRemain = this.amountPaidBooking;
      }

      if (this.transactionPaid) {
        this.paidAmount = this.transactionPaid?.feeRemain;
      }

      if (this.transactionFee) {
        this.feeAmount = this.transactionFee?.feeRemain;
      }

      if (this.feeAmount <= 0 && this.paidAmount <= 0) {
        this.messageError = "Tài khoản không khả dụng";
      }

      if (this.transactionPaid && this.transactionPaid.txnType === "BATCH") {
        this.showCashAccountPaid = false;
        this.showGet = false;
        this.isBATCH = true;
        this.selectedPaymentTypePaid = "DE";
        this.paidAmount = this.paidAmount - this.feeAmount;
        this.formDialogPaid.get("amountPaid").setValue(this.paidAmount);
      }
      this.formDialogGet.get("amountGet").setValue(this.feeAmount);
      this.formDialogPaid.get("paymentCode").setValue(this.selectedPaymentTypePaid);

      if (this.transactionFee && this.transactionFee.txnType === "ROLLTERM") {
        this.formDialogGet.get("paymentCodeGet").setValue("AM");
      } else {
        this.formDialogGet.get("paymentCodeGet").setValue("FT");
      }

      // this.clientService.getClientAccountData()
      this.transactionService.getPaymentTypes().subscribe((result) => {
        this.paidPaymentType = result?.result?.listPayment;

        if (this.transactionPaid && this.transactionPaid.txnType === "ROLLTERM") {
          this.paidPaymentType.splice(
            this.paidPaymentType.findIndex((x) => x.code === "DE"),
            1
          );
          this.maxAmount =
            this.currentUser?.appSettingModule?.maxAmountTransferRollTerm > 0
              ? this.currentUser.appSettingModule.maxAmountTransferRollTerm
              : 1000000000;
        }
        this.midasClientServices.getListSavingAccountByUserId().subscribe((result) => {
          this.accountsFee = result?.result?.listSavingAccount;
          this.accountsPaid = this.accountsFee;
          this.checkAccountAndAmountPaid();
          this.checkAccountFee();
        });
      });
    });

    this.currentUser = this.authenticationService.getCredentials();
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

  submitForm() {
    if (this.formDialogGet.invalid && this.formDialogPaid.invalid) {
      this.formDialogPaid.markAllAsTouched();
      this.formDialogGet.markAllAsTouched();
      return;
    }
    let amountPaidFee = this.formDialogPaid.get("amountPaid").value;
    if (this.maxAmount > 0 && this.maxAmount < amountPaidFee) {
      this.alertServices.alert({
        message: `Số tiền chi BHCN không được vuợt quá ${this.formatCurrency(String(this.maxAmount))} /1 lần`,
        msgClass: "cssDanger",
        hPosition: "center",
      });
      return;
    }

    if (this.formDialogPaid.get("paymentCode").value == "DE") {
      this.formDialogPaid.get("amountPaid").enable();
      this.formDialogGet.get("amountGet").setValue("");
    } else {
    }
    let form = {
      ...this.formDialogGet.value,
      ...this.formDialogPaid.value,
    };

    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Bạn chắc chắn muốn lưu giao dịch",
        title: "Hoàn thành giao dịch",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        form.txnCode = this.txnCode;
        this.isLoading = true;
        this.transactionService.paidFeeForTransaction(form).subscribe((result) => {
          this.isLoading = false;
          const message = "🎉🎉 Thanh toán phí thành công";
          const resCheck = this.savingsService.handleResponseApiSavingTransaction(result, message, false);

          if (resCheck) {
            this.dialogRef.close({ status: true });
          }
        });
      }
    });
  }
}
