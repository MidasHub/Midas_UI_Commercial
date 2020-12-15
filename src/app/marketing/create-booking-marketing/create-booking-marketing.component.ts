import {Component, OnInit} from '@angular/core';
import {MarketingServices} from '../marketing.services';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../core/alert/alert.service';
import {MoneyPipe} from '../../pipes/money.pipe';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'midas-create-booking-marketing',
  templateUrl: './create-booking-marketing.component.html',
  styleUrls: ['./create-booking-marketing.component.scss']
})
export class CreateBookingMarketingComponent implements OnInit {
  fromGroup: FormGroup;
  minDate = new Date(2000, 0, 1);
  /** Maximum closing date allowed. */
  maxDate = new Date();
  displayedCardColumns = ['cardType', 'costRate', 'cogsRate', 'minRate'];
  cards: any[] = [];
  offices = [
    'Carrots',
    'Tomatoes',
    'Onions',
    'Apples',
    'Avocados'
  ];

  officeIds = [
    'Oranges',
    'Bananas',
    'Cucumbers'
  ];
  filterOffice = '';
  labelPosition: 'before' | 'after' = 'after';
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  constructor(private marketingServices: MarketingServices,
              public dialog: MatDialog,
              private alterService: AlertService,
              private money: MoneyPipe,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.fromGroup = this.formBuilder.group({
      'PosCampaignName': [''],
      'fromDate': [''],
      'notifyDate': [''],
      'toDate': [''],
      'secondRemain': [''],
      'budget': [''],
      'cashRule': ['']
    });
  }

  minDateTo() {
    return this.fromGroup.get('fromDate').value ? this.fromGroup.get('fromDate').value : new Date().toDateString();
  }

}
