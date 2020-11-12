import {Component, OnInit, ViewChild} from '@angular/core';
import {TransactionDatasource} from '../transaction.datasource';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TransactionService} from '../transaction.service';
import {MatPaginator} from '@angular/material/paginator';
import {DatePipe} from '@angular/common';
import {SettingsService} from '../../settings/settings.service';
import {AuthenticationService} from '../../core/authentication/authentication.service';
import * as moment from 'moment';
import {MatSort} from '@angular/material/sort';
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SavingsService} from '../../savings/savings.service';
import {SystemService} from '../../system/system.service';
import {CentersService} from '../../centers/centers.service';
import {AlertService} from '../../core/alert/alert.service';
import {MatDialog} from '@angular/material/dialog';
import {UploadDocumentDialogComponent} from '../../clients/clients-view/custom-dialogs/upload-document-dialog/upload-document-dialog.component';
import {ConfirmDialogComponent} from '../dialog/coifrm-dialog/confirm-dialog.component';
import {UploadBillComponent} from '../dialog/upload-bill/upload-bill.component';
import {ClientsService} from '../../clients/clients.service';
import {FormfieldBase} from '../../shared/form-dialog/formfield/model/formfield-base';
import {SelectBase} from '../../shared/form-dialog/formfield/model/select-base';
import {FormDialogComponent} from '../../shared/form-dialog/form-dialog.component';
import {InputBase} from '../../shared/form-dialog/formfield/model/input-base';

@Component({
  selector: 'midas-manage-transaction',
  templateUrl: './manage-transaction.component.html',
  styleUrls: ['./manage-transaction.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManageTransactionComponent implements OnInit {
  expandedElement: any;
  displayedColumns: string[] = ['productId', 'txnDate', 'trnRefNo', 'status',
    'officeName', 'agencyName', 'panHolderName', 'terminalAmount',
    'feeAmount', 'cogsAmount', 'pnlAmount', 'actions'
  ];
  formDate: FormGroup;
  formFilter: FormGroup;
  dataSource: any[];
  transactionsData: any[] = [];
  currentUser: any;
  transactionType: any[] = [
    {
      label: 'All',
      value: ''
    },
    {
      label: 'Giao dịch RTM',
      value: 'CA01'
    },
    {
      label: 'Giao dịch ĐHT',
      value: 'AL01'
    }, {
      label: 'Giao dịch test thẻ',
      value: 'TEST'
    },
    {
      label: 'Giao dịch lô lẻ',
      value: 'CA02'
    }
  ];
  statusOption: any[] = [
    {
      label: 'ALL',
      value: ''
    },
    {
      label: 'C',
      value: 'C'
    },
    {
      label: 'P',
      value: 'P'
    },
    {
      label: 'F',
      value: 'F'
    },
    {
      label: 'V',
      value: 'V'
    }
  ];
  partners: any[];
  staffs: any[];
  offices: any[];
  totalTerminalAmount = 0;
  totalFeeAmount = 0;
  totalCogsAmount = 0;
  totalPnlAmount = 0;
  panelOpenState = false;
  filterData: any[];
  today = new Date();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private formBuilder: FormBuilder,
              private transactionService: TransactionService,
              private datePipe: DatePipe,
              private settingsService: SettingsService,
              private authenticationService: AuthenticationService,
              private savingsService: SavingsService,
              private systemService: SystemService,
              private centersService: CentersService,
              private alertService: AlertService,
              public dialog: MatDialog,
              private clientsService: ClientsService
  ) {
    this.formDate = this.formBuilder.group({
      'fromDate': [new Date(new Date().setMonth(new Date().getMonth() - 1))],
      'toDate': [new Date()]
    });
    this.formFilter = this.formBuilder.group({
      'productId': [''],
      'status': [''],
      'partnerCode': [''],
      'officeId': [''],
      'panHolderName': [''],
      'terminalId': [''],
      'traceNo': [''],
      'batchNo': [''],
      'terminalAmount': [''],
      'staffId': [''],
      'trnRefNo': [''],
      'RetailsChoose': [true],
      'wholesaleChoose': [true],
      'agencyName': ['']
    });
    this.formFilter.get('officeId').valueChanges.subscribe((value => {
      // const office = this.offices.find(v => v.name === value);
      this.centersService.getStaff(value).subscribe((staffs: any) => {
        this.staffs = staffs?.staffOptions;
      });
    }));
    this.formFilter.valueChanges.subscribe(value => {
      this.filterTransaction();
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    this.dataSource = this.transactionsData;
    this.savingsService.getListPartner().subscribe(partner => {
      this.partners = partner?.result?.listPartner;
      // @ts-ignore
      this.partners.unshift({code: '', desc: 'ALL'});
    });
    this.systemService.getOffices().subscribe(offices => {
      this.offices = offices;
    });
    this.getTransaction();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.filterTransaction())
      )
      .subscribe();
  }

  getTransaction() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get('fromDate').value;
    let toDate = this.formDate.get('toDate').value;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.transactionService.getTransaction({fromDate, toDate}).subscribe(result => {
      const {permissions} = this.currentUser;
      const permit_userTeller = permissions.includes('TXNOFFICE_CREATE');
      if (!permit_userTeller) {
        result?.result?.listPosTransaction?.map((value: any) => {
          if (value?.createdBy === this.currentUser.userId
            || value?.staffId === this.currentUser.staffId) {
            this.transactionsData.push(value);
          }
        });
      } else {
        this.transactionsData = result?.result?.listPosTransaction;
      }
      this.totalTerminalAmount = 0;
      this.totalFeeAmount = 0;
      this.totalCogsAmount = 0;
      this.totalPnlAmount = 0;
      this.totalTerminalAmount = this.transactionsData.reduce((total: any, num: any) => {
        return total + Math.round(num?.terminalAmount);
      }, 0);
      this.totalFeeAmount = this.transactionsData.reduce((total: any, num: any) => {
        return total + Math.round(num?.feeAmount);
      }, 0);
      this.totalCogsAmount = this.transactionsData.reduce((total: any, num: any) => {
        return total + Math.round(num?.cogsAmount);
      }, 0);
      this.totalPnlAmount = this.transactionsData.reduce((total: any, num: any) => {
        return total + Math.round(num?.pnlAmount);
      }, 0);
      this.filterTransaction();
    });
  }

  filterTransaction() {
    const limit = this.paginator.pageSize;
    const offset = this.paginator.pageIndex * limit;
    const form = this.formFilter.value;
    const wholesaleChoose = form.wholesaleChoose;
    const RetailsChoose = form.RetailsChoose;
    delete form.wholesaleChoose;
    delete form.RetailsChoose;
    const keys = Object.keys(form);
    this.filterData = this.transactionsData.filter(v => {
      for (const key of keys) {
        if (form[key]) {
          if (!v[key]) {
            return false;
          }
          if (!String(v[key]).includes(form[key])) {
            return false;
          }
        }
      }
      const check_wholesaleChoose = wholesaleChoose ? v.type.startsWith('B') : false;
      const check_RetailsChoose = RetailsChoose ? v.type === 'cash' || v.type === 'rollterm' : false;
      if (!check_wholesaleChoose && !check_RetailsChoose) {
        return false;
      }
      return true;
    });
    this.dataSource = this.filterData.slice(offset, offset + limit);
    console.log(this.dataSource);
  }

  get fromDateAndToDate() {
    const fromDate = this.formDate.get('fromDate').value;
    const toDate = this.formDate.get('toDate').value;
    if (fromDate && toDate) {
      return true;
    }
    return false;
  }

  displayProductId(type: string) {
    return this.transactionType.find(v => v.value === type)?.label || 'N/A';
  }

  menuOpened() {
    console.log('menuOpened');
  }

  menuClosed() {
    console.log('menuClosed');
  }

  downloadVoucher(transactionId: string) {
    this.transactionService.downloadVoucher(transactionId);
  }

  downloadBill(clientId: string, documentId: string) {
    this.transactionService.downloadBill(clientId, documentId);
  }

  revertTransaction(transactionId: string) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Bạn chắc chắn muốn hủy giao dịch ' + transactionId,
        title: 'Hủy giao dịch'
      },
    });
    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.transactionService.revertTransaction(transactionId).subscribe(result => {
          if (result.status === '200') {
            this.getTransaction();
            const message = 'Hủy giao dịch ' + transactionId + ' thành công';
            this.alertService.alert({
              msgClass: 'cssInfo',
              message: message
            });
          }
        });
      }
    });
  }

  undoRevertTransaction(transactionId: string) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Bạn chắc chắn muốn hoàn tác giao dịch ' + transactionId,
        title: 'Hoàn tác giao dịch'
      },
    });
    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.transactionService.undoRevertTransaction(transactionId).subscribe(result => {
          if (result.status === '200') {
            this.getTransaction();
            const message = 'Hoàn tác giao dịch ' + transactionId + ' thành công';
            this.alertService.alert({
              msgClass: 'cssInfo',
              message: message
            });
          }
        });
      }
    });
  }

  uploadBill(custId: string, trnRefNo: string) {
    const dialog = this.dialog.open(UploadBillComponent, {});
    dialog.afterClosed().subscribe(data => {
      console.log(data);
      const {file} = data;
      const formData: FormData = new FormData();
      formData.append('name', file.name);
      formData.append('file', file);
      formData.append('fileName', file.name);
      if (data) {
        this.clientsService.uploadClientDocumenttenantIdentifier(custId, formData).subscribe(result => {
          console.log(result);
          if (result.resourceId) {
            const message = 'Tải lên bill giao dịch ' + trnRefNo + ' thành công';
            this.alertService.alert({
              msgClass: 'cssInfo',
              message: message
            });
          }
        });
      }
    });
  }

  addPosInformation(trnRefNo: string, batchNo: string, traceNo: string) {
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'traceNo',
        label: 'Trace No',
        value: traceNo,
        type: 'text',
        required: true
      }),
      new InputBase({
        controlName: 'batchNo',
        label: 'Batch No',
        value: batchNo,
        type: 'text',
        required: true
      }),
    ];
    const data = {
      title: 'Thêm thông tin máy POS',
      layout: {addButtonText: 'Xác nhận'},
      formfields: formfields
    };
    const dialog = this.dialog.open(FormDialogComponent, {data});
    dialog.afterClosed().subscribe((response: any) => {
      console.log(response);
      if (response.data) {
        const value = response.data.value;
        this.transactionService.uploadBosInformation(trnRefNo, value).subscribe(reslut => {
          console.log(reslut);
        });
      }
    });
  }

  exportTransaction() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get('fromDate').value;
    let toDate = this.formDate.get('toDate').value;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    const {permissions} = this.currentUser;
    const permit = permissions.includes('TXN_CREATE');
    const form = this.formFilter.value;
    let query = `fromDate=${fromDate}&toDate=${toDate}&permission=${!permit}&officeName=${form.officeId || 'ALL'}`;
    const keys = Object.keys(form);
    for (const key of keys) {
      if (key === 'staffId') {
        if (form[key]) {
          query = query + '&createdByFilter=' + form[key];
        } else {
          query = query + '&createdByFilter=ALL';
        }
      } else {
        const value = ['productId', 'status', 'partnerCode', 'officeName'].indexOf(key) === -1 ? form[key] : ((form[key] === '' || !form[key]) ? 'ALL' : form[key]);
        query = query + '&' + key + '=' + value;
      }

    }
    this.transactionService.exportTransaction(query);
  }
}
