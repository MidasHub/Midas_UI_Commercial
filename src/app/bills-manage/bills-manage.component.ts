import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { ActivatedRoute } from "@angular/router";
import { AlertService } from "app/core/alert/alert.service";
import { BillsService } from "./bills-manage.service";
import { UploadFileBillComponent } from "./dialog/upload-bill/upload-bill.component";
@Component({
  selector: "midas-bills-manage",
  templateUrl: "./bills-manage.component.html",
  styleUrls: ["./bills-manage.component.scss"],
})
export class BillsManageComponent implements OnInit, AfterViewInit {
  //@ViewChild('showClosedTerminals', { static: true }) showClosedTerminals: MatCheckbox;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  timer: any;
  isProcessing: boolean = false;
  displayedColumns = [
    "fileName",
    "partner",
    "merchant",
    "status",
    "createdDate",
    "createdBy",
    "totalBill",
    "batchUpload",
    "actions",
  ];

  dataSource = new MatTableDataSource<any>();
  constructor(
    private billsService: BillsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private alertService: AlertService
  ) {
    this.route.data.subscribe((data: any) => {
      this.dataSource.data = data?.BillsResourceData?.result?.listDocInvoice;
      this.isProcessing = data?.BillsResourceData?.result?.havePending;

      if (this.isProcessing) {
        this.loadDocUpdate();
      } else {
        clearTimeout(this.timer);
      }
    });
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  loadDocUpdate() {
    this.billsService.getBillsResource().subscribe((data: any) => {
      this.dataSource.data = data?.result?.listDocInvoice;
      this.isProcessing = data?.result?.havePending;

      if (this.isProcessing) {
        this.timer = setTimeout(() => {
          this.loadDocUpdate();
        }, 5000);
      } else {
        clearTimeout(this.timer);
      }
    });
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  uploadBill() {
    const dialog = this.dialog.open(UploadFileBillComponent, {
      height: "auto",
      width: "600px",
      data: {
        // btnTitle: 'Thêm',
      },
    });
    dialog.afterClosed().subscribe((data) => {
      let billsInfo = data.data.value;
      const formData: FormData = new FormData();
      formData.append("file", data.file);
      formData.append("name", billsInfo.fileName);
      formData.append("description", billsInfo.note);
      formData.append("merchantId", billsInfo.merchantId);
      formData.append("invoiceCode", billsInfo.partner);

      if (data) {
        this.billsService.uploadBills(formData).subscribe((result) => {
          if (result.status === 200) {
            const message = `Tải lên file ${data.data.value.fileName} thành công`;
            this.alertService.alert({
              msgClass: "cssInfo",
              message: message,
            });

            this.loadDocUpdate();
          }
        });
      }
    });
  }
}