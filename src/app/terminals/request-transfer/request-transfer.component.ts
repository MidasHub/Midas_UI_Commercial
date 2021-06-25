import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/core/alert/alert.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { SettingsService } from 'app/settings/settings.service';
import { TransactionService } from 'app/transactions/transaction.service';
import { RateTerminalComponent } from '../rate-terminal/rate-terminal.component';
import { TerminalObj } from '../terminal-obj.model';
import { TerminalsService } from '../terminals.service';

@Component({
  selector: 'midas-view-limit-terminal',
  templateUrl: './request-transfer.component.html',
  styleUrls: ['./request-transfer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RequestTransferComponent implements OnInit {
  [x: string]: any;
  dataSource: any[] = [];
  dataFilter: any[] = [];
  dataShow: any[] = [];
  displayedColumns: any[] = ["terminalId", "senderExternalId", "receiverExternalId", "rate", "status", "createdBy", "createdDate"];
  terminalId: string;
  formDate: FormGroup;
  formFilter: FormGroup;
  isLoading: boolean = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild('Table2Paginator', {static: true}) table2Paginator: MatPaginator;
  @ViewChild('Table2Sort', {static: true}) table2Sort: MatSort;

  constructor(
    private authenticationService: AuthenticationService,
    private transactionServices: TransactionService,
    private settingsService: SettingsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private terminalsService: TerminalsService,
    public dialog: MatDialog
  )
  {
    this.formFilter = this.formBuilder.group({
      'terminalId': [''],
      'receiverExternalId': [''],
    });
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
    });
  }

  ngOnInit(): void {
    this.formFilter.valueChanges.subscribe(e => [
      this.filterData()
    ]);
    //console.log("tratt");
    //this.getAllRequest();
    // this.formFilter.valueChanges.subscribe(e => [
    //   this.reLoad()
    // ]);
  }

  get fromDateAndToDate() {
    const fromDate = this.formDate.get("fromDate").value;
    const toDate = this.formDate.get("toDate").value;
    if (fromDate && toDate) {
      return true;
    }
    return false;
  }

  searchByTerminalId(){
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((fromDate - toDate) / oneDay));
    if (diffDays > 31) {
      const message = `Chỉ cho phép xem giao dịch trong vòng 1 tháng (không lớn hơn 31 ngày)`;
      this.alertService.alert({
        msgClass: "cssWarning",
        message: message,
      });
      return;
    }

    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }

    this.terminalsService.searchRequestTransfer(fromDate, toDate).subscribe((data: any) => {
      this.dataSource = data.result.listRequestEntity;
      this.dataFilter = this.dataSource;
      this.loadData();
      console.log("this.dataSource: ", this.dataSource);
    });
  }

  filterData() {
    const form = this.formFilter.value;
    const keys = Object.keys(form);
    console.log("form: ", form);
    console.log("keys: ", keys);
    this.dataFilter = this.dataSource.filter(v => {
      for (const key of keys) {
        console.log("key: ", key);
        console.log("form[key]: ", String(form[key]));
        console.log("v[key]: ", String(v[key]));
        if (form[key] && !String(v[key]).trim().toLowerCase().includes(String(form[key]).trim().toLowerCase())) {
          return false;
        }
      }
      return true;
    });
    console.log("dataFilter: ", this.dataFilter);
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  loadData() {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    this.dataShow = this.dataFilter.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  }

  openDialog(form: any): void {
    const dialogRef = this.dialog.open(RateTerminalComponent, {
      width: '1300px',
      data: {terminalId: form.terminalId}
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }

}
