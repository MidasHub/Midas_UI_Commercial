import {Component, OnInit} from '@angular/core';
import {BanksService} from '../banks.service';

@Component({
  selector: 'midas-card-bank-view',
  templateUrl: './card-bank-view.component.html',
  styleUrls: ['./card-bank-view.component.scss']
})
export class CardBankViewComponent implements OnInit {
  banks: any[] = [];
  cards: any[] = [];
  cardTypes: any[] = [];
  textSearch: string;
  dataStore: any[] = [];

  constructor(private banksServices: BanksService) {
  }

  ngOnInit(): void {
    this.banksServices.getCards().subscribe(result => {
      this.banks = result?.result?.listBank;
      this.cards = result?.result?.ListBinCodeEntity;
      this.banks.map(bank => {
        bank.cards = this.cards.filter((v: any) => v.bankCode === bank.bankCode);
      });
      this.cardTypes = result?.result?.listCardType;
      this.filterData();
      console.log('cards', this.banks);
      console.log('cardTypes', this.cardTypes);
    });
  }

  filterData() {
    console.log(this.textSearch);
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
}
