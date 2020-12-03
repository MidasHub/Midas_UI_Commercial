import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig } from "@angular/material/dialog";
import { AuthenticationService } from "../../../core/authentication/authentication.service";
import { AlertService } from "../../../core/alert/alert.service";
import { TransactionService } from "../../transaction.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { AddFeeDialogComponent } from "../add-fee-dialog/add-fee-dialog.component";

@Component({
  selector: "midas-create-success-transaction-dialog",
  templateUrl: "./create-success-transaction-dialog.component.html",
  styleUrls: ["./create-success-transaction-dialog.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class CreateSuccessTransactionDialogComponent implements OnInit {
  transactionInfo: any;
  expandedElement: any;

  constructor(
    public dialogRef: MatDialogRef<CreateSuccessTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transactionServices: TransactionService,
    public dialog: MatDialog
  ) {
    this.transactionInfo = data;
    console.log(this.transactionInfo);
  }

  downloadVoucherTransaction() {
    this.transactionServices.downloadVoucher(this.transactionInfo.transactionId);
  }

  addFeeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: {
        txnCode: this.transactionInfo.trnRefNo,
      },
    };
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(AddFeeDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe((data) => {
      if (data) {
      }
    });
  }

  ngOnInit(): void {}
}
