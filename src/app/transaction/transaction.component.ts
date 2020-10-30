/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionService } from './transaction.service';
/** Custom Services */
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { ChangePasswordDialogComponent } from 'app/shared/change-password-dialog/change-password-dialog.component';
import { UserService } from 'app/self-service/users/user.service';
/**
 * transaction Component.
 */
@Component({
  selector: 'mifosx-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  /** Roles Table Datasource */
  listTerminal: any[] = [];
  /** Columns to be displayed in user roles table. */
  displayedColumns: string[] = ['role', 'description'];

  /**
   * @param {AuthenticationService} authenticationService Authentication Service
   * @param {UserService} userService Users Service
   * @param {Router} router Router
   * @param {MatDialog} dialog Mat Dialog
   */
  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private router: Router,
              private transactionService: TransactionService,
              public dialog: MatDialog) {

  }

  ngOnInit() {

  }

  getTerminalListEnoughBalance(amountTransaction: string){
    let amount =  this.formatLong(amountTransaction);
    this.transactionService.getTransactionTemplate(amount).subscribe((data: any) =>{
      this.listTerminal = data.result.listTerminal;
    });
  }

  formatCurrency(value: string){
      value = String(value) ;
      const neg = value.startsWith('-');

      value = value.replace(/[-\D]/g,'');
      value = value.replace(/(\d{3})$/, ',$1');
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

      value = value != ''?''+value:'';
      if(neg) value = '-'.concat(value);

      return value;
  }

  formatLong(value: string){
    value = String(value) ;
    const neg = value.startsWith('-');
    value = value.replace(/[^0-9]+/g, "");
    if(neg) value = '-'.concat(value);
    return parseInt(value);
}

}
