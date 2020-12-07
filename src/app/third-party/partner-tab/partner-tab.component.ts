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
  displayedColumns =  ['code', 'desc', 'typeCheckValid', 'status', 'limit', 'createdBy','createdDate','updatedDate','action'];
  partnersDataActive:any[];
  partnersDataInActive:any[];
  
  constructor(
    private alertServices: AlertService,
    private thirdPartyService: ThirdPartyService,
    public dialog: MatDialog
    ) {

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
      console.log("payload",payload);
        if(payload){
          this.dataSource.data.push(payload);
        } 
    });
  }

  editPartner(partner:any, index:number){
     
    if(partner){
      partner.status === 'O' ? partner['status']=true : partner['status']=false; 
    }
    const data = {
      action: 'edit',
      ... partner
    };
    const dialog = this.dialog.open(PartnerDialogComponent, { height: "auto", width: "30%" , data });
    dialog.afterClosed().subscribe((payload: any) => {
      console.log("payload",payload);
      if(payload){
        this.dataSource.data.slice(index,1);
        this.dataSource.data.push(payload);
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

}