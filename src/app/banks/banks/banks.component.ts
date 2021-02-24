import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BanksService} from '../banks.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MatSort} from '@angular/material/sort';
import {FormControl} from '@angular/forms';
import {AlertService} from '../../core/alert/alert.service';
import {FormfieldBase} from '../../shared/form-dialog/formfield/model/formfield-base';
import {InputBase} from '../../shared/form-dialog/formfield/model/input-base';
import {DatepickerBase} from '../../shared/form-dialog/formfield/model/datepicker-base';
import {FormDialogComponent} from '../../shared/form-dialog/form-dialog.component';
import {MatDialog, MatDialogState} from '@angular/material/dialog';
import {SelectBase} from '../../shared/form-dialog/formfield/model/select-base';

@Component({
  selector: 'midas-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BanksComponent implements OnInit, AfterViewInit {
  banks: any[] = [];
  cards: any[] = [];
  cardTypes: any[] = [];
  textSearch: string;
  dataStore: any[] = [];
  centered = false;
  disabled = false;
  unbounded = false;
  bank_active: any;
  radius: number;
  color: string;
  expandedElement: any;
  displayedColumns = ['refid', 'binCode', 'cardType', 'edit'];
  cards_active: any;
  edit_bank = false;
  textSearchCard: string;
  nameBank = new FormControl();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private banksServices: BanksService,
              private alertService: AlertService,
              private dialog: MatDialog) {
  }

  setEditBank() {
    this.edit_bank = !this.edit_bank;
    this.nameBank.setValue(this.bank_active.bankName);
  }

  createBank() {
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'bankName',
        label: 'Tên',
        value: '',
        type: 'text',
        required: true
      }),
      new InputBase({
        controlName: 'bankCode',
        label: 'Mã',
        value: '',
        type: 'text',
        required: true
      }),
    ];
    const data = {
      title: `Thêm ngân hàng`,
      layout: {addButtonText: 'Lưu'},
      formfields: formfields
    };
    const dialogBank = this.dialog.open(FormDialogComponent, {data});
    dialogBank.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const value = response.data.value;
        this.banksServices.storeBank(value.bankCode, value.bankName).subscribe(result => {
          if (result?.status === '200') {
            this.alertService.alert({message: 'Thêm ngân hàng thành công.', msgClass: 'cssSuccess'});
            this.banksServices.addBank(value);
          }
        });
      }
    });
  }

  createOrEditCard(card: any) {
    let formfields;
    formfields = [
      new SelectBase({
        controlName: 'bankCode',
        label: 'Ngân hàng',
        value: card ? card.bankCode : this.bank_active.bankCode,
        options: {label: 'bankName', value: 'bankCode', data: this.banks},
        required: card ? true : false,
        disabled: card ? false : true
      }),
      new SelectBase({
        controlName: 'cardType',
        label: 'Loại',
        value: card ? card.cardType : '',
        options: {label: 'description', value: 'code', data: this.cardTypes},
        required: false,
        disabled: true
      }),
      new InputBase({
        controlName: 'binCode',
        label: 'Bin Code',
        value: card ? card.binCode : '',
        type: 'text',
        maxLength: 6,
        minLength: 6,
        required: card ? false : true,
        disabled: card ? true : false,

      }),
      new InputBase({
        controlName: 'cardClass',
        label: 'Class',
        value: card ? card.cardClass : '',
        type: 'text',
        required: false
      }),
    ];
    const data = {
      title: card ? `Cập nhập thông tin thẻ` : 'Thêm thẻ mới',
      layout: {addButtonText: 'Lưu'},
      formfields: formfields,
      cardTypes: this.cardTypes
    };

    const dialogCard = this.dialog.open(FormDialogComponent, {data});
    dialogCard.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const formData = response.data.value;
        if (!card) {

          const binCode = formData.binCode;
          for (const typeCard of this.cardTypes) {
            if (String(binCode).startsWith(String(typeCard.codeDigit))) {
              formData.cardType = typeCard.code;
            }
          }
        }
        this.banksServices.storeBinCode(formData.binCode, formData.bankCode, formData.cardType || '', formData.cardClass || '').subscribe(result => {
          if (result.status === '200') {
            if (card) {
              this.alertService.alert({message: 'Cập nhập thông tin thẻ thành công', msgClass: 'cssSuccess'});
              card = {...card, ...formData};
              this.banksServices.updateCard(card);
            } else {
              this.alertService.alert({message: 'Thêm thẻ thành công', msgClass: 'cssSuccess'});
              this.banksServices.addCard(formData);
            }
            // this.cards_active = this.bank_active.cards;
            // this.getDataSourceCard();
          }
        });
      }
    });
  }

  saveBank() {
    const value = this.nameBank.value;
    this.banksServices.storeBank(this.bank_active.bankCode, value).subscribe(result => {
      if (result.status === '200') {
        this.alertService.alert({message: 'Cập nhập thông tin thành công', msgClass: 'cssSuccess'});
        this.bank_active.bankName = value;
      }
      this.edit_bank = false;
    });
  }

  ngOnInit(): void {
    this.banksServices.getCards().subscribe(result => {
      if (result) {
        this.cards = result;
      }
    });
    this.banksServices.getBanks().subscribe(result => {
      if (result) {
        this.banks = result;
        if (this.bank_active) {
          this.bank_active = this.banks.find((v: any) => v.bankCode === this.bank_active.bankCode);
          this.cards_active = this.bank_active.cards;
        }
        this.filterData();
      }
    });
    this.banksServices.getCardTypes().subscribe(result => {
      if (result) {
        this.cardTypes = result;
      }
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        tap(() => this.getDataSourceCard())
      )
      .subscribe();
  }

  filterData() {
    if (this.textSearch) {
      this.dataStore = this.banks.filter(value => String(value.bankName).toLowerCase().indexOf(this.textSearch) !== -1 || String(value.bankCode).toLowerCase().indexOf(this.textSearch) !== -1);
    } else {
      this.dataStore = this.banks;
    }
  }

  applyFilter(text: string) {
    this.textSearch = String(text).toLowerCase();
    this.filterData();
  }

  setBank(bank: any) {
    if (bank) {
      this.bank_active = bank;
      this.cards_active = this.bank_active.cards;
      this.paginator.pageIndex = 0;
    }
  }

  getDataSourceCard() {
    let pageIndex = 0;
    let pageSize = 10;
    if (this.paginator) {
      pageIndex = this.paginator.pageIndex;
      pageSize = this.paginator.pageSize;
    }
    const limit = pageIndex * pageSize;
    return this.bank_active ? this.cards_active.slice(limit, limit + pageSize) : [];
  }

  getCardTypeName(type: string) {
    return this.cardTypes.find((v: any) => v.code === type)?.description || 'N/A';
  }

  applyFilterCard(text: string) {
    this.textSearchCard = String(text).toLowerCase();
    this.paginator.pageSize = 0;
    this.cards_active = this.bank_active.cards.filter((v: any) => {
      if (!text) {
        return true;
      }
      const keys = Object.keys(v);
      for (const key of keys) {
        if (v[key]) {
          if (String(v[key]).toLowerCase().indexOf(text) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
}
