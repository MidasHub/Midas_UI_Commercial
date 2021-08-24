import { Component, OnInit } from '@angular/core';
const dumbData = [
  {
    cardNO: 'Thẻ 1234-X-1235',
    remainAdvance: '12.000.000',
    totalValue: '50.000.000',
    paidValue: '38.000.000',
    remainValue: '12.000.000',
    collectedValue: '36.000.000',
    needCollecting: '2.000.000',
  },
  {
    cardNO: 'Thẻ 1234-X-1235',
    remainAdvance: '12.000.000',
    totalValue: '50.000.000',
    paidValue: '38.000.000',
    remainValue: '12.000.000',
    collectedValue: '36.000.000',
    needCollecting: '2.000.000',
  },
  {
    cardNO: 'Thẻ 1234-X-1235',
    remainAdvance: '12.000.000',
    totalValue: '50.000.000',
    paidValue: '38.000.000',
    remainValue: '12.000.000',
    collectedValue: '36.000.000',
    needCollecting: '2.000.000',
  },
  {
    cardNO: 'Thẻ 1234-X-1235',
    remainAdvance: '12.000.000',
    totalValue: '50.000.000',
    paidValue: '38.000.000',
    remainValue: '12.000.000',
    collectedValue: '36.000.000',
    needCollecting: '2.000.000',
  },
];

@Component({
  selector: 'midas-rollterm-list',
  templateUrl: './rollterm-list.component.html',
  styleUrls: ['./rollterm-list.component.scss'],
})
export class RolltermListComponent implements OnInit {
  constructor() {}
  panelOpenState = false;
  data = dumbData;

  ngOnInit(): void {}
}
