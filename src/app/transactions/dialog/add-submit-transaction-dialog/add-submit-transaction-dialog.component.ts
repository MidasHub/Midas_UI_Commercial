import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { promise } from "selenium-webdriver";
import { TransactionService } from "app/transactions/transaction.service";

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
  displayedColumns: string[] = ["no", "amountSubmit", "batchNoSubmit", "fileSubmit"];
  dataSource: MatTableDataSource<any>;
  @ViewChild("bookingBranchSubmit") bookingBranchSubmit: MatTable<Element>;

  constructor(
    public dialogRef: MatDialogRef<AddSubmitTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
  ) {
    this.dataSource = new MatTableDataSource();
    this.transactionTotalByBatchNo = data.transactionTotalByBatchNo;
    this.listTerminalTransaction = data.listTerminalTransaction;
    this.listObjectTransactionSubmit = [];

    this.formDialog = this.formBuilder.group({
      terminalSubmit: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    //init batchNo with total amnount submit
    this.formDialog.get("terminalSubmit").valueChanges.subscribe((option: any) => {
      this.listObjectTransactionSubmit = [];
      this.transactionTotalByBatchNo.forEach((element: any) => {
        if (element.terminalId == option) {
          let objectSubmitTransaction: any = {
            batchNoSubmit: element.batchNo,
            amountSubmitSuggest: element.amount,
            amountSubmit: undefined,
            fileSubmitBase64: undefined,
          };
          this.listObjectTransactionSubmit.push(objectSubmitTransaction);
        }
      });

      return;
    });
  }

  async changeListener($event: any, batchNo: string) {
     await this.readThis($event.target, batchNo);
  }

  async readThis(inputValue: any, batchNo: string) {
    var file: File = inputValue.files[0];
    if (!file) {
      this.listObjectTransactionSubmit.forEach((transaction) => {
        if (transaction.batchNoSubmit == batchNo) {
          transaction.fileSubmitBase64 = undefined;
        }
      });
    }

    file = await this.transactionService.resizeImage(file, 1920, 1080 );

    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.listObjectTransactionSubmit.forEach((transaction) => {
        if (transaction.batchNoSubmit == batchNo) {
          transaction.fileSubmitBase64 = myReader.result;
        }
      });
      // return myReader.result;
    };
    myReader.readAsDataURL(file);
  }
}
