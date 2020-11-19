import { TransactionService } from 'app/transactions/transaction.service';
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormfieldBase } from "app/shared/form-dialog/formfield/model/formfield-base";
import { Router } from "@angular/router";

@Component({
  selector: "midas-transaction-history-dialog",
  templateUrl: "./transaction-history-dialog.component.html",
  styleUrls: ["./transaction-history-dialog.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class TransactionHistoryDialogComponent implements OnInit {
  expandedElement: any;
  transactionInfo: any;
  dataSource: any[];
  displayedColumns: string[] = [
    "cardNumber",
    "type",
    "amount",
    "txnDate",
    "actions",
  ];

  form: FormGroup;
  pristine: boolean;

  constructor(
    private router: Router,
    private transactionService : TransactionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {
    this.getTransactionHistoryByClientId(data.clientId);
}

  ngOnInit() {

  }

routeToViewDetail(tranId: string, remainValue: string){
  this.router.navigate(["/transaction/create"], {
    queryParams: {
      tranId: tranId,
      remainValue: remainValue,
      type: 'rollTermGetCash',
    },
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

  getTransactionHistoryByClientId(clientId: string) {

    this.transactionService
      .getTransactionHistoryByClientId(clientId)
      .subscribe((result) => {

        this.dataSource = result?.result.listTransaction;

      });
  }


  menuOpened() {
    console.log("menuOpened");
  }

  menuClosed() {
    console.log("menuClosed");
  }


}
