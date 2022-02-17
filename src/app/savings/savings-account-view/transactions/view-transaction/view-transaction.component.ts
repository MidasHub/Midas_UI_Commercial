/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";

/** Custom Services */
import { SavingsService } from "app/savings/savings.service";
import { SettingsService } from "app/settings/settings.service";

/** Custom Dialogs */
import { UndoTransactionDialogComponent } from "../../custom-dialogs/undo-transaction-dialog/undo-transaction-dialog.component";
import { AlertService } from "app/core/alert/alert.service";

/**
 * View Transaction Component.
 * TODO: Add support for account transfers.
 */
@Component({
  selector: "mifosx-view-transaction",
  templateUrl: "./view-transaction.component.html",
  styleUrls: ["./view-transaction.component.scss"],
})
export class ViewTransactionComponent implements OnInit {
  /** Transaction data. */
  transactionData: any;
  undoAvailable: boolean = false;
  messageError: string;

  /**
   * Retrieves the Transaction data from `resolve`.
   * @param {SavingsService} savingsService Savings Service
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   * @param {DatePipe} datePipe DatePipe.
   * @param {SettingsService} settingsService Setting service
   */
  constructor(
    private savingsService: SavingsService,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private settingsService: SettingsService
  ) {
    this.route.data.subscribe((data: { savingsAccountTransaction: any }) => {
      this.transactionData = data.savingsAccountTransaction;
    });
  }

  getTxnType(){
    if(this.transactionData.transactionType.value == 'Withdrawal'){
      return 'nhận';
    } else {
      if(this.transactionData.transactionType.value == 'Deposit'){
        return 'gửi';
      }
    }
  }

  ngOnInit() {
    // check is transaction available to undo
    this.savingsService.checkValidRevertSavingTransaction(this.transactionData.id).subscribe((data) => {
      if (!data.result.isValid) {
        this.messageError = data.result.message;
      } else {
        this.undoAvailable = true;
      }
    });

    // get detail transfer transaction
    if (this.transactionData.paymentDetailData && this.transactionData.paymentDetailData.checkNumber) {
      this.savingsService.getCheckerClientInfo(this.transactionData.paymentDetailData.checkNumber, this.transactionData.id).subscribe((data) => {
        this.transactionData.paymentDetailData.clientInfo =  data.result.clientDto;
      });
    }
  }

  /**
   * Undo the savings transaction
   */
  undoTransaction() {
    if (!this.undoAvailable) {
      this.alertService.alert({
        message: `${this.messageError}`,
        msgClass: "cssDanger",
        hPosition: "center",
      });

      return;
    }
    const accountId = this.route.parent.snapshot.params["savingAccountId"];
    const undoTransactionAccountDialogRef = this.dialog.open(UndoTransactionDialogComponent);
    undoTransactionAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        const locale = this.settingsService.language.code;
        const dateFormat = this.settingsService.dateFormat;
        const data = {
          transactionDate: this.datePipe.transform(
            this.transactionData.date && new Date(this.transactionData.date),
            dateFormat
          ),
          transactionAmount: 0,
          dateFormat,
          locale,
        };
        this.savingsService
          .executeSavingsAccountTransactionsCommand(accountId, "undo", data, this.transactionData.id)
          .subscribe(() => {
            this.alertService.alert({
              message: `Hủy giao dịch ${this.transactionData.id} thành công!`,
              msgClass: "cssSuccess",
              hPosition: "center",
            });
            this.router.navigate(["../"], { relativeTo: this.route.parent });
          });
      }
    });
  }
}
