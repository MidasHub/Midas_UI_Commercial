import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ClientsService} from '../clients.service';
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AccountingService} from '../../accounting/accounting.service';
import {AuthenticationService} from '../../core/authentication/authentication.service';

@Component({
  selector: 'midas-balance-account-client',
  templateUrl: './balance-account-client.component.html',
  styleUrls: ['./balance-account-client.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BalanceAccountClientComponent implements OnInit {
  expandedElement: any;
  expandedElement2: any;
  displayedColumns: any[] = ['customer_name', 'staff_name', 'account_no', 'account_balance_derived'];
  displayedColumns2: any[] = ['customer_name', 'staff_name', 'account_no', 'account_balance_derived'];
  dataSource: any[] = [];
  dataSource2: any[] = [];
  formFilter: FormGroup;
  formFilter2: FormGroup;
  accountFilter: any[] = [];
  accountFilter2: any[] = [];
  accountsShow: any[] = [];
  accountsShow2: any[] = [];
  staffs: any[] = [];
  currentUser: any;
  totalAmountDerived:number;
  totalAmountDerived2:number
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild('Table2Paginator', {static: true}) table2Paginator: MatPaginator;
  @ViewChild('Table2Sort', {static: true}) table2Sort: MatSort;

  constructor(
    private clientServices: ClientsService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = this.authenticationService.getCredentials();
    this.clientServices.getBalanceAccountOfCustomer().subscribe(result => {
      const {permissions, staffId} = this.currentUser;
      const permit_userTeller = permissions.includes('TXNOFFICE_CREATE');
      this.dataSource = result?.result?.listBalanceCustomer.filter((v: any) => Number(v.account_balance_derived) >= 0 && (permit_userTeller || staffId === v.staff_id));
      this.dataSource2 = result?.result?.listBalanceCustomer.filter((v: any) => Number(v.account_balance_derived) < 0 && (permit_userTeller || staffId === v.staff_id));
      this.accountFilter = this.dataSource;
      this.accountFilter2 = this.dataSource2;
      this.loadData();this.loadData2();
      this.totalAmountDerived = this.dataSource.reduce( ( sum, { account_balance_derived } ) => sum + account_balance_derived , 0);
      this.totalAmountDerived2 = this.dataSource2.reduce( ( sum, { account_balance_derived } ) => sum + account_balance_derived , 0)
    });
    this.clientServices.getNameOfStaff().subscribe(result => {
      this.staffs = result?.result?.listStaff;
      this.staffs.unshift({
        staffCode: 'Tất cả',
        staffId: ''
      });
    });
    this.formFilter = this.formBuilder.group({
      'customer_name': [''],
      'staff_id': ['']
    });
    this.formFilter2 = this.formBuilder.group({
      'customer_name': [''],
      'staff_id': ['']
    });
  }

  sortData(sort: any) {
    this.accountFilter = this.accountFilter.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'customer_name':
          return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'staff_name':
          return this.compare(a.staff_name, b.staff_name, isAsc);
        case 'account_no':
          return this.compare(a.account_no, b.account_no, isAsc);
        case 'account_balance_derived':
          return this.compare(a.account_balance_derived, b.account_balance_derived, isAsc);
        default:
          return 0;
      }
    });
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  sortData2(sort: any) {
    console.log();
    this.accountFilter2 = this.accountFilter2.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'customer_name':
          return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'staff_name':
          return this.compare(a.staff_name, b.staff_name, isAsc);
        case 'account_no':
          return this.compare(a.account_no, b.account_no, isAsc);
        case 'account_balance_derived':
          return this.compare(a.account_balance_derived, b.account_balance_derived, isAsc);
        default:
          return 0;
      }
    });
    this.table2Paginator.pageIndex = 0;
    this.loadData2();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadData())
      )
      .subscribe();
    
    this.table2Sort.sortChange.subscribe(() => this.table2Paginator.pageIndex = 0);
    merge(this.table2Sort.sortChange, this.table2Paginator.page)
      .pipe(
        tap(() => this.loadData2())
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.formFilter.valueChanges.subscribe(e => [
      this.filterData()
    ]);
    this.formFilter2.valueChanges.subscribe(e => [
      this.filterData2()
    ]);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  loadData() {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    this.accountsShow = this.accountFilter.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  }

  loadData2() {
    const pageIndex = this.table2Paginator.pageIndex;
    const pageSize = this.table2Paginator.pageSize;
    this.accountsShow2 = this.accountFilter2.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  }

  filterData() {
    const form = this.formFilter.value;
    const keys = Object.keys(form);
    this.accountFilter = this.dataSource.filter(v => {
      for (const key of keys) {
        if (form[key] && !String(v[key]).toLowerCase().includes(String(form[key]).toLowerCase())) {
          return false;
        }
      }
      return true;
    });
    this.paginator.pageIndex = 0;
    this.loadData();
    this.totalAmountDerived = this.accountFilter.reduce( ( sum, { account_balance_derived } ) => sum + account_balance_derived , 0)
  }

  filterData2() {
    const form = this.formFilter2.value;
    const keys = Object.keys(form);
    this.accountFilter2 = this.dataSource2.filter(v => {
      for (const key of keys) {
        if (form[key] && !String(v[key]).toLowerCase().includes(String(form[key]).toLowerCase())) {
          return false;
        }
      }
      return true;
    });
    this.table2Paginator.pageIndex = 0;
    this.loadData2();
    this.totalAmountDerived2 = this.accountFilter2.reduce( ( sum, { account_balance_derived } ) => sum + account_balance_derived , 0)
  }
}
