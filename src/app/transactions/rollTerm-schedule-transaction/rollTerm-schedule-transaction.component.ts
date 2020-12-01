import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

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

}
