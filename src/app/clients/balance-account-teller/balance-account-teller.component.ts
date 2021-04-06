import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ClientsService } from "../clients.service";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "midas-balance-account-teller",
  templateUrl: "./balance-account-teller.component.html",
  styleUrls: ["./balance-account-teller.component.scss"],
})
export class BalanceAccountTellerComponent implements OnInit {
  expandedElement: any;
  displayedColumns: any[] = ["tellerSourceName", "accountNo", "sourceInfo", "balance"];
  dataSource: any[] = [];
  formFilter: FormGroup;
  accountFilter: any[] = [];
  accountsShow: any[] = [];
  staffs: any[] = [];
  totalBalanceAmount: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private clientServices: ClientsService, private formBuilder: FormBuilder) {
    this.clientServices.getBalanceOfTeller().subscribe((result) => {
      this.dataSource = result?.result?.listBalanceTeller;
      this.accountFilter = this.dataSource.filter((item) => !(item.balance === 0));
      this.totalBalanceAmount = this.accountFilter?.reduce((total: any, num: any) => {
        return total + Math.round(num?.balance);
      }, 0);
      this.loadData();
    });
    this.formFilter = this.formBuilder.group({
      tellerSourceName: [""],
      sourceInfo: [""],
    });
  }

  sortData(sort: any) {
    this.accountFilter = this.accountFilter.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "tellerSourceName":
          return this.compare(a.tellerSourceName, b.tellerSourceName, isAsc);
        case "accountNo":
          return this.compare(a.accountNo, b.accountNo, isAsc);
        case "sourceInfo":
          return this.compare(a.sourceInfo, b.sourceInfo, isAsc);
        case "balance":
          return this.compare(a.balance, b.balance, isAsc);
        default:
          return 0;
      }
    });
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadData()))
      .subscribe();
  }

  ngOnInit(): void {
    this.formFilter.valueChanges.subscribe((e) => [this.filterData()]);
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  loadData() {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    this.accountsShow = this.accountFilter.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  }

  filterData() {
    const form = this.formFilter.value;
    const keys = Object.keys(form);
    this.accountFilter = this.dataSource.filter((v) => {
      for (const key of keys) {
        if (form[key] && !String(v[key]).toLowerCase().includes(String(form[key]).toLowerCase())) {
          return false;
        }
      }
      return true;
    });

    this.totalBalanceAmount = this.accountFilter?.reduce((total: any, num: any) => {
      return total + Math.round(num?.balance);
    }, 0);

    this.paginator.pageIndex = 0;
    this.loadData();
  }
}
