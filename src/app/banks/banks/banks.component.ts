import {Component, OnInit} from '@angular/core';
import {BanksService} from '../banks.service';

@Component({
  selector: 'midas-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {
  banks: any[] = [];
  cards: any[] = [];
  cardTypes: any[] = [];
  textSearch: string;
  dataStore: any[] = [];
  centered = false;
  disabled = false;
  unbounded = false;

  radius: number;
  color: string;

  constructor(private banksServices: BanksService) {
  }

  ngOnInit(): void {
    this.banksServices.getCards().subscribe(result => {
      if (result) {
        this.cards = result;
      }
    });
    this.banksServices.getBanks().subscribe(result => {
      console.log('result', result);
      if (result) {
        this.banks = result;
        this.filterData();
      }
    });
    this.banksServices.getCardTypes().subscribe(result => {
      if (result) {
        this.cardTypes = result;
      }
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
