import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'midas-third-party',
  templateUrl: './third-party.component.html',
  styleUrls: ['./third-party.component.scss']
})
export class ThirdPartyComponent implements OnInit {

  selectedIndex: number = 0;
  
  constructor(){}
  ngOnInit(): void {
  }

  changeTab(index:number){
    this.selectedIndex = index;
  }
  
  onTabChanged = (tabChangeEvent: MatTabChangeEvent): void => { 
    this.selectedIndex = tabChangeEvent.index;
  }
}
