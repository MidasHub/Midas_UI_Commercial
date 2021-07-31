import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/core/alert/alert.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { TransactionService } from 'app/transactions/transaction.service';
import { merge } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: 'midas-manage-transfer',
  templateUrl: './manage-transfer.component.html',
  styleUrls: ['./manage-transfer.component.scss'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "100px" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class ManageTransferComponent implements OnInit {
  dataSource: any[] = [];
  dataFilter: any[] = [];
  dataShow: any[] = [];
  displayedColumns: any[] = ["transferDate", "transferRefNo", "senderStaffName", "actionStaffName", "receiverStaffName", "action"];

  currentUser: any;
  officeId: any;
  today = new Date();
  fromDate: any;
  toDate: any;
  isExported: any;
  formDate: FormGroup;
  formFilter: FormGroup;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private authenticationService: AuthenticationService,
    private transactionServices: TransactionService,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  )
  {
    this.currentUser = this.authenticationService.getCredentials();
    this.officeId = this.currentUser.officeId;
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
    });
    this.formFilter = this.formBuilder.group({
      transferRefNo: [""],
      actionStaffName: [""],
      senderStaffName: [""],
      receiverStaffName: [""]
    });
  }

  ngAfterViewInit() {
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    merge(this.sort!.sortChange, this.paginator!.page)
      .pipe(tap(() => this.loadData()))
      .subscribe();
  }

  ngOnInit(): void {
    this.formFilter.valueChanges.subscribe((e) => [this.filterData()]);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  get fromDateAndToDate() {
    const fromDate = this.formDate.get("fromDate")?.value;
    const toDate = this.formDate.get("toDate")?.value;
    if (fromDate && toDate) {
      return true;
    }
    return false;
  }

  reset(){
    this.formFilter.get('transferRefNo')?.setValue("");
    this.formFilter.get('actionStaffName')?.setValue("");
    this.formFilter.get('senderStaffName')?.setValue("");
    this.formFilter.get('receiverStaffName')?.setValue("");
  }

  getListTransfer(){
    this.fromDate = this.datePipe.transform(this.formDate.get("fromDate")?.value, 'dd/MM/yyyy');
    this.toDate = this.datePipe.transform(this.formDate.get("toDate")?.value, 'dd/MM/yyyy');
    this.transactionServices.getListTransfer(this.fromDate, this.toDate, this.officeId).subscribe((data) => {
      this.dataSource = data.result.listRequest;
      this.dataFilter = this.dataSource;
      this.loadData();
    });
  }

  loadData() {
    const pageIndex = this.paginator!.pageIndex;
    const pageSize = this.paginator!.pageSize;
    this.dataShow = this.dataFilter.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  }

  filterData() {
    const form = this.formFilter.value;
    const keys = Object.keys(form);
    this.dataFilter = this.dataSource.filter((v) => {
      for (const key of keys) {
        if (form[key] && !String(v[key]).toLowerCase().includes(String(form[key]).toLowerCase())) {
          return false;
        }
      }
      return true;
    });
    this.paginator!.pageIndex = 0;
    this.loadData();
  }

  sortData(sort: any) {
    this.dataFilter = this.dataFilter.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "transferDate":
          return this.compare(a.transferDate, b.transferDate, isAsc);
        case "transferRefNo":
          return this.compare(a.transferRefNo, b.transferRefNo, isAsc);
        case "senderStaffName":
          return this.compare(a.senderStaffName, b.senderStaffName, isAsc);
        case "actionStaffName":
          return this.compare(a.actionStaffName, b.actionStaffName, isAsc);
        case "receiverStaffName":
          return this.compare(a.receiverStaffName, b.receiverStaffName, isAsc);
        default:
          return 0;
      }
    });
    this.paginator!.pageIndex = 0;
    this.loadData();
  }

  deleteCardTransferRequest(form: any) {
    if (form.isExported==1) {
      this.alertService.alert({message: 'Biên bản đã in, không thể chỉnh sửa.', msgClass: 'cssError'});
    }
    else{
      let dataResult: any[] = [];
      let listCardId: any[] = [];
      //delete card transfer request by transferRefNo
      this.transactionServices.deleteCardTransferRequest(form.transferRefNo, this.officeId).subscribe((dataDelete) => {
      if (dataDelete.statusCode=="success") {
        this.alertService.alert({message: 'Xóa thành công.', msgClass: 'cssSuccess'});
        this.dataSource = this.dataSource.filter((v) => v.transferRefNo !== form.transferRefNo);
      }
      else{
        this.alertService.alert({message: 'Xóa thất bại.', msgClass: 'cssError'});
      }
    });
    }
  }

  createTransfer() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

  editCardTransferRequest(form: any) {
    if (form.isExported==1) {
      this.alertService.alert({message: 'Biên bản đã in, không thể chỉnh sửa.', msgClass: 'cssError'});
    }
    else{
      const queryParams: any = {
        transferRefNo: form.transferRefNo
      };
      this.router.navigate(['../create'], { relativeTo: this.route, queryParams: queryParams });
    }
  }

}
