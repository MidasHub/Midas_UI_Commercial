/** Angular Imports. */
import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ClientsDataSource} from './clients.datasource';

/** rxjs Imports */
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';

/** Custom Services */
import {ClientsService} from './clients.service';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';
import {MidasClientService} from '../midas-client/midas-client.service';

/** Logger */
import {Logger} from "../core/logger/logger.service";

const log = new Logger('Client List');

@Component({
  selector: 'mifosx-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ClientsComponent  {
  // @ViewChild('showClosedAccounts', {static: true}) showClosedAccounts: MatCheckbox;

  // expandedElement: any;
  // displayedColumns = ['name', 'clientno', 'externalid', 'status', 'mobileNo', 'gender', 'office', 'staff', 'link'];
  // dataSource: ClientsDataSource;
  // /** Get the required filter value. */
  // searchValue = '';

  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // @ViewChild(MatSort, {static: true}) sort: MatSort;

  // constructor(private clientsService: ClientsService,
  //             private route: ActivatedRoute,
  //             private router: Router,
  //             private midasClientService: MidasClientService) {
  // }


  // isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  navLinks =[
    {
      path:'./customer',
      label:'Khách hàng'
    },
    {
      path:'./staff',
      label:'Nhân viên'
    },

  ]

  // ngOnInit() {
  //   // @ts-ignore
  //   const {value} = this.route.queryParams;
  //   if (value) {
  //     const {i, s} = value;
  //     if (i && s) {
  //       this.paginator.pageSize = Number(s);
  //       this.paginator.pageIndex = Number(i);
  //     }
  //   }
  //   //   .subscribe(params => {
  //   //   const {pageIndex, pageSize} = params;fxHide fxShow.gt-md
  //   //   if (pageIndex && pageSize) {
  //   //     this.paginator.pageSize = Number(pageSize);
  //   //     this.paginator.pageIndex = Number(pageIndex);
  //   //   }
  //   // });
  //   log.debug('start page');
  //   this.getClients();
  // }

  // ngAfterViewInit() {
  //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  //   merge(this.sort.sortChange, this.paginator.page, this.showClosedAccounts.change)
  //     .pipe(
  //       tap(() => this.loadClientsPage())
  //     )
  //     .subscribe();
  // }

  // /**
  //  * Loads a page of journal entries.
  //  */
  // loadClientsPage() {
  //   if (!this.sort.direction) {
  //     delete this.sort.active;
  //   }

  //   if (this.searchValue !== '') {
  //     this.applyFilter(this.searchValue);
  //   } else {
  //     const queryParams: Params = {i: this.paginator.pageIndex, s: this.paginator.pageSize};
  //     this.router.navigate([],
  //       {
  //         queryParams: queryParams,
  //         queryParamsHandling: 'merge', // remove to replace all query params by provided
  //       });

  //     this.dataSource.getClients(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked);
  //   }
  // }

  // /**
  //  * Initializes the data source for clients table and loads the first page.
  //  */
  // getClients() {
  //   this.dataSource = new ClientsDataSource(this.clientsService, this.midasClientService);
  //   this.dataSource.getClients(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked);
  //   // this.dataSource.filterClientsbyType('22',this.sort.active,this.sort.direction,this.paginator.pageIndex,this.paginator.pageSize, !this.showClosedAccounts.checked);
  //   log.debug('Data Source:' + this.dataSource)
  // }

  // /**
  //  * Filter Client Data
  //  * @param {string} filterValue Value to filter data.
  //  */
  // applyFilter(filterValue: string = '') {
  //   this.searchValue = filterValue;
  //   this.dataSource.filterClients(filterValue, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked);
  //   // this.paginator.pageIndex = 0;
  // }

}
