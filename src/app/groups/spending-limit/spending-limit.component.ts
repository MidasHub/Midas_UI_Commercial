import { CreateEditSpendingComponent } from './../dialogs/create-edit-spending/create-edit-spending.component';
import { SelectBase } from './../../shared/form-dialog/formfield/model/select-base';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupsService } from './../groups.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/core/alert/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';
@Component({
  selector: 'midas-spending-limit',
  templateUrl: './spending-limit.component.html',
  styleUrls: ['./spending-limit.component.scss']
})
export class SpendingLimitComponent implements OnInit {
  displayedColumns: any[] = ['id', 'description', 'isCashPayment', 'value', 'action'];
  formSearch: FormGroup;
  data: any = {};
  offices: any[] = [];
  constructor(private groupsService: GroupsService,
     private formBuilder: FormBuilder,
     private alterService: AlertService,
              private dialog: MatDialog) {
    this.formSearch = this.formBuilder.group({
      'year': [new Date().getFullYear()],
      'month': [new Date().getMonth() + 1]
    });
  }
  dataSource: any[] = [];
  ngOnInit(): void {
    this.getData();
  }
  applyFilter(text: string) {
    console.log(text);
  }
  createSpending() {
    const data = this.data;
    console.log(data);
    const dialogBank = this.dialog.open(CreateEditSpendingComponent, {
      data: data,
      width: '600px'
    });
    dialogBank.afterClosed().subscribe((response: any) => {
      console.log(response);
      if (response?.data) {
        const dataCreate = response.data;
        const keys = Object.keys(dataCreate);
        for (const key of keys) {
          if (['officeId', 'paymentTypeId', 'staffId', 'limitType', 'limitDefault'].indexOf(key)) {
            dataCreate[key] = Number(dataCreate[key]);
          }
        }
        this.groupsService.storeSpendingLimit(dataCreate).subscribe(re => {
          console.log(re);
          if (re?.result?.status) {
            return this.alterService.alert({message: 'Thêm hạn mức thành công 🎊🎊🎊🎊🎊🎊!', msgClass: 'cssSuccess'});
          }
          return this.alterService.alert({
            message: re?.result?.message || 'Có lỗi xảy ra vui lòng liên hệ IT Support 🆘',
            msgClass: 'cssDanger'
          });
        });
      }
    });
  }
  getData() {
    const date = new Date();
    let year = this.formSearch.get('year').value;
    let month = this.formSearch.get('month').value;
    if (!year) {
      year = date.getFullYear();
    }
    if (!month) {
      month = date.getMonth() + 1;
    }
    this.groupsService.getConfigSpendingLimit(year, month).subscribe(data => {
      console.log(data);
      if (data) {
        this.data = data?.data;
        this.dataSource = this.data?.listSavingLimitConfig;
        this.offices = this.data?.listOffice;
      }
    });
  }
}
