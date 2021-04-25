import { Component, Inject, OnInit, ViewChild, OnDestroy, Injectable } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "app/core/alert/alert.service";
import { Subject } from "rxjs";
import { share } from "rxjs/operators";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ConfirmDialogComponent } from "app/transactions/dialog/coifrm-dialog/confirm-dialog.component";
import { SavingsService } from "app/savings/savings.service";
import { AddPartnerDialogComponent } from "./add-partner-dialog/add-partner-dialog.component";
import {ClientsService} from '../../clients.service';

@Component({
  selector: "midas-ic-partner-tab",
  templateUrl: "./ic-partner-tab.component.html",
  styleUrls: ["./ic-partner-tab.component.scss"],
})

//@Injectable()
export class IcPartnerTabComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private onSubject = new Subject<{ key: string; value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());

  partners: any[];
  dataSource: MatTableDataSource<any>;
  displayedColumns = ["name", "partner", "rangeDay", "Action"];
  merchantsActive: any[];
  merchantsInActive: any[];
  merchantsStatus: any;
  filterSearch: string;

  constructor(
    private alertServices: AlertService,
    private  dialog: MatDialog,
    private savingsService: SavingsService, private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.savingsService.getListIcPartner().subscribe((data: any) => {
      this.partners = data.result.listClient;
      this.dataSource = new MatTableDataSource(this.partners);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  addPartner() {
     
    const addPartnerDialogRef = this.dialog.open(AddPartnerDialogComponent, { height: "auto", width:"550px"
    });
    addPartnerDialogRef.afterClosed().subscribe((payloads: any[]) => {
       this.ngOnInit();
    });
  }

  onToggle(event: MatSlideToggleChange, externalId: string){
    
    this.clientsService.ToggleStatusICPartner(externalId, event.checked).subscribe((data: any) => {

        if (data.result.status === "success") {
          this.alertServices.alert({
            type: "🎉🎉🎉 Thành công !!!",
            message: "🎉🎉 Xử lý thành công",
            msgClass: "cssSuccess",
          });
          
        } else {
          this.alertServices.alert({
            type: "🚨🚨🚨🚨 Lỗi ",
            msgClass: "cssBig",
            message: data?.result?.message,
          }); 
      }
    });
  }
 
}
