import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { PartnerDialogComponent } from '../dialog/partner-dialog/partner-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThirdPartyService } from '../third-party.service';
import { AlertService } from 'app/core/alert/alert.service';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import { sampleSize } from 'lodash';
//import { MatCheckbox } from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { ThirdPartyComponent } from '../third-party.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
//import { MerchantTabComponent } from '../merchant-tab/merchant-tab.component';

@Component({
  selector: 'midas-partner-tab',
  templateUrl: './partner-tab.component.html',
  styleUrls: ['./partner-tab.component.scss']
})
export class PartnerTabComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChild('showClosedPartners', { static: true }) showClosedPartners: MatCheckbox;


  partners:any[];
  dataSource: MatTableDataSource<any>;
  displayedColumns =  ['code', 'desc', 'typeCheckValid', 'status', 'limit', 'action'];
  partnersDataActive:any[];
  partnersDataInActive:any[];
  selectedIndex: number = 0;

  constructor(
    private alertServices: AlertService,
    private thirdPartyService: ThirdPartyService,
    public dialog : MatDialog,
    public thirdPartyComponent : ThirdPartyComponent ,  
  //  private  merchantTabComponent : MerchantTabComponent
    ){

  }

  ngOnInit(): void {

    this.thirdPartyService.getPartners("active").subscribe((data: any) => {
      this.partners = data.result.partners;

      this.dataSource = new MatTableDataSource(data.result.partners);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  createPartner(){
    const data = {
      action: 'create'
    };
    const dialog = this.dialog.open(PartnerDialogComponent, { height: "auto", width: "30%" , data });
    dialog.afterClosed().subscribe((payload: any) => {
        if(payload){
          this.dataSource.data.push(payload);
        }
    });
  }

  editPartner(partner:any, index:number){
    // if(partner){
    //   partner.status === 'O' ? partner['status']=true : partner['status']=false; 
    // }
    const data = {
      action: 'edit',
      ... partner
    };
    const dialog = this.dialog.open(PartnerDialogComponent, { height: "auto", width: "30%" , data });
    dialog.afterClosed().subscribe((payload: any) => {
      if(payload){
        // this.dataSource.data.slice(index,1);
        // this.dataSource.data.push(payload);
        this.ngOnInit()
      } 
    });
  }


  changeShowClosedPartners(isActive:boolean){
    if(isActive){
      this.thirdPartyService.getPartners("inactive").subscribe((data: any) => {
        this.partners = data.result.partners;
        this.dataSource.data = this.partners;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }else{
      this.thirdPartyService.getPartners("active").subscribe((data: any) => {
        this.partners = data.result.partners;
        this.dataSource.data = this.partners;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  nextStep(partner:any) {
    // if (this.selectedIndex != 1) {
    //   this.selectedIndex = this.selectedIndex + 1;
    // }
    this.thirdPartyService.setInputFilter(partner.desc);
    this.thirdPartyComponent.changeTab(1);
    
  }

  onChange(value: MatSlideToggleChange, partner : any) {

    partner.status = value.checked ? 'true' : 'false' ;

    const payload = {
      ...  partner
    };
    
    this.thirdPartyService.updatePartnerStatus(payload).subscribe((response: any) => {
      if (response.result.status === 'success') {
        this.alertServices.alert({
          type: "🎉🎉🎉 Thành công !!!",
          message: "🎉🎉 Xử lý thành công",
          msgClass: "cssSuccess",
        }); 
      } else {
        this.alertServices.alert({
          type: "🚨🚨🚨🚨 Lỗi ",
          msgClass: "cssBig",
          message: "🚨🚨 Lỗi cập nhật trạng thái đối tác, kiểm tra tất cả hộ khinh doanh liên kết với đối tác phải đóng hoặc vui lòng liên hệ IT Support để được hổ trợ 🚨🚨",
        });
        this.ngOnInit();
      }
      //this.ngOnInit();
    });

  }

}
