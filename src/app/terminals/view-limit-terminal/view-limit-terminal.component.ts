import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { BanksService } from 'app/banks/banks.service';
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'midas-view-limit-terminal',
  templateUrl: './view-limit-terminal.component.html',
  styleUrls: ['./view-limit-terminal.component.scss']
})
export class ViewLimitTerminalComponent implements OnInit {
  expandedElement: any;
  displayedColumns: any[] =
  ['officeName', 'terminalId',
   'terminalName', 'limitDefault',
   'limitMovement' , 'limitRemain'];
  dataSource: any[] = [];
  formFilter: FormGroup;
  terminalFilter: any[] = [];
  terminalList: any[] = [];
  offices: any[] = [];
  staffs: any[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  commonOffices: any[] = this.bankService.documentOffices;


  showOfficeName(officeId: number) {
    let officeInfo =  this.offices?.filter((o: any) => o.officeId == officeId) ;
    return officeInfo[0]?.name;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private bankService: BanksService,

  ) {
    this.route.data.subscribe((data: { terminalData: any }) => {
      this.dataSource = data?.terminalData?.result?.listLimitPos;
      this.offices = this.commonOffices;
      this.dataSource.forEach((data: any) => {
        data.officeName = this.showOfficeName(data.officeId);
      })
      this.terminalFilter = this.dataSource;
      this.loadData();

    });

    this.formFilter = this.formBuilder.group({
      'officeName': [''],
      'terminalName': ['']
    });
  }

  sortData(sort: any) {
    this.terminalFilter = this.terminalFilter.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'terminalId': return this.compare(a.terminalId, b.terminalId, isAsc);
        case 'terminalName': return this.compare(a.terminalName, b.terminalName, isAsc);
        case 'limitDefault': return this.compare(a.limitAmountDefault, b.limitAmountDefault, isAsc);
        case 'limitMovement': return this.compare(a.limitAmountMovement, b.limitAmountMovement, isAsc);
        case 'limitRemain': return this.compare(a.limitRemain, b.limitRemain, isAsc);
        default: return 0;
      }
    });
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadData())
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.formFilter.valueChanges.subscribe(e => [
      this.filterData()
    ]);
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  loadData() {
    setTimeout(() => {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    this.terminalList = this.terminalFilter.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

    });
  }

  filterData() {
    const form = this.formFilter.value;
    const keys = Object.keys(form);
    this.terminalFilter = this.dataSource.filter(v => {
      for (const key of keys) {
        if (form[key] && !String(v[key]).toLowerCase().includes(String(form[key]).toLowerCase())) {
          return false;
        }
      }
      return true;
    });
    this.paginator.pageIndex = 0;
    this.loadData();
  }
}
