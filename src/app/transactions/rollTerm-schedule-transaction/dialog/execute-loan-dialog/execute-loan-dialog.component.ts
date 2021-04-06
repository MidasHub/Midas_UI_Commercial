import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ClientsService } from "app/clients/clients.service";
import { AlertService } from "app/core/alert/alert.service";
import { MidasClientService } from "app/midas-client/midas-client.service";
import { SavingsService } from "app/savings/savings.service";
import { TransactionService } from "app/transactions/transaction.service";

@Component({
  selector: "midas-execute-loan-dialog",
  templateUrl: "./execute-loan-dialog.component.html",
  styleUrls: ["./execute-loan-dialog.component.scss"],
})
export class ExecuteLoanDialogComponent implements OnInit {
  paidPaymentType: any[] = [];
  formDialogPaid: FormGroup;
  formDialogGet: FormGroup;
  accountsFee: any[] = [];
  refId: number;
  posTransaction: any;
  accountsPaid: any[] = [];

  constructor(
    private transactionService: TransactionService,
    private savingsService: SavingsService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ExecuteLoanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alertServices: AlertService,
  ) {
    this.refId = data.refId;
    this.formDialogPaid = this.formBuilder.group({
      paymentCode: ["AM"],
      amountPaid: [""],
      savingAccountPaid: [""],
      fromClientId: [""],

    });
  }

  ngOnInit(): void {
    this.transactionService.getExecuteRollTermTransactionByTrnRefNo(this.refId).subscribe((result) => {
      this.paidPaymentType = result.result?.listPayment;
      this.accountsPaid = result.result?.listSavingAccount;
      this.posTransaction = result.result?.posTransaction;

      this.accountsPaid.forEach((result) => {
          if (result.productId == 12){
            this.formDialogPaid.get("savingAccountPaid").setValue(result.id);
          }
      })

      this.formDialogPaid.get('fromClientId').setValue(
        this.posTransaction.custId
      );
      this.formDialogPaid.get('amountPaid').setValue(
        this.posTransaction.principal - this.posTransaction.amountPaid
      );
    });
  }

  submitForm() {
    if ( this.formDialogPaid.invalid) {
      this.formDialogPaid.markAllAsTouched();
      return;
    }
    const form = {
      ...this.formDialogPaid.value,
    };
    form.txnCode = this.refId;
    this.transactionService.ExecuteRollTermTransactionByTrnRefNo(form).subscribe((result) => {

      let message = "🎉🎉 Xử lý thành công" ;
      this.savingsService.handleResponseApiSavingTransaction(result, message, null);
      this.dialogRef.close({ status: true });
    });
  }
}
