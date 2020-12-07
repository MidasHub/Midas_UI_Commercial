import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThirdPartyService } from '../third-party.service';
import { AlertService } from 'app/core/alert/alert.service';
import { MerchantDialogComponent } from '../dialog/merchant-dialog/merchant-dialog.component';

@Component({
  selector: 'midas-merchant-tab',
  templateUrl: './merchant-tab.component.html',
  styleUrls: ['./merchant-tab.component.scss']
})
export class MerchantTabComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  merchants:any[];
  dataSource: MatTableDataSource<any>;
  displayedColumns =  ['name', 'partner', 'rangeDay', 'status', 'createdBy','createdDate','updatedDate','action'];
  merchantsActive:any[];
  merchantsInActive:any[];
  merchantsStatus:boolean;

  constructor(
    private alertServices: AlertService,
    private thirdPartyService: ThirdPartyService,
    public dialog: MatDialog
    ) {

  }

  ngOnInit(): void {

    this.thirdPartyService.getMerchants("A").subscribe((data: any) => {
      this.merchants = data.result.merchants;
      this.dataSource = new MatTableDataSource(data.result.merchants);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}