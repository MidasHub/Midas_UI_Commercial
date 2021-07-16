import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
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
import { DOCUMENT } from '@angular/common';

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
              private dialog: MatDialog,
              @Inject(DOCUMENT) private _document: Document) {
  }

  setEditBank() {
    this.edit_bank = !this.edit_bank;
    this.nameBank.setValue(this.bank_active.bankName);
  }

  createBank() {
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'bank_name',
        label: 'Tên',
        value: '',
        type: 'text',
        required: true
      }),
      new InputBase({
        controlName: 'bank_code',
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
        this.banksServices.createBank(value.bank_code, value.bank_name).subscribe(rp => {
          if (rp?.status === 200) {
            this.alertService.alert({message: 'Thêm ngân hàng thành công.', msgClass: 'cssSuccess'});
            value.refid = rp.insertId;
            this.banksServices.addBank(value);
          }
        });
      }
    });
  }

  createCard(card: any) {
    let formfields;
    formfields = [
      new SelectBase({
        controlName: 'bank_code',
        label: 'Ngân hàng',
        value: card ? card.bank_code : this.bank_active.bank_code,
        options: {label: 'bank_name', value: 'bank_code', data: this.banks},
        required: card ? true : false,
        disabled: card ? false : true
      }),
      new SelectBase({
        controlName: 'card_type',
        label: 'Loại',
        value: card ? card.card_type : '',
        options: {label: 'description', value: 'code', data: this.cardTypes},
        required: false,
        disabled: card ? true : false,
      }),
      new InputBase({
        controlName: 'bincode',
        label: 'Bin Code',
        value: card ? card.bincode : '',
        type: 'text',
        maxLength: 6,
        minLength: 6,
        required: card ? false : true,
        disabled: card ? true : false,

      }),
      new InputBase({
        controlName: 'card_class',
        label: 'Class',
        value: card ? card.card_class : '',
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

          const bincode = formData.bincode;
          for (const typeCard of this.cardTypes) {
            if (String(bincode).startsWith(String(typeCard.code_digit))) {
              formData.cardType = typeCard.code;
            }
          }
        }
        this.banksServices.storeBinCode(formData.bincode, formData.bank_code, formData.card_type || '', formData.card_class || '').subscribe(rp => {
          if (rp.status === 200) {
            this.alertService.alert({message: 'Thêm thẻ thành công', msgClass: 'cssSuccess'});
            formData.refid = rp.insertId;
            console.log("formData: ", formData);
            this.banksServices.addCard(formData);
          }
        });
      }
    });
  }

  editCard(card: any) {
    let formfields;
    formfields = [
      new SelectBase({
        controlName: 'bank_code',
        label: 'Ngân hàng',
        value: card ? card.bank_code : this.bank_active.bank_code,
        options: {label: 'bank_name', value: 'bank_code', data: this.banks},
        required: card ? true : false,
        disabled: false
      }),
      new SelectBase({
        controlName: 'card_type',
        label: 'Loại',
        value: card ? card.card_type : '',
        options: {label: 'description', value: 'code', data: this.cardTypes},
        required: false,
        disabled: false,
      }),
      new InputBase({
        controlName: 'bincode',
        label: 'Bin Code',
        value: card ? card.bincode : '',
        type: 'text',
        maxLength: 6,
        minLength: 6,
        required: card ? false : true,
        disabled: false,

      }),
      new InputBase({
        controlName: 'card_class',
        label: 'Class',
        value: card ? card.card_class : '',
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

          const bincode = formData.bincode;
          for (const typeCard of this.cardTypes) {
            if (String(bincode).startsWith(String(typeCard.code_digit))) {
              formData.cardType = typeCard.code;
            }
          }
        }
        this.banksServices.updateBinCode(card.refid, formData.bincode, formData.bank_code, formData.card_type || '', formData.card_class || '').subscribe(rp => {
          if (rp.data === 200) {
            this.alertService.alert({message: 'Cập nhập thông tin thẻ thành công', msgClass: 'cssSuccess'});
            card = {...card, ...formData};
            this.banksServices.updateCard(card);
          }
        });
      }
    });
  }

  saveBank() {
    const bankName = this.nameBank.value;
    this.banksServices.storeBank(this.bank_active.refid, bankName).subscribe(result => {
      if (result.data === 200) {
        this.alertService.alert({message: 'Cập nhập thông tin thành công', msgClass: 'cssSuccess'});
        this.bank_active.bank_name = bankName;
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
      this.dataStore = this.banks.filter(value => String(value.bank_name).toLowerCase().indexOf(this.textSearch) !== -1 || String(value.bank_code).toLowerCase().indexOf(this.textSearch) !== -1);
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

  refreshPage() {
    this._document.defaultView.location.reload();
  }
}
