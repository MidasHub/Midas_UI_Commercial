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
  office_selected_right: any;
  office_selected_left: any;
  pos_selected_right: any;
  pos_selected_left: any;
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
    this.marketingServices.getCampaignTemplate().subscribe(result => {
      this.cards = result?.result?.listCardType;
    });
  }

  minDateTo() {
    return this.fromGroup.get('fromDate').value ? this.fromGroup.get('fromDate').value : new Date().toDateString();
  }

  changeOffices(type: any, b: any) {
    if (type === 'all') {
      if (b === 'left') {
        this.officeIds = [...this.officeIds, ...this.offices];
        this.offices = [];
      } else {
        this.offices = [...this.offices, ...this.officeIds];
        this.officeIds = [];
      }
    } else {
      if (b === 'left' && this.office_selected_left) {
        this.officeIds = [...this.officeIds, this.office_selected_left];
        this.offices = this.offices.filter(v => v !== this.office_selected_left);
        this.office_selected_left = null;
      } else {
        this.offices = [...this.offices, this.office_selected_right];
        this.officeIds = this.officeIds.filter(v => v !== this.office_selected_right);
        this.office_selected_right = null;
      }
    }
  }

  setOfficeSelect(item: any, b: string) {
    if (b === 'left') {
      this.office_selected_left = item;
      this.office_selected_right = null;
    } else {
      this.office_selected_left = null;
      this.office_selected_right = item;
    }
  }
}
