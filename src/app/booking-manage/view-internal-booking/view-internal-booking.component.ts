import { Component, ViewChild } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { BranchBookingTabComponent } from "./branch-booking-tab/branch-booking-tab.component";
import { InternalBookingTabComponent } from "./internal-booking-tab/internal-booking-tab.component";
import { RollTermScheduleBookingTabComponent } from "./roll-term-schedule-booking-tab/roll-term-schedule-booking-tab.component";

@Component({
  selector: "midas-view-internal-booking",
  templateUrl: "./view-internal-booking.component.html",
  styleUrls: ["./view-internal-booking.component.scss"],
})
export class ViewInternalBookingComponent {
  @ViewChild(InternalBookingTabComponent) private internalBookingTabComponent: InternalBookingTabComponent;
  @ViewChild(RollTermScheduleBookingTabComponent)
  private rollTermScheduleBookingTabComponent: RollTermScheduleBookingTabComponent;
  @ViewChild(BranchBookingTabComponent)
  private branchBookingTabComponent: BranchBookingTabComponent;

  constructor() {}

  changeTabTransaction(event: MatTabChangeEvent): void {
    if (event.index == 0) {
      this.internalBookingTabComponent.getBookingInternal();
    } else {
      if (event.index == 1) {
        this.rollTermScheduleBookingTabComponent.getBookingInternal();
      } else {
        if (event.index == 2) {
          this.branchBookingTabComponent.getBookingInternal();
        }
      }


    }
  }
}
