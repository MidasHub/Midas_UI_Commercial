import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { BookingService } from 'app/booking-manage/booking.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { AlertService } from 'app/core/alert/alert.service';
import { TransactionService } from '../../../transaction.service';

@Component({
  selector: 'midas-create-roll-term-schedule-dialog',
  templateUrl: './create-roll-term-schedule-dialog.component.html',
  styleUrls: ['./create-roll-term-schedule-dialog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateRollTermScheduleDialogComponent implements OnInit {
  expandedElement: any;
  requestAmount: any;
  info: any;
  totalBookingAmount = 0;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['transaction', 'txnDate', 'amount', 'actions'];
  transactionInfo: any;
  listRollTermBooking: any[] = [];
  form: FormGroup;
  pristine?: boolean;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private transactionService: TransactionService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.info = data;
    this.info.feeAmount = 0;
    this.dataSource = new MatTableDataSource();

    this.form = this.formBuilder.group({
      requestAmount: ['', Validators.required],
      feeRate: ['', Validators.required],
      rollTermBooking: ['', Validators.required],
    });
    this.form.get('feeRate')?.valueChanges.subscribe((value) => {
      this.calculateFee();
    });

    this.form.get('requestAmount')?.valueChanges.subscribe((value) => {
      this.listRollTermBooking = [];
      this.dataSource.data = this.listRollTermBooking;
      for (let index = 0; index < 4; index++) {
        const amountOnPerBooking = value * 0.25;
        const BookingRollTerm = {
          txnDate: new Date(),
          amountBooking: amountOnPerBooking,
        };
        this.listRollTermBooking.push(BookingRollTerm);
      }

      this.dataSource.data = this.listRollTermBooking;
      this.totalBookingAmount = value;
      this.calculateFee();

      this.form.get('rollTermBooking')?.setValue(this.listRollTermBooking);
    });
  }

  ngOnInit() {}

  calculateTotalBookingAmount() {
    let totalBookingAmountTmp = 0;
    let lastBookingAmountExceptLast = 0;
    let index = 0;
    this.listRollTermBooking.forEach((booking: any) => {
      if (index < this.listRollTermBooking.length - 1) {
        lastBookingAmountExceptLast += booking.amountBooking;
        index++;
      }
    });

    this.listRollTermBooking[this.listRollTermBooking.length - 1].amountBooking =
      this.form.get('requestAmount')?.value - lastBookingAmountExceptLast;
    this.listRollTermBooking.forEach((booking: any) => {
      totalBookingAmountTmp += booking.amountBooking;
    });

    this.totalBookingAmount = totalBookingAmountTmp;
    this.dataSource.data = this.listRollTermBooking;
  }

  addBookingRow () {
    const BookingRollTerm = {
      txnDate: new Date(),
      amountBooking: 0,
    };
    this.listRollTermBooking.push(BookingRollTerm);
    this.calculateTotalBookingAmount();
  }

  removeBookingRow(index: number) {
    this.listRollTermBooking.forEach((rollTerm: any) => {
      const indexMember = this.listRollTermBooking.findIndex((elementIdex: any) => elementIdex === rollTerm);

      if (indexMember === index) {
        this.listRollTermBooking.splice(
          this.listRollTermBooking.findIndex((item: any) => item === rollTerm),
          1
        );
      }
    });
    this.calculateTotalBookingAmount();
  }

  calculateFee () {

    if (this.form.invalid) {
      return;
    }
    const requestAmount =  this.form.get('requestAmount')?.value ;
    const feeRate =  this.form.get('feeRate')?.value;
    this.info.feeAmount = (requestAmount * feeRate / 100).toFixed(0) ;
  }
}
