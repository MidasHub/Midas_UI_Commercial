import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DueDayCardTabComponent } from './due-day-card-tab/due-day-card-tab.component';
import { OnRollTermCardTabComponent } from './on-roll-term-card-tab/on-roll-term-card-tab.component';
import { RollTermScheduleTabComponent } from './roll-term-schedule-tab/roll-term-schedule-tab.component';

@Component({
  selector: 'midas-rollTerm-schedule-transaction',
  templateUrl: './rollTerm-schedule-transaction.component.html',
  styleUrls: ['./rollTerm-schedule-transaction.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RollTermScheduleTransactionComponent implements OnInit {

  @ViewChild(OnRollTermCardTabComponent) private onRollTermCardTabComponent!: OnRollTermCardTabComponent;
  @ViewChild(DueDayCardTabComponent) private dueDayCardTabComponent!: DueDayCardTabComponent;
  @ViewChild(RollTermScheduleTabComponent) private rollTermScheduleTabComponent!: RollTermScheduleTabComponent;

  constructor(
    public dialog: MatDialog,
  ) {

  }
  ngOnInit(): void {

  }

  changeTabTransaction(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this.rollTermScheduleTabComponent.getRollTermScheduleAndCardDueDayInfo(); // Or whatever name the method is called

    } else {  if (event.index === 1) {
        this.dueDayCardTabComponent.getRollTermScheduleAndCardDueDayInfo(); // Or whatever name the method is called

      } else {
        this.onRollTermCardTabComponent.getOnCardDueDayInfo(); // Or whatever name the method is called

      }
    }
  }
}
