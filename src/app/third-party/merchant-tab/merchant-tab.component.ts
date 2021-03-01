import { Component, Inject, OnInit, ViewChild , OnDestroy, Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThirdPartyService } from '../third-party.service';
import { AlertService } from 'app/core/alert/alert.service';
import { MerchantDialogComponent } from '../dialog/merchant-dialog/merchant-dialog.component';
import { ThirdPartyComponent } from '../third-party.component';

import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'midas-merchant-tab',
  templateUrl: './merchant-tab.component.html',
  styleUrls: ['./merchant-tab.component.scss']
})

//@Injectable()
export class MerchantTabComponent implements OnInit  {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private onSubject = new Subject<{ key: string, value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());

  merchants:any[];
  dataSource: MatTableDataSource<any>;
  displayedColumns =  ['name', 'partner', 'rangeDay', 'status', 'action'];
  merchantsActive:any[];
  merchantsInActive:any[];
  merchantsStatus:boolean;

  // funcListener :any ; 

  filterSearch:string;

  constructor(
    private alertServices: AlertService,
    private thirdPartyService: ThirdPartyService,
    public dialog: MatDialog,
    public thirdPartyComponent :ThirdPartyComponent , 
    ) {}
   
  ngOnInit(): void {
    
    this.thirdPartyService.getMerchants("A").subscribe((data: any) => {
      this.merchants = data.result.merchants;
      this.dataSource = new MatTableDataSource(data.result.merchants);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    console.log('sub');
    this.thirdPartyService.getInputFilter().subscribe((result:string) => {
      if (result) {
        this.applyFilter(result);
      }
    });
  }


  createMerchant(){
    const data = {
      action: 'create'
    };
    const dialog = this.dialog.open(MerchantDialogComponent, { height: "auto", width: "30%" , data });
    dialog.afterClosed().subscribe((payload: any) => {
      console.log("payload",payload);
        if(payload){
          this.dataSource.data.push(payload);
        } 
    });
  }

  editMerchant(partner:any, index:number){
    
    if(partner){
      partner.status === 'A' ? partner['status']=true : partner['status']=false; 
    }
    const data = {
      action: 'edit',
      ... partner
    };
    const dialog = this.dialog.open(MerchantDialogComponent, { height: "auto", width: "30%" , data });
    dialog.afterClosed().subscribe((payload: any) => {
      console.log("payload",payload);
      if(payload){
        this.changeShowClosedMerchants(this.merchantsStatus);
        // this.dataSource.data.slice(index,1);
        // this.dataSource.data.push(payload);
      } 
    });
  }

 
  changeShowClosedMerchants(isActive:boolean){
    this.merchantsStatus = isActive;
    if(isActive){
      this.thirdPartyService.getMerchants("C").subscribe((data: any) => {
        this.merchants = data.result.merchants;
        this.dataSource.data = this.merchants;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }else{
      this.thirdPartyService.getMerchants("A").subscribe((data: any) => {
        this.merchants = data.result.merchants;
        this.dataSource.data = this.merchants;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  applyFilter(filterValue: string) {
    if(filterValue){
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  previousStep(){
    this.thirdPartyComponent.changeTab(0);
  }

  onChange(value: MatSlideToggleChange, merchant: any) {

    // const updateMerchantStatusDialogRef = this.dialog.open(ConfirmationDialogComponent, {
		//   data: { heading: 'Update status Merchant', dialogContext: `Are you sure you want update status ${merchant.name}` }
		// });

    // updateMerchantStatusDialogRef.afterClosed().subscribe((response: { confirm: any }) => {
    //   if (response.confirm) {
        merchant.status = value.checked ? 'true' : 'false' ;
        const payload = {
          ...  merchant
        };
        
        this.thirdPartyService.updateMerchantStatus(payload).subscribe((response: any) => {
          if (response.statusCode === 'success') {
            this.alertServices.alert({
              type: "🎉🎉🎉 Thành công !!!",
              message: "🎉🎉 Xử lý thành công",
              msgClass: "cssSuccess",
            }); 
          } else {
            this.alertServices.alert({
              type: "🚨🚨🚨🚨 Lỗi ",
              msgClass: "cssBig",
              message: "🚨🚨 Lỗi cập nhật trạng thái hộ khinh doanh, vui lòng liên hệ IT Support để được hổ trợ 🚨🚨",
            });
            this.ngOnInit();
          }
          //this.ngOnInit();
        });

      // }
    // });

  }
}