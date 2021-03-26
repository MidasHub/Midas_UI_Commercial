/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";

/** Custom Services */
import { SavingsService } from "../../savings.service";
import { AlertService } from "app/core/alert/alert.service";
import { SettingsService } from "app/settings/settings.service";

/**
 * Create savings account transactions component.
 */
@Component({
  selector: "mifosx-savings-transactions",
  templateUrl: "./savings-account-transactions.component.html",
  styleUrls: ["./savings-account-transactions.component.scss"],
})
export class SavingsAccountTransactionsComponent implements OnInit {
  /** Minimum Due Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Due Date allowed. */
  maxDate = new Date();
  /** Savings account transaction form. */
  savingAccountTransactionForm: FormGroup;
  /** savings account transaction payment options. */
  paymentTypeOptions: {
    id: number;
    name: string;
    description: string;
    isCashPayment: boolean;
    position: number;
  }[];

  limitInfo: any;
  /** Flag to enable payment details fields. */
  addPaymentDetailsFlag: Boolean = false;
  paymentTypeIdGroup: string = "!Expense";
  /** transaction type flag to render required UI */
  transactionType: { deposit: boolean; withdrawal: boolean } = { deposit: false, withdrawal: false };
  /** transaction command for submit request */
  transactionCommand: string;
  /** saving account's Id */
  savingAccountId: string;
  showStaffChoose: boolean = false;
  filteredOptions: any = [];
  paymentTypeDescription: string;
  isInterchangeClient: boolean = false;
  /**
   * Retrieves the Saving Account transaction template data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {SavingsService} savingsService Savings Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {DatePipe} datePipe DatePipe.
   * @param {Router} router Router for navigation.
   */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private savingsService: SavingsService,
    private settingsService: SettingsService
  ) {
    this.route.data.subscribe((data: { savingsAccountActionData: any }) => {
      if (data.savingsAccountActionData.result) {
        this.isInterchangeClient = true;
        this.paymentTypeOptions = data.savingsAccountActionData.result.savingTemplate.paymentTypeOptions;
      } else {
        this.paymentTypeOptions = data.savingsAccountActionData.paymentTypeOptions;
      }
    });
    this.transactionCommand = this.route.snapshot.params["name"].toLowerCase();
    this.transactionType[this.transactionCommand] = true;
    this.savingAccountId = this.route.parent.snapshot.params["savingAccountId"];
  }

  /**
   * Creates the Saving account transaction form when component loads.
   */
  ngOnInit() {
    this.createSavingAccountTransactionForm();
  }

  /**
   * Method to create the Saving Account Transaction Form.
   */
  createSavingAccountTransactionForm() {
    this.savingAccountTransactionForm = this.formBuilder.group({
      transactionDate: [new Date(), Validators.required],
      transactionAmount: ["", Validators.required],
      paymentTypeGroup: ["", Validators.required],
      paymentTypeId: ["", Validators.required],
      note: [""],
    });

    // **SÁNG** filter payment type by group
    this.savingAccountTransactionForm.get("paymentTypeGroup").valueChanges.subscribe((value) => {
      this.filterPaymentType();
    });

    this.savingAccountTransactionForm.get("paymentTypeId").valueChanges.subscribe((value) => {
      this.changePaymentType();
    });

    // **SÁNG** open add on info on default
    this.addPaymentDetails();
  }

  filterPaymentType() {
    this.paymentTypeDescription = "";
    let groupId = String(this.savingAccountTransactionForm.get("paymentTypeGroup").value);

    if (!this.isInterchangeClient) {
      if (groupId == "Expense-Equity") {
        this.showStaffChoose = true;
        this.savingAccountTransactionForm.get("accountNumber").setValue("51");
      } else {
        this.showStaffChoose = false;
        this.savingAccountTransactionForm.get("accountNumber").setValue(null);
      }
    }

    this.filteredOptions = this.paymentTypeOptions.filter((item) => {
      if (groupId.startsWith("!")) {
        return item.name.indexOf(groupId.substring(1)) == -1;
      } else {
        return item.name.includes(groupId);
      }
    });
    this.savingAccountTransactionForm.get("paymentTypeId").setValue(null);
  }

  changePaymentType() {
    let paymentTypeId = this.savingAccountTransactionForm.get("paymentTypeId").value;
    if (!paymentTypeId) {
      return;
    }
    let paymentTypeDescription = "";
    this.paymentTypeOptions.forEach(function (paymentType) {
      if (paymentType.id == paymentTypeId) {
        paymentTypeDescription = paymentType.description;
      }
    });
    this.paymentTypeDescription = paymentTypeDescription;
    if (this.transactionCommand == "withdrawal" && !this.isInterchangeClient) {
      if (this.showStaffChoose) {
        let staffId = this.savingAccountTransactionForm.get("accountNumber").value;
        this.checkValidAmountWithdrawalTransaction(paymentTypeId, staffId);
      } else {
        this.checkValidAmountWithdrawalTransaction(paymentTypeId);
      }
    }
  }

  // get limit config for withdraw action
  checkValidAmountWithdrawalTransaction(paymentTypeId: string, staffId?: string) {
    this.savingsService.getLimitSavingsTransactionConfig(paymentTypeId, staffId).subscribe((config) => {
      this.limitInfo = config.result;
    });
  }

  /**
   * Method to add payment detail fields to the UI.
   */
  addPaymentDetails() {
    this.addPaymentDetailsFlag = !this.addPaymentDetailsFlag;
    if (this.addPaymentDetailsFlag) {
      this.savingAccountTransactionForm.addControl("accountNumber", new FormControl(""));
      this.savingAccountTransactionForm.addControl("checkNumber", new FormControl(""));
      this.savingAccountTransactionForm.addControl("routingCode", new FormControl(""));
      this.savingAccountTransactionForm.addControl("receiptNumber", new FormControl(""));
      this.savingAccountTransactionForm.addControl("bankNumber", new FormControl(""));

      this.savingAccountTransactionForm.get("accountNumber").valueChanges.subscribe((value) => {
        this.changePaymentType();
      });
    } else {
      this.savingAccountTransactionForm.removeControl("accountNumber");
      this.savingAccountTransactionForm.removeControl("checkNumber");
      this.savingAccountTransactionForm.removeControl("routingCode");
      this.savingAccountTransactionForm.removeControl("receiptNumber");
      this.savingAccountTransactionForm.removeControl("bankNumber");
    }
  }

  /**
   * Method to submit the transaction details.
   */
  submit() {
    if (this.limitInfo && this.limitInfo.limitConfig > 0 && !this.isInterchangeClient) {
      if (
        this.limitInfo.limitUsed >= this.limitInfo.limitConfig ||
        this.limitInfo.limitConfig - this.limitInfo.limitUsed <
          this.savingAccountTransactionForm.get("transactionAmount").value
      ) {
        this.alertService.alert({
          message: `Số tiền chi vượt hạn mức hoặc đã hết hạn mức, không thể thực hiện!`,
          msgClass: "cssDanger",
          hPosition: "center",
        });

        return;
      }
    }
    // remove un use controller
    this.savingAccountTransactionForm.removeControl("paymentTypeGroup");

    const prevTransactionDate: Date = this.savingAccountTransactionForm.value.transactionDate;
    // TODO: Update once language and date settings are setup
    const dateFormat = this.settingsService.dateFormat;
    const locale = this.settingsService.language.code;
    this.savingAccountTransactionForm.patchValue({
      transactionDate: this.datePipe.transform(prevTransactionDate, dateFormat),
    });
    const transactionData = this.savingAccountTransactionForm.value;
    transactionData.locale = locale;
    transactionData.dateFormat = dateFormat;
    if (!this.isInterchangeClient) {
      this.savingsService
        .executeSavingsAccountTransactionsCommand(this.savingAccountId, this.transactionCommand, transactionData)
        .subscribe((res) => {
          this.router.navigate(["../../"], { relativeTo: this.route });
        });
    } else {
      this.savingsService
        .executeIcSavingsAccountTransactionsCommand(this.savingAccountId, this.transactionCommand, transactionData)
        .subscribe((res) => {
          let responseT = res?.result?.resultCommand;
          if (responseT.statusCodeValue == 200 && !responseT?.body?.errors) {
            const message = `Thực hiện thành công!`;
            this.alertService.alert({ message: message, msgClass: "cssInfo" });
            this.router.navigate(["../../transactions"], { relativeTo: this.route });
          } else {
            let response = res?.result?.resultCommand.body;
            let errorMessage = response.defaultUserMessage || response.developerMessage;
            if (response.errors) {
              if (response.errors[0]) {
                errorMessage = response.errors[0].defaultUserMessage || response.errors[0].developerMessage;
              }
            }
            this.alertService.alert({
              message: `Lỗi: ${errorMessage}, Vui lòng liên hệ IT support!`,
              msgClass: "cssDanger",
              hPosition: "right",
            });
          }
        });
    }
  }
}
