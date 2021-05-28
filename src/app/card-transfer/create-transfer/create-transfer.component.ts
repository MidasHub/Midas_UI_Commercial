import { Component, OnInit, ViewChild, ChangeDetectorRef  } from "@angular/core";
import { FormBuilder, FormControl, FormsModule } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { map, startWith, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { TerminalsService } from "app/terminals/terminals.service";
import { AddFeeDialogComponent } from "app/transactions/dialog/add-fee-dialog/add-fee-dialog.component";
import { Logger } from "app/core/logger/logger.service";
import { AlertService } from "app/core/alert/alert.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { ConfirmDialogComponent } from "app/transactions/dialog/confirm-dialog/confirm-dialog.component";
import { TransactionService } from "../../transactions/transaction.service";
import { MidasClientService } from "app/midas-client/midas-client.service";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { FormGroup } from "@angular/forms";
import { ClientsService } from "app/clients/clients.service";
import { DatePipe } from "@angular/common";

const log = new Logger("Batch Txn");

export interface Element {
  transferDate: Date;
  cardNumber: string;
  customerName: string;
  documentId: string;
}

@Component({
  selector: "midas-create-transfer-transaction",
  templateUrl: "./create-transfer.component.html",
  styleUrls: ["./create-transfer.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "100px" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})

export class CreateTransferComponent implements OnInit {
  dataSource = new MatTableDataSource<Element>();
  tableData: any;

  profileForm = new FormGroup({
    cardFilter: new FormControl(''),
    shipperFilter: new FormControl(''),
    deliverFilter: new FormControl(''),
    staffFilter: new FormControl(''),
  });
  //formFilter = new FormControl("");
  displayedColumns: any[] = ["transferDate", "customerName", "cardNumber", "documentId"];
  terminals: any[] = [];

  totalAmount = 0;
  totalRequest = 0;
  totalFee = 0;
  totalAmountTransaction = 0;
  totalTerminalAmount = 0;
  isRequiredTraceBatchNo: boolean = true;
  expandedElement: any;
  accountFilter: any[] = [];
  accountsShow: any[] = [];
  clients: any[] = [];
  members: any[] = [];
  shippers: any[] = [];
  group: any;

  currentUser: any;
  feeGroup: any;
  batchTxnName: any;
  isLoading: Boolean = false;
  bookingTxnDailyId: any;
  filteredOptions: any;
  staffFilteredptions: any;
  shipperFilteredptions: any
  terminalsMasters: any;
  today: any = new Date();
  txnDate: any = new Date();

  private _filter(value: string): string[] {
    const filterValue = String(value).toUpperCase().replace(/\s+/g, "");
    return this.clients.filter((option: any) => {
      return (
        option.id.toUpperCase().replace(/\s+/g, "").includes(filterValue) ||
        option.displayName.toUpperCase().replace(/\s+/g, "").includes(filterValue) ||
        option.documentKey.toUpperCase().replace(/\s+/g, "").includes(filterValue)
      );
    });
  }

  private _filterShipper(value: string): string[] {
    const filterValue = String(value).toUpperCase().replace(/\s+/g, "");
    return this.shippers.filter((option: any) => {
      return (
        option.displayName.toUpperCase().replace(/\s+/g, "").includes(filterValue)
      );
    });
  }

  private _filterStaff(value: string): string[] {
    const filterValue = String(value).toUpperCase().replace(/\s+/g, "");
    return this.members.filter((option: any) => {
      return (
        option.displayName.toUpperCase().replace(/\s+/g, "").includes(filterValue)
      );
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private transactionServices: TransactionService,
    private midasClientService: MidasClientService,
    private clientService: ClientsService,
    private datePipe: DatePipe,
    private terminalsService: TerminalsService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.currentUser = this.authenticationService.getCredentials();
    const { permissions } = this.currentUser;
    const permit_manager = permissions.includes("POS_UPDATE");
    if (permit_manager) {
      this.isRequiredTraceBatchNo = false;
    }
  }

  displayClient(client: any): string | undefined {
    return client
      ? `${client.id} ~ ${client.displayName} ~ ${client.documentKey}`
      : undefined;
  }

  displayShipper(shipper: any): string | undefined {
    return shipper
      ? `${shipper.displayName}`
      : undefined;
  }

  displayStaff(staff: any): string | undefined {
    return staff
      ? `${staff.displayName}`
      : undefined;
  }

  resetAutoCompleteClients() {
    //this.profileForm.controls.cardFilter.setValue("");
    this.filteredOptions = this.profileForm.controls.cardFilter.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filter(value))
    );
  }

  resetAutoCompleteShipper() {
    this.profileForm.controls.shipperFilter.setValue("");
    this.shipperFilteredptions = this.profileForm.controls.shipperFilter.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filterShipper(value))
    );
  }

  resetAutoCompleteStaff() {
    this.profileForm.controls.staffFilter.setValue("");
    this.staffFilteredptions = this.profileForm.controls.staffFilter.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filterStaff(value))
    );
  }

  ngOnInit(): void {
    this.profileForm.controls.deliverFilter.setValue(this.currentUser.staffDisplayName);
    this.filteredOptions = new Observable<any[]>();
    this.shipperFilteredptions = new Observable<any[]>();
    this.staffFilteredptions = new Observable<any[]>();
    this.getShipperInfo();
    this.getStaffInfo();
  }

  formatLong(value: any) {
    return Number(String(value).replace(/[^0-9]+/g, ""));
  }

  formatCurrency(value: string) {
    value = String(value);
    const neg = value.startsWith("-");
    value = value.replace(/[-\D]/g, "");
    value = value.replace(/(\d{3})$/, ",$1");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    value = value !== "" ? "" + value : "";
    if (neg) {
      value = "-".concat(value);
    }

    return value;
  }

  deleteRow(form: any) {
    //this.dataSource = this.dataSource.filter((v) => v.get("index").value !== form.get("index").value);
    this.dataSource.data = this.dataSource.data.filter((v) => v.documentId !== form.documentId);
  }

  addFeeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: {
        txnCode: this.batchTxnName,
      },
    };
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(AddFeeDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe((data) => {
      if (data) {
      }
    });
  }

  onSave(form: any) {
    if (form.invalid || !form.get("terminalId").value) {
      return this.alertService.alert({
        message: "Vui lòng điền đầy đủ thông tin",
        msgClass: "cssDanger",
      });
    }

    let messageConfirm = `Bạn chắc chắn muốn lưu giao dịch?`;
    let traceNo = form.get("tid").value;
    let batchNo = form.get("batchNo").value;

    if (!traceNo || !batchNo || traceNo.trim().length == 0 || batchNo.trim().length == 0) {
      messageConfirm = `Hệ thống ghi nhận đây là giao dịch treo (do không có mã lô và mã hóa đơn), bạn chắc chắn muốn lưu giao dịch?`;
    }

    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: messageConfirm,
        title: "Hoàn thành giao dịch",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        const formData = { ...form.data.member, ...form.value };
        delete formData.index;
      }
    });
  }

  sortData(sort: any) {
    this.accountFilter = this.accountFilter.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const key = sort.active;
      return this.compare(a[key], b[key], isAsc);
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getStaffInfo() {
    this.group = `${this.currentUser.officeId}`;
    this.clientService.getStaffsByOffice(this.group).subscribe((data) => {
      this.members = data.result.listStaff;
    });
  }

  getShipperInfo() {
    this.transactionServices.getShippersCardTransfer().subscribe((data) => {
      this.shippers = data.result.listShipper;
    });
  }

  searchClientAndGroup(query: string): void {
    this.midasClientService.searchClientByNameAndExternalIdAndPhoneAndDocumentKey(query).subscribe((data: any) =>{
      this.clients = data.result.listClientSearch;
      this.resetAutoCompleteClients();
    });
  }

  @ViewChild(MatTable) table: MatTable<Element>;
  addWaitingList() {
    this.dataSource.data.push(this.updateTable());
    this.table.renderRows();
    this.changeDetectorRefs.detectChanges();
  }

  save() {
    let dataTemp = this.getData();
    console.log("dataTemp:", dataTemp);
    this.transactionServices.saveCardTransfer(dataTemp).subscribe((data) => {
      this.members = data?.result?.listMemberGroupWithIdentifier;
      let statusCode = data.statusCode;
      if (statusCode=="success") {
        console.log("success:", statusCode);
      }
      else{
        console.log("error:", statusCode);
      }
    });
  }

  updateTable(): Element {
    return {
      transferDate: new Date(),
      cardNumber: this.profileForm.controls.cardFilter.value.documentKey,
      customerName: this.profileForm.controls.cardFilter.value.displayName,
      documentId: this.profileForm.controls.cardFilter.value.documentId
    };
  }

  getData() {
    let listCardId = [];
    let i = -1;
    while (++i < this.dataSource.data.length) {
      let element = this.dataSource.data[i];
      listCardId.push(element.documentId);
    }
    return {
      transferRefNo: "",
      senderStaffId: this.currentUser.staffId,
      actionStaffId: this.profileForm.controls.shipperFilter.value.staffId,
      receiverStaffId: this.profileForm.controls.staffFilter.value.staffId,
      listCardId: listCardId
    };
  }

}
