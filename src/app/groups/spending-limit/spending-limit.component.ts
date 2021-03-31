import { CreateEditSpendingComponent } from './../dialogs/create-edit-spending/create-edit-spending.component';
import { SelectBase } from './../../shared/form-dialog/formfield/model/select-base';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupsService } from './../groups.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/core/alert/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
// createdBy: "S"
// createdDate: "2021-01-07T09:48:14.000+0000"
// limitDefault: 12000000
// limitType: 0
// month: 1
// officeId: 5
// paymentTypeId: 24
// refid: 28
// staffId: 0
// status: "A"
// updatedBy: ""
// updatedDate: null
// year: 2021
@Component({
  selector: 'midas-spending-limit',
  templateUrl: './spending-limit.component.html',
  styleUrls: ['./spending-limit.component.scss']
})
export class SpendingLimitComponent implements OnInit, AfterViewInit {
  displayedColumns: any[] = ['refid', 'month', 'year', 'status', 'paymentTypeId', 'action'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  formSearch: FormGroup;
  data: any = {};
  offices: any[] = [];
  paymetTypes: any[] = [];
  constructor(private groupsService: GroupsService,
    private formBuilder: FormBuilder,
    private alterService: AlertService,
    private dialog: MatDialog) {
    this.formSearch = this.formBuilder.group({
      'year': [new Date().getFullYear()],
      'month': [new Date().getMonth() + 1]
    });
  }
  textFilter: string;
  dataSource: any[] = [];
  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit() {
    merge( this.paginator.page)
      .pipe(
        tap(() => this.loadPage())
      )
      .subscribe();
  }
  loadPage() {
    const offces = this.paginator.pageIndex * this.paginator.pageSize;
    if (this.textFilter) {
      const  m = this.data?.listSavingLimitConfig.filter((item: any) => {
        const keys = Object.keys(item);
        for (const key of keys) {
          console.log(item[key], this.textFilter)
          switch (key) {
            case 'paymentTypeId':
              if (String(this.getPaymetType(item[key])).indexOf(this.textFilter) !== -1) {
                return true;
              }
              break;
            default:
              if (String(item[key]).indexOf(this.textFilter) !== -1) {
                return true;
              }
          }
        }
        return false;
      });
      this.dataSource = m.slice(offces, offces + this.paginator.pageSize);
    } else {
      this.dataSource = this.data.listSavingLimitConfig.slice(offces, offces + this.paginator.pageSize);
    }
  }
  applyFilter(text: string) {
    console.log(text);
    this.textFilter = String(text).toLowerCase();
    this.loadPage();
  }

  getPaymetType(type: string) {
    return this.paymetTypes.find(v => v.id === type)?.description;
  }
  createEditSpending(editData?: any) {
    const data = this.data;
    console.log(data);
    const dialogBank = this.dialog.open(CreateEditSpendingComponent, {
      data: {
        ...data,
        editData
      },
      width: '600px',
    });
    dialogBank.afterClosed().subscribe((response: any) => {
      console.log(response);
      if (response?.data) {
        let dataCreate = response.data;
        if (editData) {
          dataCreate = {
            refid: editData.refid,
            ...dataCreate
          };
        }
        const keys = Object.keys(dataCreate);
        for (const key of keys) {
          if (['officeId', 'paymentTypeId', 'staffId', 'limitType', 'limitDefault'].indexOf(key)) {
            dataCreate[key] = Number(dataCreate[key]);
          }
        }
        this.groupsService.storeSpendingLimit(dataCreate).subscribe(re => {
          console.log(re);
          if (re.status === '200' && re.result) {
            const {limitConfig} = re?.result;
            if (editData) {
              this.groupsService.updateLimitRow(limitConfig);
            } else {
              this.groupsService.addLimitRow(limitConfig);
            }
            return this.alterService.alert({ message: editData ? 'Cập nhập hạn mức thành công 🎊🎊🎊🎊🎊🎊!' : 'Thêm hạn mức thành công 🎊🎊🎊🎊🎊🎊!', msgClass: 'cssSuccess' });
          } else {
            return this.alterService.alert({
              message: re?.result?.message || 'Có lỗi xảy ra vui lòng liên hệ IT Support 🆘',
              msgClass: 'cssDanger'
            });
          }
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
    this.paginator.pageIndex = 0;
    this.groupsService.getConfigSpendingLimit(year, month).subscribe(data => {
      console.log(data);
      if (data) {
        const offces = this.paginator.pageIndex * this.paginator.pageSize;
        console.log(offces, this.paginator.pageIndex , this.paginator.pageSize)
        this.data = data?.data;
        this.offices = this.data?.listOffice;
        this.paymetTypes = this.data?.listPaymentType;
        this.loadPage();
      }
    });
  }
}
