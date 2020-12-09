import {Component, OnInit} from '@angular/core';
import {MarketingServices} from '../marketing.services';
import {FormControl} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'midas-view-booking-marketing',
  templateUrl: './view-booking-marketing.component.html',
  styleUrls: ['./view-booking-marketing.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewBookingMarketingComponent implements OnInit {
  campaigns: any[] = [];
  filterCampaign = new FormControl('');
  campaign: any;
  sumBooking = 0;
  displayedCardColumns: any[] = ['cardType', 'costRate', 'cogsRate', 'minRate'];
  cards: any[] = [];
  displayedColumns: any[] = ['createdDate', 'officeId', 'userIdStaff', 'userNameTelegram',
  'bookingAmount'];
  expandedElement: any;
  booking: any[] = [];

  constructor(private marketingServices: MarketingServices) {
  }

  ngOnInit(): void {
    this.marketingServices.getCampaign().subscribe(result => {
      this.campaigns = result?.result?.listPosCampaignLimit;
      this.campaign = this.campaigns[0];
      this.filterCampaign.setValue(this.campaign);
      this.cards = this.campaign.listPosRateCampainEntities;
      this.getBooking();
    });
    this.filterCampaign.valueChanges.subscribe(result => {
      this.campaign = result;
      this.getBooking();
    });
  }

  getBooking() {
    this.marketingServices.getBooking(this.campaign.campaign.refid).subscribe(result => {
      this.booking = result?.result?.listCampaignBooking;
    });
  }
}
