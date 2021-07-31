import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "midas-add-row-create-batch-transaction",
  templateUrl: "./add-row-create-batch-transaction.component.html",
  styleUrls: ["./add-row-create-batch-transaction.component.scss"],
})
export class AddRowCreateBatchTransactionComponent implements OnInit {
  formDialog: FormGroup;
  optionsProducts: any[] = [
    {
      value: "CA01",
      label: "Cash",
    },
    {
      value: "AL01",
      label: "Advance",
    },
  ];
  terminals: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddRowCreateBatchTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.formDialog = this.formBuilder.group({
      productId: [""],
      rate: [""],
      amount: [""],
      terminalId: [""],
      requestAmount: [""],
      amountTransaction: [""],
      fee: [""],
      batchNo: [""],
      tid: [""],
      terminalAmount: [""],
    });
    const { rowData } = data;
    if (rowData) {
      const keys = Object.keys(rowData);
      for (const key of keys) {
        this.formDialog.get(key)?.setValue(rowData[key]);
      }
    }
  }

  ngOnInit(): void {}

  submitForm() {}
}
