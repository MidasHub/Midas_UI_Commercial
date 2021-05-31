import { Component, OnInit, ViewChild, ChangeDetectorRef  } from "@angular/core";
import { FormControl } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { Logger } from "app/core/logger/logger.service";
import { AlertService } from "app/core/alert/alert.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { TransactionService } from "../../transactions/transaction.service";
import { MidasClientService } from "app/midas-client/midas-client.service";
import { MatTable } from "@angular/material/table";
import { ClientsService } from "app/clients/clients.service";
import { isThisSecond } from "date-fns";

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
  dataSource: any[] = [];
  cardFilter = new FormControl("");
  shipperFilter = new FormControl("");
  deliverFilter = new FormControl("");
  staffFilter = new FormControl("");
  displayedColumns: any[] = ["transferDate", "customerName", "cardNumber", "documentId"];

  clients: any[] = [];
  members: any[] = [];
  shippers: any[] = [];
  queryParams: any;
  group: any;
  currentUser: any;

  filteredOptions: any;
  staffFilteredptions: any;
  shipperFilteredptions: any
  transferRefNo = "";

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
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private transactionServices: TransactionService,
    private midasClientService: MidasClientService,
    private clientService: ClientsService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.currentUser = this.authenticationService.getCredentials();
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
    this.filteredOptions = this.cardFilter.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filter(value))
    );
  }

  resetAutoCompleteShipper() {
    this.shipperFilter.setValue("");
    this.shipperFilteredptions = this.shipperFilter.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filterShipper(value))
    );
  }

  resetAutoCompleteStaff() {
    this.staffFilter.setValue("");
    this.staffFilteredptions = this.staffFilter.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filterStaff(value))
    );
  }

  ngOnInit(): void {
    this.deliverFilter.setValue(this.currentUser.staffDisplayName);
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
    this.dataSource = this.dataSource.filter((v) => v.documentId !== form.documentId);
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
    this.dataSource.push(this.updateTable());
    this.table.renderRows();
    this.changeDetectorRefs.detectChanges();
  }

  save() {
    this.queryParams = this.getData();
    this.transactionServices.saveCardTransfer(this.queryParams).subscribe((data) => {
      let statusCode = data.statusCode;
      this.transferRefNo = data.result.cardTransfer;
      if (statusCode=="success") {
        this.alertService.alert({message: 'Biên bản giao nhận lưu thành công.', msgClass: 'cssSuccess'});
      }
      else{
        this.alertService.alert({message: 'Biên bản giao nhận lưu thất bại.', msgClass: 'cssError'});
      }
    });
  }

  updateTable(): Element {
    return {
      transferDate: new Date(),
      cardNumber: this.cardFilter.value.documentKey,
      customerName: this.cardFilter.value.displayName,
      documentId: this.cardFilter.value.documentId
    };
  }

  getData() {
    let listCardId = [];
    let i = -1;
    while (++i < this.dataSource.length) {
      let element = this.dataSource[i];
      listCardId.push(element.documentId);
    }
    return {
      transferRefNo: "",
      senderStaffId: this.currentUser.staffId,
      actionStaffId: this.shipperFilter.value.staffId,
      receiverStaffId: this.staffFilter.value.staffId,
      listCardId: listCardId
    };
  }

  doAction() {
    console.log("this.transferRefNo: ", this.transferRefNo);
    if (this.transferRefNo=="") {
      this.alertService.alert({message: 'Biên bản giao nhận chưa được lưu.', msgClass: 'cssError'});
      return;
    }
    const queryParams: any = {
      // dataSource: JSON.stringify(this.dataSource),
      shipper: this.shipperFilter.value.displayName,
      senderStaffName: this.currentUser.staffDisplayName,
      receiverStaffName: this.staffFilter.value.displayName,
      transferRefNo: this.transferRefNo
    };
    this.router.navigate(['../export'], { relativeTo: this.route, queryParams: queryParams });
  }

  reset(){
    this.dataSource = [];
    this.transferRefNo = "";
  }

}
