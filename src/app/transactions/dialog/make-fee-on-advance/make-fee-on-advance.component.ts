import {Component, Inject, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TransactionService} from '../../transaction.service';
import {AlertService} from '../../../core/alert/alert.service';
import {ClientsService} from '../../../clients/clients.service';

@Component({
  selector: 'midas-make-fee-on-advance',
  templateUrl: './make-fee-on-advance.component.html',
  styleUrls: ['./make-fee-on-advance.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MakeFeeOnAdvanceComponent implements OnInit {
  displayedColumns: any[] = ['txnSavingResource', 'createdDate', 'txnSavingType',
    'txnPaymentCode', 'txnSavingId', 'paidAmount'];
  expandedElement: any;
  formDialog: FormGroup;
  advanceCashPaidFees: any[] = [{
    value: '0',
    label: 'Chi tiền ứng'
  },
    {
      value: '1',
      label: 'Chi cấn trừ phí, kết lô'
    }];
  typeAdvanceCashFees: any[] = [{
    value: '0',
    label: 'Ứng tiền'
  },
    {
      value: '1',
      label: 'Chi ứng tiền cấn trừ phí, kết lô'
    }];
  clientAccountsTeller: any[] = [];
  transactions: any[] = [];
  batchTxnName: any;

  constructor(public dialogRef: MatDialogRef<MakeFeeOnAdvanceComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private transactionService: TransactionService,
              private clientService: ClientsService,
              private alterService: AlertService) {
    console.log({data: this.data});
    this.batchTxnName = this.data.batchTxnName;
    this.formDialog = this.formBuilder.group({
      'amountPaid': [''],
      // 'advanceCashPaidFee': [''],
      'isAdvance': [''],
      'savingAccountPaid': [''],
    });
  }

  ngOnInit(): void {
    this.transactionService.getListFeeSavingTransaction(this.batchTxnName).subscribe(result => {
      console.log(result);
      this.transactions = result?.result?.listTransactionAlready;
    });
    this.clientService.getClientOfStaff().subscribe(result => {
      this.clientService.getClientAccountData(result?.result?.clientId).subscribe((result1: any) => {
        this.clientAccountsTeller = result1?.savingsAccounts;
      });
    });
  }

  submitForm() {
    if (this.formDialog.invalid) {
      return this.formDialog.markAllAsTouched();
    }
    const form = this.formDialog.value;
    const formData = {
      'txnCode': this.batchTxnName,
      ...form
    };
    console.log(formData);
    this.transactionService.makeFeeOnAdvanceExecute(formData).subscribe(result => {
      if (Number(result?.status) === 200) {
        this.alterService.alert({
          message: 'Ứng tiền thành công',
          msgClass: 'cssSuccess'
        });
        return this.dialogRef.close({status: true});
      } else {
        return this.alterService.alert({
          message: String(result?.error),
          msgClass: 'cssDanger'
        });
      }
    });
  }

  addRow() {

  }
}
