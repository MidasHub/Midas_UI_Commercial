import { Component, Inject, OnInit } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TransactionService } from "../../transaction.service";
import { AlertService } from "../../../core/alert/alert.service";
import { ClientsService } from "../../../clients/clients.service";
import { SavingsService } from "app/savings/savings.service";

@Component({
  selector: "midas-make-fee-on-advance",
  templateUrl: "./make-fee-on-advance.component.html",
  styleUrls: ["./make-fee-on-advance.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "100px" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class MakeFeeOnAdvanceComponent implements OnInit {
  displayedColumns: any[] = [
    "txnSavingResource",
    "createdDate",
    "txnSavingType",
    "txnPaymentCode",
    "txnSavingId",
    "paidAmount",
  ];
  expandedElement: any;
  formDialog: FormGroup;
  advanceCashPaidFees: any[] = [
    {
      value: "0",
      label: "Chi tiền ứng",
    },
  ];

  clientAccountsTeller: any[] = [];
  transactions: any[] = [];
  batchTxnName: any;

  constructor(
    public dialogRef: MatDialogRef<MakeFeeOnAdvanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private savingsService: SavingsService,
    private clientService: ClientsService,
  ) {
    this.batchTxnName = this.data.batchTxnName;
    this.formDialog = this.formBuilder.group({
      amountPaid: [""],
      isAdvance: ["0"],
      savingAccountPaid: [""],
    });
  }

  ngOnInit(): void {
    this.transactionService.getListFeeSavingTransaction(this.batchTxnName).subscribe((result) => {
      this.transactions = result?.result?.listTransactionAlready;
    });
    this.clientService.getClientOfStaff().subscribe((result) => {
      this.clientService.getClientAccountData(result?.result?.clientId).subscribe((result1: any) => {
        this.clientAccountsTeller = result1?.savingsAccounts;
      });
    });
  }

  submitForm() {
    if (this.formDialog.invalid) {
      return this.formDialog.markAllAsTouched();
    }
    const form = this.formDialog.value;
    const formData = {
      txnCode: this.batchTxnName,
      ...form,
    };
    this.savingsService.makeFeeOnAdvanceExecute(formData).subscribe((result: any) => {

      const message = "Ứng tiền thành công";
      this.savingsService.handleResponseApiSavingTransaction(result, message, null);
      return this.dialogRef.close({status: true});
    });
  }

  addRow() {}
}
