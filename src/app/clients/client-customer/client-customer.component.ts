import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";

import { MatCheckbox } from "@angular/material/checkbox";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ClientsDataSource } from "../clients.datasource";

/** rxjs Imports */
import { merge } from "rxjs";
import { tap } from "rxjs/operators";
import { animate, state, style, transition, trigger } from "@angular/animations";

/** Custom Services */
import { ClientsService } from "../clients.service";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { MidasClientService } from "../../midas-client/midas-client.service";

//** Logger */
import { Logger } from "../../core/logger/logger.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CentersService } from "app/centers/centers.service";
import { BanksService } from "app/banks/banks.service";
const log = new Logger("Client-customer");

@Component({
  selector: "midas-client-customer",
  templateUrl: "./client-customer.component.html",
  styleUrls: ["./client-customer.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "100px" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class ClientCustomerComponent implements OnInit, AfterViewInit {
  @ViewChild("showClosedAccounts", { static: true }) showClosedAccounts: MatCheckbox;

  expandedElement: any;
  displayedColumns = ["name", "clientno", "externalid", "status", "mobileNo", "gender", "office", "staff", "link"];
  dataSource: ClientsDataSource;
  /** Get the required filter value. */
  searchValue = "";
  /** Client Type:
   * Staff: 22
   * Customer: 23
   */
  clientType: string = "";
  createButtonName: string = "";
  tabWillView: string = "identities";
  tabQueryParams: any = { typeViewClient: "view" };
  ctype: any;
  currentUser: any;
  staffs: any[] = [];
  offices: any = [];
  formFilter: FormGroup;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private clientsService: ClientsService,
    private centersService: CentersService,
    private route: ActivatedRoute,
    private router: Router,
    private bankService: BanksService,
    private midasClientService: MidasClientService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty("detailRow");

  ngOnInit() {
    // @ts-ignore
    const { value } = this.route.queryParams;
    this.currentUser = this.authenticationService.getCredentials();
    this.formFilter = this.formBuilder.group({
      staffId: [null],
      officeId: [null],
    });

    this.formFilter.get("officeId").valueChanges.subscribe((result: any) => {
      this.formFilter.get("staffId").setValue(null);
      this.applyFilter(this.searchValue);
      this.centersService.getStaff(result).subscribe((result: any) => {
        this.staffs = result?.staffOptions?.filter((staff: any) => staff.displayName.startsWith("R"));
        this.staffs.unshift({
          id: null,
          displayName: "Tất cả",
        });
      });
    });

    this.formFilter.get("staffId").valueChanges.subscribe((result: any) => {
      this.applyFilter(this.searchValue);
    });

    // this.clientsService.getOffices().subscribe((offices: any) => {
    //   this.offices = offices;
    this.bankService.getListOfficeCommon(this.currentUser.officeHierarchy).subscribe((offices: any) => {
      this.offices = offices.result.listOffice;
      this.staffs.unshift({
        id: null,
        name: "Tất cả",
      });
    });

    this.route.data.subscribe((v) => {
      switch (v.ctype) {
        case "staff":
          this.clientType = "22,143";
          this.createButtonName = "Thêm nhân viên";
          break;
        case "ic":
          this.clientType = "23";
          this.createButtonName = "Thêm đối tác máy";
          this.tabWillView = "general";
          this.tabQueryParams = { typeViewClient: "view", clientType: "ic" };

          break;
        default:
          this.clientType = "21";
          this.createButtonName = "Thêm khách hàng";
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
    log.debug("start page");
    this.getClients();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page, this.showClosedAccounts.change)
      .pipe(tap(() => this.loadClientsPage()))
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
      this.router.navigate([], {
        queryParams: queryParams,
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });

      const officeId = this.formFilter.get("officeId").value ? this.formFilter.get("officeId").value : null;
      const staffId = this.formFilter.get("staffId").value ? this.formFilter.get("staffId").value : null;
      // this.dataSource.getClients(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked);
      this.dataSource.getClients(
        this.clientType,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize,
        !this.showClosedAccounts.checked,
        officeId,
        staffId
      );
    }
  }

  /**
   * Initializes the data source for clients table and loads the first page.
   */
  getClients() {
    this.dataSource = new ClientsDataSource(this.clientsService, this.midasClientService);
    // this.dataSource.getClients(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, !this.showClosedAccounts.checked);
    this.dataSource.getClients(
      this.clientType,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      !this.showClosedAccounts.checked
    );
    log.debug("Data Source:" + this.dataSource);
  }

  /**
   * Filter Client Data
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string = "") {
    const officeId = this.formFilter.get("officeId").value ? this.formFilter.get("officeId").value : null;
    const staffId = this.formFilter.get("staffId").value ? this.formFilter.get("staffId").value : null;
    this.searchValue = filterValue;
    this.dataSource.filterClients(
      filterValue,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      !this.showClosedAccounts.checked,
      this.clientType,
      officeId,
      staffId
    );
    // this.paginator.pageIndex = 0;
  }
}
