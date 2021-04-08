import { Component, Inject, OnInit, ViewChild, OnDestroy, Injectable } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ThirdPartyService } from "../third-party.service";
import { AlertService } from "app/core/alert/alert.service";
import { MerchantDialogComponent } from "../dialog/merchant-dialog/merchant-dialog.component";
import { ThirdPartyComponent } from "../third-party.component";

import { Subject } from "rxjs";
import { share } from "rxjs/operators";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { ConfirmDialogComponent } from "app/transactions/dialog/coifrm-dialog/confirm-dialog.component";

@Component({
  selector: "midas-merchant-tab",
  templateUrl: "./merchant-tab.component.html",
  styleUrls: ["./merchant-tab.component.scss"],
})

//@Injectable()
export class MerchantTabComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private onSubject = new Subject<{ key: string; value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());

  merchants: any[];
  dataSource: MatTableDataSource<any>;
  displayedColumns = ["name", "partner", "rangeDay", "status", "action"];
  merchantsActive: any[];
  merchantsInActive: any[];
  merchantsStatus: any;
  filterSearch: string;

  constructor(
    private alertServices: AlertService,
    private thirdPartyService: ThirdPartyService,
    public dialog: MatDialog,
    public thirdPartyComponent: ThirdPartyComponent
  ) {}

  ngOnInit(): void {
    this.thirdPartyService.getMerchants("A").subscribe((data: any) => {
      this.merchants = data.result.merchants;
      this.dataSource = new MatTableDataSource(data.result.merchants);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.thirdPartyService.getInputFilter().subscribe((result: string) => {
      if (result) {
        this.applyFilter(result);
      }
    });
  }

  inactiveBillsMerchant(merchantName: string) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Bạn chắc chắn muốn xóa bill chưa dùng của hkd ${merchantName}`,
        title: "Hoàn thành giao dịch",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.thirdPartyService.inactiveBillsMerchant(merchantName).subscribe((response: any) => {
          if (response.result.status) {
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
            this.ngOnInit();
          }
        });
      }
    });
  }

  createMerchant() {
    const data = {
      action: "create",
    };
    const dialog = this.dialog.open(MerchantDialogComponent, { height: "auto", width: "30%", data });
    dialog.afterClosed().subscribe((payload: any) => {
      console.log("payload", payload);
      if (payload) {
        this.dataSource.data.push(payload);
      }
    });
  }

  editMerchant(partner: any, index: number) {
    if (partner) {
      partner.status === "A" ? (partner["status"] = true) : (partner["status"] = false);
    }
    const data = {
      action: "edit",
      ...partner,
    };
    const dialog = this.dialog.open(MerchantDialogComponent, { height: "auto", width: "30%", data });
    dialog.afterClosed().subscribe((payload: any) => {
      console.log("payload", payload);
      if (payload) {
        this.changeShowClosedMerchants(this.merchantsStatus);
      }
    });
  }

  changeShowClosedMerchants(isActive: boolean) {
    this.merchantsStatus = isActive;
    let status = this.merchantsStatus ? "A" : "C";
    this.thirdPartyService.getMerchants(status).subscribe((data: any) => {
      this.merchants = data.result.merchants;
      this.dataSource.data = this.merchants;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  previousStep() {
    this.thirdPartyComponent.changeTab(0);
  }

  onChange(value: MatSlideToggleChange, merchant: any) {
    merchant.status = value.checked ? "A" : "C";
    const payload = {
      ...merchant,
    };

    this.thirdPartyService.updateMerchantStatus(payload).subscribe((response: any) => {
      if (response.statusCode === "success") {
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
    });
  }
}
