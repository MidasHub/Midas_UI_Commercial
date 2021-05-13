import {Component, OnInit} from '@angular/core';
import {MarketingServices} from '../marketing.services';
import {FormControl} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddFeeDialogComponent} from '../../transactions/dialog/add-fee-dialog/add-fee-dialog.component';
import {CreateTransactionBookingComponent} from '../dialog/create-transaction-booking/create-transaction-booking.component';
import {AlertService} from '../../core/alert/alert.service';
import {ConfirmDialogComponent} from '../../transactions/dialog/confirm-dialog/confirm-dialog.component';
import {MoneyPipe} from '../../pipes/money.pipe';

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
    'bookingAmount', 'actions'];
  expandedElement: any;
  booking: any[] = [];

  constructor(private marketingServices: MarketingServices,
              public dialog: MatDialog,
              private alterService: AlertService,
              private money: MoneyPipe) {
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

  addBookingDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      booking: false
    };
    dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(CreateTransactionBookingComponent, dialogConfig);
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.marketingServices.createBooking(this.campaign.campaign.refid, result.userNameTelegram, result.bookingAmount).subscribe(re => {
          if (re?.result?.status) {
            this.getBooking();
            return this.alterService.alert({message: 'Thêm booking thành công 🎊🎊🎊🎊🎊🎊!', msgClass: 'cssSuccess'});
          }
          return this.alterService.alert({
            message: re?.result?.message || 'Có lỗi xảy ra vui lòng liên hệ IT Support 🆘',
            msgClass: 'cssDanger'
          });
        });
      }
    });
  }

  EditBookingDialog(booking: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      booking: booking
    };
    dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(CreateTransactionBookingComponent, dialogConfig);
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.marketingServices.updateBooking(booking.refid, result.bookingAmount).subscribe(re => {
          if (re?.result?.status) {
            this.getBooking();
            return this.alterService.alert({
              message: 'Update booking thành công 🎊🎊🎊🎊🎊🎊!',
              msgClass: 'cssSuccess'
            });
          }
          return this.alterService.alert({
            message: re?.result?.message || 'Có lỗi xảy ra vui lòng liên hệ IT Support 🆘',
            msgClass: 'cssDanger'
          });
        });
      }
    });
  }

  RemoveBookingDialog(booking: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `💥 💥 💥 Bạn có chắc chắn muốn xóa booking của ${booking.userNameTelegram} với số tiền ${this.money.transform(booking.bookingAmount)}`,
      title: `Xóa booking [${booking.refid}]`
    };
    dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.marketingServices.RemoveBooking(booking.refid).subscribe(re => {
          if (re?.result?.status) {
            this.getBooking();
            return this.alterService.alert({message: 'Thêm booking thành công 🎊🎊🎊🎊🎊🎊!', msgClass: 'cssSuccess'});
          }
          return this.alterService.alert({
            message: re?.result?.message || 'Có lỗi xảy ra vui lòng liên hệ IT Support 🆘',
            msgClass: 'cssDanger'
          });
        });
      }
    });
  }

  getBooking() {
    this.marketingServices.getBooking(this.campaign.campaign.refid).subscribe(result => {
      this.booking = result?.result?.listCampaignBooking;
    });
  }
}
