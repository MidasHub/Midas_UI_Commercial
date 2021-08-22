import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientsDataSource } from '../clients.datasource';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

/** Custom Services */
import { ClientsService } from '../clients.service';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { MidasClientService } from '../../midas-client/midas-client.service';

//** Logger */
import { Logger } from '../../core/logger/logger.service';
const log = new Logger('Client-customer');

@Component({
  selector: 'midas-client-customer',
  templateUrl: './client-customer.component.html',
  styleUrls: ['./client-customer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '100px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ClientCustomerComponent implements OnInit, AfterViewInit {

  @ViewChild('showClosedAccounts', { static: true }) showClosedAccounts: MatCheckbox;

  expandedElement: any;
  displayedColumns = ['name', 'clientno', 'externalid', 'status', 'mobileNo', 'gender', 'office', 'staff', 'link'];
  dataSource: ClientsDataSource;
  /** Get the required filter value. */
  searchValue = '';
  /** Client Type:
   * Staff: 22
   * Customer: 23
  */
  clientType: string = '';
  createButtonName: string = '';
  tabWillView:string = 'identities'
  tabQueryParams:any={ typeViewClient: 'view'};
  ctype: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private clientsService: ClientsService,
    private route: ActivatedRoute,
    private router: Router,
    private midasClientService: MidasClientService) { }


  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  ngOnInit() {
    // @ts-ignore
    const { value } = this.route.queryParams;


    this.route.data.subscribe(v => {
      switch (v.ctype) {
        case 'staff':
          this.clientType = '22,143';
          this.createButtonName = 'Thêm nhân viên';
          break;
        case 'ic':
          this.clientType = '23'
          this.createButtonName = 'Thêm đối tác máy';
          this.tabWillView = 'general';
          this.tabQueryParams = { typeViewClient: 'view',clientType:'ic'};

          break;
        default:
          this.clientType = '21'
          this.createButtonName = 'Thêm khách hàng';
          break;
      }

    });



    if (value) {
      const { i, s, type } = value;
      if (i && s) {
        this.paginator.pageSize = Number(s);
        this.paginator.pageIndex = Number(i);
      }
    }
    //   .subscribe(params => {
    //   const {pageIndex, pageSize} = params;fxHide fxShow.gt-md
    //   if (pageIndex && pageSize) {
    //     this.paginator.pageSize = Number(pageSize);
    //     this.paginator.pageIndex = Number(pageIndex);
    //   }
    // });
    log.debug('start page');
    this.getClients();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.showClosedAccounts.change)
      .pipe(
        tap(() => this.loadClientsPage())
      )
      .subscribe();
  }


  /**
   * Loads a page of journal entries.
   */
  loadClientsPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    if (this.searchValue !== "") {
      this.applyFilter(this.searchValue);
    } else {
      const queryParams: Params = { i: this.paginator.pageIndex, s: this.paginator.pageSize };
      this.router.navigate([],
        {
          queryParams: queryParams,
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        });

      // this.dataSource.getClients(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked);
      this.dataSource.getClients(this.clientType,this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked);
    }
  }

  /**
   * Initializes the data source for clients table and loads the first page.
   */
  getClients() {
    this.dataSource = new ClientsDataSource(this.clientsService, this.midasClientService);
    // this.dataSource.getClients(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked);
    this.dataSource.getClients(this.clientType,this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked );
    log.debug('Data Source:' + this.dataSource)
  }

  /**
   * Filter Client Data
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string = '') {
    this.searchValue = filterValue;
    this.dataSource.filterClients(filterValue, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked,this.clientType);
    // this.paginator.pageIndex = 0;
  }

}
