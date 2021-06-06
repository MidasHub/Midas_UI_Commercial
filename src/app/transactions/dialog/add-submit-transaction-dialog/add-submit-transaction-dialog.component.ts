import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "midas-add-submit-transaction-dialog",
  templateUrl: "./add-submit-transaction-dialog.component.html",
  styleUrls: ["./add-submit-transaction-dialog.component.scss"],
})
export class AddSubmitTransactionDialogComponent implements OnInit {
  formDialog: FormGroup;
  member: any;
  listTerminalTransaction: any[];
  transactionTotalByBatchNo: any[];
  listObjectTransactionSubmit: any[];
  displayedColumns: string[] = ["no", "amountSubmit", "batchNoSubmit"];
  dataSource: MatTableDataSource<any>;
  @ViewChild("bookingBranchSubmit") bookingBranchSubmit: MatTable<Element>;


  constructor(
    public dialogRef: MatDialogRef<AddSubmitTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource();
    this.transactionTotalByBatchNo = data.transactionTotalByBatchNo;
    this.listTerminalTransaction = data.listTerminalTransaction;
    this.listObjectTransactionSubmit = [];

    this.formDialog = this.formBuilder.group({
      terminalSubmit: ["", Validators.required],
      // note: [""],
    });
  }

  ngOnInit(): void {
    //init batchNo with total amnount submit
    this.formDialog.get("terminalSubmit").valueChanges.subscribe((option: any) => {
      this.listObjectTransactionSubmit = [];
      this.transactionTotalByBatchNo.forEach((element: any) => {
        if (element.terminalId == option) {
          let objectSubmitTransaction = {
            batchNoSubmit: element.batchNo,
            amountSubmitSuggest: element.amount,
            amountSubmit: "",
          };
          this.listObjectTransactionSubmit.push(objectSubmitTransaction);
        }
      });

      return;

    });
  }



}
