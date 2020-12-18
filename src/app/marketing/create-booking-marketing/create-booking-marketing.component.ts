import {Component, OnInit} from '@angular/core';
import {MarketingServices} from '../marketing.services';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../core/alert/alert.service';
import {MoneyPipe} from '../../pipes/money.pipe';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ClientsService} from '../../clients/clients.service';
import {Router} from '@angular/router';

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
  displayedCardColumns = ['description', 'costRate', 'cogsRate', 'rate'];
  cards: any[] = [];
  office_selected_right: any;
  office_selected_left: any;
  pos_selected_right: any;
  pos_selected_left: any;
  poses: any[] = [];
  offices: any[] = [];

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
              private router: Router) {
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
      this.cards = result?.result?.listCardType?.map((card: any) => {
        const data = {
          ...card,
          costRate: '',
          cogsRate: '',
          rate: '',
          select: false
        };
        const keys = Object.keys(data);
        const formData = {};
        for (const key of keys) {
          formData[key] = [card[key]];
        }
        const form = this.formBuilder.group(formData);
        form.valueChanges.subscribe(va => {
          if (!va.select) {
            form.get('select').setValue(true);
          }
        });
        return form;
      });
      this.poses = result?.result?.listPos;
    });
    this.clientsServices.getOffices().subscribe(resuts => {
      this.offices = resuts;
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
        this.poses = [...this.poses, this.pos_selected_right];
        this.terminalId = this.terminalId.filter(v => v !== this.pos_selected_right);
        this.pos_selected_right = null;
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
    const fromGroupV = this.fromGroup.value;
    const listRateCardType = this.cards.filter((v: any) => v.get('select').value).map(value => value.value);
    //    const re = refids.toString().split(',').join( '-');
    const te = this.terminalId.map(i => i.terminalId);
    const terminalId = te.toString().split(',').join('-');
    const of = this.officeIds.map(i => i.id);
    const officeId = of.toString().split(',').join('-');
    console.log({
      ...fromGroupV,
      listRateCardType,
      terminalId,
      officeId
    });
    this.marketingServices.addPosCampain({
      ...fromGroupV,
      listRateCardType,
      terminalId,
      officeId
    }).subscribe(result => {
      console.log(result);
      if (result.status !== '200') {
        return this.alterService.alert({message: result.error, msgClass: 'cssWarning'});
      }
      this.alterService.alert({message: 'Tạo chiến dịch thành công!', msgClass: 'cssSuccess'});
      return  this.router.navigate(['/marketing']);
    });
  }
}
