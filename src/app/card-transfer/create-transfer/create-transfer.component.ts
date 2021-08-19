import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Logger } from 'app/core/logger/logger.service';
import { AlertService } from 'app/core/alert/alert.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { TransactionService } from '../../transactions/transaction.service';
import { MidasClientService } from 'app/midas-client/midas-client.service';
import { MatTable } from '@angular/material/table';
import { ClientsService } from 'app/clients/clients.service';
import { isThisSecond } from 'date-fns';
import { BanksService } from 'app/banks/banks.service';

const log = new Logger('Batch Txn');

export interface Element {
  transferDate: Date;
  cardNumber: string;
  customerName: string;
  cardId: string;
}

@Component({
  selector: 'midas-create-transfer-transaction',
  templateUrl: './create-transfer.component.html',
  styleUrls: ['./create-transfer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '100px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateTransferComponent implements OnInit {
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private transactionServices: TransactionService,
    private midasClientService: MidasClientService,
    private clientService: ClientsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private bankService: BanksService
  ) {
    this.currentUser = this.authenticationService.getCredentials();
    this.officeId = this.currentUser.officeId;
  }
  dataSource: any[] = []; // reset
  cardFilter = new FormControl('');
  shipperFilter = new FormControl('');
  deliverFilter = new FormControl('');
  officeFilter = new FormControl('');
  staffFilter = new FormControl('');
  displayedColumns: any[] = ['transferDate', 'customerName', 'cardNumber', 'cardId'];

  editAddNew: any[] = []; // reset
  ediDelete: any[] = []; // reset

  clients: any[] = [];
  members: any[] = [];
  offices: any[] = [];
  shippers: any[] = [];
  queryParams: any;
  group: any;
  currentUser: any;
  officeId: any;
  filteredOptions: any;
  officeFilteredptions: any;
  staffFilteredptions: any;
  shipperFilteredptions: any;
  transferRefNo = ''; // reset
  flagEditTransfer = 0; // 0-> create new; 1 -> edit
  today = new Date();

  @ViewChild(MatTable) table!: MatTable<Element>;

  private _filter(value: string): string[] {
    const filterValue = String(value).toUpperCase().replace(/\s+/g, '');
    return this.clients.filter((option: any) => {
      return (
        option.id.toUpperCase().replace(/\s+/g, '').includes(filterValue) ||
        option.displayName.toUpperCase().replace(/\s+/g, '').includes(filterValue) ||
        option.documentKey.toUpperCase().replace(/\s+/g, '').includes(filterValue)
      );
    });
  }

  private _filterShipper(value: string): string[] {
    const filterValue = String(value).toUpperCase().replace(/\s+/g, '');
    return this.shippers.filter((option: any) => {
      return option.displayName.toUpperCase().replace(/\s+/g, '').includes(filterValue);
    });
  }

  private _filterStaff(value: string): string[] {
    const filterValue = String(value).toUpperCase().replace(/\s+/g, '');
    return this.members.filter((option: any) => {
      return option.displayName.toUpperCase().replace(/\s+/g, '').includes(filterValue);
    });
  }

  displayClient(client: any): string | undefined {
    return client ? `${client.id} ~ ${client.displayName} ~ ${client.documentKey}` : undefined;
  }

  displayShipper(shipper: any): string | undefined {
    return shipper ? `${shipper.displayName}` : undefined;
  }

  displayStaff(staff: any): string | undefined {
    return staff ? `${staff.displayName}` : undefined;
  }

  resetAutoCompleteClients() {
    // this.profileForm.controls.cardFilter.setValue("");
    this.filteredOptions = this.cardFilter.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value))
    );
  }

  resetAutoCompleteShipper() {
    this.shipperFilter.setValue('');
    this.shipperFilteredptions = this.shipperFilter.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filterShipper(value))
    );
  }

  resetAutoCompleteStaff() {
    this.staffFilter.setValue('');
    this.staffFilteredptions = this.staffFilter.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filterStaff(value))
    );
  }

  ngOnInit(): void {
    this.initDataSource();
    console.log('this.transferRefNo: ', this.transferRefNo);
    this.deliverFilter.setValue(this.currentUser.staffDisplayName);
    this.filteredOptions = new Observable<any[]>();
    this.shipperFilteredptions = new Observable<any[]>();
    this.staffFilteredptions = new Observable<any[]>();
    this.getShipperInfo();
    this.getOffices();
    this.officeFilter.setValue(this.officeId);
    this.getStaffInfo(this.officeId);
    this.resetAutoCompleteStaff();

    this.officeFilter.valueChanges.subscribe((e) => [this.getStaffInfo(this.officeFilter.value)]);
  }

  initDataSource() {
    // rout from manage transfer page
    this.transferRefNo = this.route.snapshot.queryParams['transferRefNo'];
    this.transactionServices.getDetailByTransferRefNo(this.transferRefNo, this.officeId).subscribe((data) => {
      if (data.result.listDetailRequest.length > 0) {
        this.flagEditTransfer = 1;
        this.dataSource = data.result.listDetailRequest;
        this.table.renderRows();
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  formatLong(value: any) {
    return Number(String(value).replace(/[^0-9]+/g, ''));
  }

  formatCurrency(value: string) {
    value = String(value);
    const neg = value.startsWith('-');
    value = value.replace(/[-\D]/g, '');
    value = value.replace(/(\d{3})$/, ',$1');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    value = value !== '' ? '' + value : '';
    if (neg) {
      value = '-'.concat(value);
    }
    return value;
  }

  deleteRow(form: any) {
    if (this.flagEditTransfer === 1) {
      this.ediDelete.push(form.cardId);
    }
    this.dataSource = this.dataSource.filter((v) => v.cardId !== form.cardId);
  }

  getStaffInfo(officeId: any) {
    this.clientService.getStaffsByOffice(officeId).subscribe((data) => {
      this.members = data.result.listStaff;
      this.resetAutoCompleteStaff();
    });
  }

  getOffices() {
    this.group = this.officeId;
    this.bankService.getListOfficeCommon().subscribe((offices: any) => {
      this.offices = offices.result.listOffice;
      console.log('this.offices: ', this.offices);
    });
  }

  getShipperInfo() {
    this.transactionServices.getShippersCardTransfer().subscribe((data) => {
      this.shippers = data.result.listShipper;
    });
  }

  searchClientAndGroup(query: string): void {
    this.midasClientService.searchClientByNameAndExternalIdAndPhoneAndDocumentKey(query).subscribe((data: any) => {
      this.clients = data.result.listClientSearch;
      this.resetAutoCompleteClients();
    });
  }
  addWaitingList() {
    if (this.flagEditTransfer === 1) {
      this.editAddNew.push(this.updateTable().cardId);
    }
    this.dataSource.push(this.updateTable());
    this.table.renderRows();
    this.changeDetectorRefs.detectChanges();
  }

  save() {
    console.log('flagEditTransfer: ', this.flagEditTransfer);
    // create new
    if (this.flagEditTransfer === 0) {
      console.log('Create new!!!');
      this.queryParams = this.getData();
      console.log('queryParams: ', this.queryParams);
      this.transactionServices.saveCardTransfer(this.queryParams).subscribe((data) => {
        const statusCode = data.statusCode;
        this.transferRefNo = data.result.cardTransfer;
        if (statusCode === 'success') {
          this.alertService.alert({ message: 'Biên bản giao nhận lưu thành công.', msgClass: 'cssSuccess' });
        } else {
          this.alertService.alert({ message: 'Biên bản giao nhận lưu thất bại.', msgClass: 'cssError' });
        }
      });
    } else {
      console.log('Edit from manage page!!!');
      // add detail
      if (this.editAddNew.length > 0) {
        this.transactionServices
          .addDetailCardTransfer(this.transferRefNo, this.officeId, this.editAddNew)
          .subscribe((data) => {
            const statusCode = data.statusCode;
            console.log('Result add detail: ', statusCode);
            this.editAddNew = [];
            this.dataSource = this.dataSource.filter((v) => v.cardId !== this.editAddNew);
          });
      }

      // delete detail
      if (this.ediDelete.length > 0) {
        this.transactionServices
          .deleteDetailCardTransfer(this.transferRefNo, this.officeId, this.ediDelete)
          .subscribe((data) => {
            const statusCode = data.statusCode;
            console.log('Result delete detail: ', statusCode);
            this.ediDelete = [];
            this.dataSource = this.dataSource.filter((v) => v.cardId !== this.ediDelete);
          });
      }
      this.alertService.alert({ message: 'Biên bản giao nhận đã cập nhật.', msgClass: 'cssSuccess' });
    }
  }

  updateTable(): Element {
    return {
      transferDate: new Date(),
      cardNumber: this.cardFilter.value.documentKey,
      customerName: this.cardFilter.value.displayName,
      cardId: this.cardFilter.value.documentId,
    };
  }

  getData() {
    const listCardId = [];
    let i = -1;
    while (++i < this.dataSource.length) {
      const element = this.dataSource[i];
      listCardId.push(element.cardId);
    }
    return {
      transferRefNo: '',
      senderStaffId: this.currentUser.staffId,
      actionStaffId: this.shipperFilter.value.staffId,
      receiverStaffId: this.staffFilter.value.staffId,
      listCardId: listCardId,
    };
  }

  doAction() {
    console.log('this.transferRefNo: ', this.transferRefNo);
    if (this.transferRefNo === '') {
      this.alertService.alert({ message: 'Biên bản giao nhận chưa được lưu.', msgClass: 'cssError' });
      return;
    }
    const queryParams: any = {
      shipper: this.shipperFilter.value.displayName,
      senderStaffName: this.currentUser.staffDisplayName,
      receiverStaffName: this.staffFilter.value.displayName,
      transferRefNo: this.transferRefNo,
    };
    this.router.navigate(['../export'], { relativeTo: this.route, queryParams: queryParams });
  }

  reset() {
    this.dataSource = [];
    this.transferRefNo = '';
    this.flagEditTransfer = 0;
  }
}
