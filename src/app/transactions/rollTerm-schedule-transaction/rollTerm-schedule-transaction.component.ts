import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TransactionService } from "../transaction.service";
import { MatPaginator } from "@angular/material/paginator";
import { DatePipe } from "@angular/common";
import { SettingsService } from "../../settings/settings.service";
import { AuthenticationService } from "../../core/authentication/authentication.service";
import { MatSort } from "@angular/material/sort";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { SavingsService } from "../../savings/savings.service";
import { SystemService } from "../../system/system.service";
import { CentersService } from "../../centers/centers.service";
import { AlertService } from "../../core/alert/alert.service";
import { MatDialog } from "@angular/material/dialog";
import { ClientsService } from "../../clients/clients.service";
import { FormfieldBase } from "../../shared/form-dialog/formfield/model/formfield-base";
import { FormDialogComponent } from "../../shared/form-dialog/form-dialog.component";
import { InputBase } from "../../shared/form-dialog/formfield/model/input-base";

@Component({
  selector: "midas-rollTerm-schedule-transaction",
  templateUrl: "./rollTerm-schedule-transaction.component.html",
  styleUrls: ["./rollTerm-schedule-transaction.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class RollTermScheduleTransactionComponent implements OnInit {

  constructor(

    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {

  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {

  }


}
