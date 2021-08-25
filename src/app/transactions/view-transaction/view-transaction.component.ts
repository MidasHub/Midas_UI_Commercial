/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../transaction.service';

/**
 * transaction Component.
 */
@Component({
  selector: 'midas-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss'],
})
export class ViewTransactionComponent implements OnInit {
  transactionInfo: any = {};
  terminalFee: any = {};
  isLoading = false;

  /**
   * @param {AuthenticationService} authenticationService Authentication Service
   * @param {UserService} userService Users Service
   * @param {MatDialog} dialog Mat Dialog
   */
  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params: any) => {

      const tranId = params.get('tranId');
      this.isLoading = true;
      this.transactionService.getTransactionDetail(tranId).subscribe((data: any) => {

        this.isLoading = false;
        this.transactionInfo = data.result.detailTransactionDto;
        this.transactionInfo.requestAmount = this.formatCurrency(this.transactionInfo.requestAmount);
        this.transactionInfo.invoiceAmount = this.formatCurrency(this.transactionInfo.invoiceAmount);
        this.transactionInfo.terminalAmount = this.formatCurrency(this.transactionInfo.terminalAmount);

      });
    });
  }



  downloadVoucherTransaction() {
    this.transactionService.downloadVoucher(this.transactionInfo.refId);
  }

  formatCurrency(value: string) {
    value = String(value);
    const neg = value.startsWith('-');
    value = value.replace(/[-\D]/g, '');
    value = value.replace(/(\d{3})$/, ',$1');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    value = value !== '' ? '' + value : '';
    if (neg) {
      value = '-'.concat(value);
    }

    return value;
  }
}
