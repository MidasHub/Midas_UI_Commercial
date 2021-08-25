import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TerminalsService } from '../terminals.service';
import { ErrorDialogComponent } from 'app/shared/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { BanksService } from 'app/banks/banks.service';
import { AlertService } from 'app/core/alert/alert.service';
import { SavingsService } from 'app/savings/savings.service';
import { filter } from 'lodash';
export interface PeriodicElements {
  officeId: number;
  officeName: string;
  cardCode: string;
  cardDescription: string;
  costPercentage: number;
  cogsPercentage: number;
  txnRateMin: number;
  txnRateMax: number;
  maxLimitAmount: number;
  levelLimit: number;
  limitAmount: number;
}
const initialData: PeriodicElements[] = [
  {
    officeId: 0,
    officeName: 'NaN',
    cardCode: 'NaN',
    cardDescription: 'NaN',
    costPercentage: 0,
    cogsPercentage: 0,
    txnRateMin: 0,
    txnRateMax: 0,
    maxLimitAmount: 0,
    levelLimit: 0,
    limitAmount: 0,
  },
];
@Component({
  selector: 'midas-create-terminals',
  templateUrl: './create-terminals.component.html',
  styleUrls: ['./create-terminals.component.scss'],
})
export class CreateTerminalsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort | any;
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'Office',
    'CardType',
    'FeeCost',
    'FeePOS',
    'FeeMin',
    'FeeMax',
    'MaxLimitAmountTransaction',
    'LevelTransactionCard',
  ];

  dataSource = new MatTableDataSource(initialData);
  createTerminalForm!: FormGroup;
  offices: any;
  terminalData: any;
  merchants: any;
  cardTypes: any;
  posGroups: any;
  ItemPosLimitList: any;
  ItemPos: any;
  data: any;
  banks: any[] = [];
  posLimits: PeriodicElements[] = [];
  typeOfTransactions: TypeOfTransaction[] = [
    {value: 'ALL', valueDesc: 'khách hàng Sỉ & Lẻ'},
    {value: 'SI', valueDesc: 'khách hàng Sỉ'},
    {value: 'LE', valueDesc: 'khách hàng Lẻ'}
  ];

  applyFeeForOffice = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private terminalsService: TerminalsService,
    private router: Router,
    private alertService: AlertService,
    private _location: Location,
    private bankService: BanksService,


  ) {

    this.route.data.subscribe((data: { terminalData?: any }) => {
      this.merchants = data.terminalData.result.merchants;
    });

    this.bankService.getListOfficeCommon().subscribe((offices: any) => {
      this.offices = offices.result.listOffice;
    });

    this.bankService.gerListBank().subscribe(result => {
      this.banks = result?.result?.listBank;

    });

    this.bankService.getCardType().subscribe(result => {
      this.cardTypes = result?.result?.listCardType;

    });

  }

  ngOnInit(): void {
    this.createEditTerminalForm();
  }

  createEditTerminalForm() {
    this.createTerminalForm = this.formBuilder.group({
      terminalId: ['', [Validators.required, Validators.pattern('^([^!@#$%^&*()+=<>,.?/]*)$')]],
      terminalCode: ['', [Validators.required]],
      terminalName: ['', [Validators.required]],
      merchantId: ['', [Validators.required]],
      officeId: ['', [Validators.required]],
      bankCode: ['', [Validators.required]],
      timeChargeValid: ['', [Validators.required, Validators.min(1)]],
      status: [true],
      isMappingBill: [true],
      minFeeDefault: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]],
      costPercentage: ['', [Validators.max(100), Validators.min(0)]],
      cogsPercentage: ['', [Validators.max(100), Validators.min(0)]],
      txnRateMin: ['', [Validators.max(100), Validators.min(0)]],
      txnRateMax: ['', [Validators.max(100), Validators.min(0)]],
      maxLimitAmount: ['', [Validators.required, Validators.min(1000000), Validators.max(100000000000)]],
      levelLimit: ['', [Validators.required, Validators.min(1)]],
      limitAmount: ['', [Validators.required, Validators.min(1000000), Validators.max(100000000000)]],
      officeSelect: [''],
      typeOfTransaction: ['ALL'],
      banksCheck: [[]],
      cardsCheck: [[]],
    });
    this.createTerminalForm.get('terminalId')?.valueChanges.subscribe(data => {
      this.createTerminalForm.get('terminalCode')?.setValue(data);
    });
  }

  setDefaultFeeSettingPos() {
    // if (!this.createTerminalForm.valid) {
    //   return false;
    // }
    this.applyFeeForOffice = true;
    const costPercentage = this.createTerminalForm.value.costPercentage;
    const cogsPercentage = this.createTerminalForm.value.cogsPercentage;
    const txnRateMin = this.createTerminalForm.value.txnRateMin;
    const txnRateMax = this.createTerminalForm.value.txnRateMax;
    const maxLimitAmount = this.createTerminalForm.value.maxLimitAmount;
    const levelLimit = this.createTerminalForm.value.levelLimit;
    const limitAmount = this.createTerminalForm.value.limitAmount;
    this.posLimits = [];
    this.offices.forEach((office: any) => {
      this.cardTypes.forEach((card: any) => {
        const limit = {
          officeId: office.officeId,
          officeName: office.name,
          cardCode: card.code,
          cardDescription: card.description,
          costPercentage: costPercentage,
          cogsPercentage: cogsPercentage,
          txnRateMin: txnRateMin,
          txnRateMax: txnRateMax,
          maxLimitAmount: maxLimitAmount,
          levelLimit: levelLimit,
          limitAmount: limitAmount,
        };
        this.posLimits.push(limit);
      });
    });
    this.dataSource.data = this.posLimits;
    this.dataSource.sort = this.sort;
  }

  applyFilter(e: Event) {
    // TODO: Chỗ này cần chuyển thành biết Event, rồi trong hàm filter mới check để làm filter
    let filterValue = (<HTMLInputElement>e.target).value || '';
    if (filterValue) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    }
  }

  submit(): any {
    if (!this.createTerminalForm.valid) {
      return false;
    }
    const formData = this.createTerminalForm.value;
    formData.status = formData.status  === true ? 'A' : 'D';
    formData.isMappingBill = formData.isMappingBill  === true ? 1 : 0;

    const data = {
      ...this.createTerminalForm.value,
      dateFormat: 'dd/MM/yyyy',
      listLimit: JSON.stringify(this.dataSource.data),
    };

    this.terminalsService.save(data).subscribe((response: any) => {
      if (response.status !== '200') {

        this.alertService.alert({
          message: `Lỗi xảy ra : ${response.error}`,
          msgClass: 'cssDanger',
          hPosition: 'center',
        });

      } else {
        this.router.navigate(['terminals']);
      }
    });
  }

  validateNumber(event: any, element: any) {
    const name_input = event.target.id;
    let value_input = event.target.value;
    const index = name_input.split('_')[0];

    value_input = value_input.replace(/[^0-9\.]/g, '');
    if (value_input.split('.').length > 2) { value_input = value_input.replace(/\.+$/, ''); }

    const dataCopy = this.dataSource.data;
    const e = element;
    Object.keys(element).forEach( (key) => {
      if (name_input.split('_')[1]  === key) {
        e[key] = Number(value_input);
      }
    });
    dataCopy.splice(index - 1, 1, e);
    this.dataSource.data = dataCopy;
  }

  backClicked() {
    this._location.back();
  }

  setDefaultFeeSettingPosForOffice() {
    const officeId = this.createTerminalForm.value.officeSelect;
    const costPercentage  = this.createTerminalForm.value.costPercentage;
    const cogsPercentage  = this.createTerminalForm.value.cogsPercentage;
    const txnRateMin      = this.createTerminalForm.value.txnRateMin;
    const txnRateMax      = this.createTerminalForm.value.txnRateMax;
    const maxLimitAmount  = this.createTerminalForm.value.maxLimitAmount;
    const levelLimit      = this.createTerminalForm.value.levelLimit;
    const limitAmount  = this.createTerminalForm.value.limitAmount;
    this.posLimits = this.dataSource.data;
    const office = this.offices.find((i: any) => i.officeId === officeId);

    this.cardTypes.forEach((card: any) => {
      const limit = {
        officeId : office.officeId,
        officeName : office.name,
        cardCode : card.code,
        cardDescription : card.description,
        costPercentage : costPercentage,
        cogsPercentage :  cogsPercentage,
        txnRateMin :  txnRateMin,
        txnRateMax :  txnRateMax,
        maxLimitAmount : maxLimitAmount,
        levelLimit : levelLimit,
        limitAmount : limitAmount,
      };
      const item = this.posLimits.findIndex((l: any) => l.officeId === limit.officeId && l.cardCode === limit.cardCode);
      if (item === -1) {
        this.posLimits.push(limit);
      } else {
        this.posLimits[item] = limit;
      }
    });
    this.dataSource.data = this.posLimits;
    this.dataSource.sort = this.sort;
  }
  reset() {
      this.dataSource.data = [];
      this.createTerminalForm.reset();
      this.applyFeeForOffice = false;
      // this.cdr.detectChanges();
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    }
}

interface TypeOfTransaction {
  value: string;
  valueDesc: string;
}
