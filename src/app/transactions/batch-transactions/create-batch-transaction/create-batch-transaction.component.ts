import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddFeeDialogComponent} from '../../dialog/add-fee-dialog/add-fee-dialog.component';
import {AddRowCreateBatchTransactionComponent} from '../../dialog/add-row-create-batch-transaction/add-row-create-batch-transaction.component';
import {CreateCardBatchTransactionComponent} from '../../dialog/create-card-batch-transaction/create-card-batch-transaction.component';

@Component({
  selector: 'midas-create-batch-transaction',
  templateUrl: './create-batch-transaction.component.html',
  styleUrls: ['./create-batch-transaction.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateBatchTransactionComponent implements OnInit {
  dataSource: any[] = [];
  formFilter: FormGroup;
  displayedColumns: any[] = ['clientName', 'productId', 'rate',
    'amount', 'terminalId', 'requestAmount', 'amountTransaction',
    'fee', 'CM', 'batchNo', 'tid', 'terminalAmount', 'actions'
  ];
  expandedElement: any;
  accountFilter: any[] = [];
  accountsShow: any[] = [];
  options: any[] = [];

  constructor(private formBuilder: FormBuilder,
              public dialog: MatDialog) {
    this.formFilter = this.formBuilder.group({
      'chose': ['']
    });
  }

  ngOnInit(): void {
  }

  sortData(sort: any) {
    this.accountFilter = this.accountFilter.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const key = sort.active;
      return this.compare(a[key], b[key], isAsc);
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  addRow() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(AddRowCreateBatchTransactionComponent, dialogConfig);
    dialog.afterClosed().subscribe(data => {
      if (data && data.status) {
      }
    });
  }

  addCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(CreateCardBatchTransactionComponent, dialogConfig);
    dialog.afterClosed().subscribe(data => {
      if (data && data.status) {
      }
    });
  }
}
