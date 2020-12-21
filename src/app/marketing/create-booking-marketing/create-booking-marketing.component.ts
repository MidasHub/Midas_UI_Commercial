import {Component, OnInit} from '@angular/core';
import {MarketingServices} from '../marketing.services';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../core/alert/alert.service';
import {MoneyPipe} from '../../pipes/money.pipe';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ClientsService} from '../../clients/clients.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';

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
  displayedCardColumns = ['description', 'costRate', 'cogsRate', 'rate', 'select'];
  cards: any[] = [];
  office_selected_right: any;
  office_selected_left: any;
  pos_selected_right: any;
  pos_selected_left: any;
  poses: any[] = [];
  offices: any[] = [];
  campaign: any;
  officeIds: any[] = [];
  terminalId: any[] = [];
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
              private formBuilder: FormBuilder,
              private clientsServices: ClientsService,
              private router: Router,
              private route: ActivatedRoute) {
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
    this.route.data.subscribe(({id}: any) => {
      if (id) {
        this.marketingServices.getCampaign().subscribe(result => {
          this.campaign = result?.result.listPosCampaignLimit?.find((v: any) => v.campaign.refid === Number(id));
          console.log(this.campaign);

          if (this.campaign) {
            if (this.campaign.listPosSelected) {

            }
            if (this.campaign.listOfficeDtos) {

            }
            console.log(moment(this.campaign.campaign.fromDate).format('DD/MM/YYYY, hh:mm A'));
            this.fromGroup.get('PosCampaignName').setValue(this.campaign.campaign.campainName);
            this.fromGroup.get('fromDate').setValue(moment(this.campaign.campaign.fromDate).toDate());
            this.fromGroup.get('notifyDate').setValue(moment(this.campaign.campaign.timeNotify).toDate());
            this.fromGroup.get('toDate').setValue(moment(this.campaign.campaign.toDate).toDate());
            this.fromGroup.get('secondRemain').setValue(this.campaign.campaign.secondRemain / 60);
            this.fromGroup.get('budget').setValue(this.campaign.campaign.budget);
            this.fromGroup.get('cashRule').setValue(this.campaign.campaign.cashRule);
            this.getCards();
          }
        });
      } else {
        this.getCards();
      }
    });
    this.clientsServices.getOffices().subscribe(resuts => {
      this.offices = resuts;
    });
  }

  getCards() {
    this.marketingServices.getCampaignTemplate().subscribe(result => {
      this.cards = result?.result?.listCardType?.map((card: any) => {
        let default_v = {};
        if (this.campaign) {
          default_v = this.campaign.listPosRateCampainEntities.find((j: any) => j.cardType === card.code);
          if (default_v) {
            default_v['select'] = true;
            default_v['rate'] = default_v['minRate'];
          } else {
            default_v = {};
          }

        }
        console.log(this.campaign);
        const data = {
          ...card,
          costRate: '',
          cogsRate: '',
          rate: '',
          select: false,
          ...default_v
        };
        const keys = Object.keys(data);
        const formData = {};
        for (const key of keys) {
          formData[key] = [data[key]];
        }
        const form = this.formBuilder.group(formData);
        // form.valueChanges.subscribe(va => {
        //   for (const key of keys) {
        //     if (key !== 'select' && !form.get('select').value && va[key]) {
        //       form.get('select').setValue(true);
        //     }
        //   }
        // });
        return form;
      });
      this.poses = result?.result?.listPos;
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
        if (this.office_selected_right) {
          this.offices = [...this.offices, this.office_selected_right];
          this.officeIds = this.officeIds.filter(v => v !== this.office_selected_right);
          this.office_selected_right = null;
        }
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

  changePoses(type: any, b: any) {
    if (type === 'all') {
      if (b === 'left') {
        this.terminalId = [...this.terminalId, ...this.poses];
        this.poses = [];
      } else {
        this.poses = [...this.poses, ...this.terminalId];
        this.terminalId = [];
      }
    } else {
      if (b === 'left' && this.pos_selected_left) {
        this.terminalId = [...this.terminalId, this.pos_selected_left];
        this.poses = this.poses.filter(v => v !== this.pos_selected_left);
        this.pos_selected_left = null;
      } else {
        if (this.pos_selected_right) {
          this.poses = [...this.poses, this.pos_selected_right];
          this.terminalId = this.terminalId.filter(v => v !== this.pos_selected_right);
          this.pos_selected_right = null;
        }
      }
    }
  }

  setPosSelect(item: any, b: string) {
    if (b === 'left') {
      this.pos_selected_left = item;
      this.pos_selected_right = null;
    } else {
      this.pos_selected_left = null;
      this.pos_selected_right = item;
    }
  }

  onSubmit() {
    if (this.fromGroup.invalid) {
      return this.fromGroup.markAllAsTouched();
    }
    const fromGroupV = this.fromGroup.value;
    for (const card of this.cards) {
      if (card.invalid) {
        return card.markAllAsTouched();
      }
    }
    const listRateCardType = this.cards.filter((v: any) => v.get('select').value).map(value => value.value);
    //    const re = refids.toString().split(',').join( '-');
    const te = this.terminalId.map(i => i.terminalId);
    const terminalId = te.toString().split(',').join('-');
    const of = this.officeIds.map(i => i.id);
    const officeId = of.toString().split(',').join('-');
    console.log({
      ...fromGroupV,
      listRateCardType: listRateCardType.length === 0 ? '' : JSON.stringify(listRateCardType),
      terminalId,
      officeId,
      secondRemain: fromGroupV.secondRemain * 60
    });
    if (this.campaign) {
      this.marketingServices.UpdateCampain({
        ...fromGroupV,
        listRateCardType: listRateCardType.length === 0 ? '' : JSON.stringify(listRateCardType),
        terminalId,
        officeId,
        secondRemain: fromGroupV.secondRemain * 60
      }).subscribe(result => {
        if (result.status !== '200') {
          return this.alterService.alert({message: result.error, msgClass: 'cssWarning'});
        }
        this.alterService.alert({message: 'Cập nhập chiến dịch thành công!', msgClass: 'cssSuccess'});
        return this.router.navigate(['/marketing']);
      });
    } else {
      this.marketingServices.addPosCampain({
        ...fromGroupV,
        listRateCardType: JSON.stringify(listRateCardType),
        terminalId,
        officeId
      }).subscribe(result => {
        console.log(result);
        if (result.status !== '200') {
          return this.alterService.alert({message: result.error, msgClass: 'cssWarning'});
        }
        this.alterService.alert({message: 'Tạo chiến dịch thành công!', msgClass: 'cssSuccess'});
        return this.router.navigate(['/marketing']);
      });
    }
  }

}
