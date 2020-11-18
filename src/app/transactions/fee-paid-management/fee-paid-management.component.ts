import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {TransactionService} from '../transaction.service';
import {DatePipe} from '@angular/common';
import {SettingsService} from '../../settings/settings.service';
import {AuthenticationService} from '../../core/authentication/authentication.service';
import {SavingsService} from '../../savings/savings.service';
import {SystemService} from '../../system/system.service';
import {CentersService} from '../../centers/centers.service';
import {AlertService} from '../../core/alert/alert.service';
import {MatDialog} from '@angular/material/dialog';
import {ClientsService} from '../../clients/clients.service';
import {merge} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ConfirmDialogComponent} from '../dialog/coifrm-dialog/confirm-dialog.component';
import {UploadBillComponent} from '../dialog/upload-bill/upload-bill.component';
import {FormfieldBase} from '../../shared/form-dialog/formfield/model/formfield-base';
import {InputBase} from '../../shared/form-dialog/formfield/model/input-base';
import {FormDialogComponent} from '../../shared/form-dialog/form-dialog.component';

@Component({
  selector: 'midas-fee-paid-management',
  templateUrl: './fee-paid-management.component.html',
  styleUrls: ['./fee-paid-management.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FeePaidManagementComponent implements OnInit {

  expandedElement: any;
  displayedColumns: string[] = ['txnDate',
    'officeName', 'txnType', 'agencyName', 'txnCode', 'batchNo',
    'traceNo', 'customerName', 'txnAmount', 'feePaid', 'feeRemain',
    'actions'
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


  paidPaymentType: any[] = [];

  paymentTypes: any[] = [
    {
      label: 'ALL',
      value: ''
    },
    {
      label: 'Thu',
      value: 'IN'
    },
    {
      label: 'Chi',
      value: 'OUT'
    }
  ];
  statusOption: any[] = [
    {
      label: 'ALL',
      value: ''
    },
    {
      label: 'Chưa xong',
      value: 'A'
    },
    {
      label: 'Đã xong',
      value: 'C'
    },
    // {
    //   label: 'F',
    //   value: 'F'
    // },
    {
      label: 'Đã hủy',
      value: 'V'
    }
  ];
  partners: any[];
  staffs: any[];
  offices: any[];
  totalFeeSum = 0;
  totalFeePaid = 0;
  totalFeeRemain = 0;
  panelOpenState = false;
  filterData: any[];
  groupData: any;
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
      'status': [''],
      'txnType': [''],
      'officeName': [''],
      'agencyName': [''],
      'customerName': [''],
      'traceNo': [''],
      'batchNo': [''],
      'txnPaymentType': [''],
      'createdBy': ['']
    });
    // this.formFilter.get('officeId').valueChanges.subscribe((value => {
    //   // const office = this.offices.find(v => v.name === value);
    // }));
    this.formFilter.valueChanges.subscribe(value => {
      this.filterTransaction();
    });
  }

  colorOfType(type: string) {
    if (type === 'IN') {
      return 'color: #007700;';
    }
    if (type === 'OUT') {
      return 'color: #660000;';
    }
    return '';
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    this.dataSource = this.transactionsData;
    this.savingsService.getListPartner().subscribe(partner => {
      this.partners = partner?.result?.listPartner;
      // @ts-ignore
      this.partners.unshift({code: '', desc: 'ALL'});
    });
    // this.systemService.getOffices().subscribe(offices => {
    //   this.offices = offices;
    //   this.offices.unshift({
    //
    //   })
    // });
    this.transactionService.getPaymentTypes().subscribe(result => {
      console.log(result); // listPayment
      this.paidPaymentType = result?.result?.listPayment;
      this.paidPaymentType.unshift({
        code: '',
        desc: 'ALL'
      });
    });
    this.centersService.getStaff(this.currentUser.officeId).subscribe((staffs: any) => {
      this.staffs = staffs?.staffOptions;
      this.staffs.unshift({
        id: '',
        displayName: 'ALL'
      });
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
    this.transactionService.getFeePaidTransactions(fromDate, toDate).subscribe(result => {
      const {permissions} = this.currentUser;
      const permit_userTeller = permissions.includes('TXNOFFICE_CREATE');
      if (!permit_userTeller) {
        this.transactionsData = [];
        result?.result?.listFeeTransaction?.map((value: any) => {
          if (value?.createdBy === this.currentUser.userId
            || value?.staffId === this.currentUser.staffId) {
            this.transactionsData.push(value);
          }
        });
      } else {
        this.transactionsData = result?.result?.listFeeTransaction;
      }
      this.transactionsData.map(v => {
        if (!v.agencyId) {
          v.agencyId = '#';
        }
        v.DEAmount = 0;
        if (v.txnType === 'BATCH') {
          v.customerName = v.txnCode;
          if (v.txnPaymentType === 'OUT') {
            v.DEAmount = v.txnAmount - v.feeSum;
          }
        }
      });
      this.totalFeeSum = 0;
      this.totalFeePaid = 0;
      this.totalFeeRemain = 0;
      this.totalFeeSum = this.transactionsData.reduce((total: any, num: any) => {
        return total + Math.round(num?.feeSum);
      }, 0);
      this.totalFeePaid = this.transactionsData.reduce((total: any, num: any) => {
        return total + Math.round(num?.feePaid);
      }, 0);
      this.totalFeeRemain = this.transactionsData.reduce((total: any, num: any) => {
        return total + Math.round(num?.feeRemain);
      }, 0);
      this.filterTransaction();
    });
  }

  checkPermissions(key: string) {
    const {permissions} = this.currentUser;
    return permissions.includes(key);
  }

  filterTransaction() {
    const limit = this.paginator.pageSize;
    const offset = this.paginator.pageIndex * limit;
    const form = this.formFilter.value;
    const keys = Object.keys(form);
    this.filterData = this.transactionsData.filter(v => {
      for (const key of keys) {
        if (form[key]) {
          if (!v[key]) {
            return false;
          }
          if (!String(v[key]).toLowerCase().includes(form[key].toLowerCase())) {
            return false;
          }
        }
      }
      return true;
    });
    // @ts-ignore
    this.groupData = this.groupBy(this.filterData, pet => pet.txnCode);
    console.log(this.groupData);
    this.dataSource = Array.from(this.groupData.keys()).slice(offset, offset + limit);
  }

  getDataOfGroupTxnCode(code: string) {
    return this.groupData?.get(code);
  }

  groupBy(list: any, keyGetter: any) {
    const map = new Map();
    list.forEach((item: any) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
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

  displayStatus(status: string) {
    switch (status) {
      case 'C':
        return 'Thành công';
      case 'P':
        return 'Chờ đợi';
      case 'V':
        return 'Hủy';
      default:
        return '';
    }
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
