/** Angular Imports */
import {Injectable, EventEmitter} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Custom Model */
import {Alert} from './alert.model';

/**
 * Alert service.
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  /** Alert event. */
  public alertEvent: EventEmitter<Alert>;

  /**
   * Initializes alert event.
   */
  constructor(private snackBar: MatSnackBar) {
    this.alertEvent = new EventEmitter();
  }

  /**
   * Emits an alert event.
   * @param {Alert} alertEvent Alert event.
   */
  alert(alertEvent: Alert) {
    this.alertEvent.emit(alertEvent);
  }

  alertMsg(alertMsg: string, lblClose: string = 'Đóng', extraClass?: string) {
    this.snackBar.open(alertMsg, lblClose, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [extraClass],

    });
  }

}
