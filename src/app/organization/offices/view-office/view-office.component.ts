/** Angular Imports */
import { Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

/**
 * View Office Component
 */
@Component({
  selector: 'mifosx-view-office',
  templateUrl: './view-office.component.html',
  styleUrls: ['./view-office.component.scss']
})
export class ViewOfficeComponent {

  /** Office datatables data */
  officeDatatables: any;

  /**
   * Fetches office datatables from `resolve`
   * @param {ActivatedRoute} route Activated Route
   */
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { officeDatatables: any } |Data) => {
      this.officeDatatables = data.officeDatatables;
    });
  }

}
