import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { BillsService } from "../bills-manage.service";
@Component({
  selector: "midas-view-detail-batch-upload",
  templateUrl: "./view-detail-batch-upload.component.html",
  styleUrls: ["./view-detail-batch-upload.component.scss"],
})
export class ViewDetailBatchUploadComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ["refNo", "customerName", "uploadDate", "amount", "status", "merchant"];
  isLoading: boolean = false;
  batchCode: string;
  sumBills: number;
  dataSource = new MatTableDataSource<any>();
  constructor(private billsService: BillsService, private route: ActivatedRoute, private dialog: MatDialog) {
    this.route.data.subscribe((data: any) => {
      this.batchCode = this.route.snapshot.paramMap.get("batchCode");
      this.dataSource = data?.BillsResourceData?.result?.listInvoice;
      this.sumBills = data?.BillsResourceData?.result?.totalBills;
    });
  }

  findBills(filterValue: string) {
    filterValue = filterValue? filterValue:'%%'
    this.isLoading = true;
    this.dataSource = new MatTableDataSource<any>();
    const limit = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const offset = this.paginator.pageIndex * limit;
    this.billsService.getListInvoiceByBatchCode(this.batchCode, filterValue, limit, offset).subscribe((data: any) => {
      this.isLoading = false;
      this.dataSource = data?.result?.listInvoice;
      this.sumBills = data?.result?.totalBills;
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
}
