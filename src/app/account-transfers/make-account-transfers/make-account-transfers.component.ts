import { filter } from "rxjs/operators";
/** Angular Imports */
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";

/** Custom Services */
import { AccountTransfersService } from "../account-transfers.service";
import { SettingsService } from "app/settings/settings.service";
import { ClientsService } from "app/clients/clients.service";

/**
 * Create account transfers
 */
@Component({
  selector: "mifosx-make-account-transfers",
  templateUrl: "./make-account-transfers.component.html",
  styleUrls: ["./make-account-transfers.component.scss"],
})
export class MakeAccountTransfersComponent implements OnInit, AfterViewInit {
  /** Standing Instructions Data */
  accountTransferTemplateData: any;
  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date(2100, 0, 1);
  /** Edit Standing Instructions form. */
  makeAccountTransferForm: FormGroup;
  /** To Office Type Data */
  toOfficeTypeData: any;
  /** To Client Type Data */
  toClientTypeData: any;
  /** To Account Type Data */
  toAccountTypeData: any;
  /** To Account Data */
  toAccountData: any;
  /** Account Type Id */
  accountTypeId: any;
  /** Account Type */
  accountType: any;
  /** Savings Id or Loans Id */
  id: any;
  /** Clients Data */
  clientsData: any;
  clientsDataOrigin: any;

  accessToken: any;
  private credentialsStorageKey = "midasCredentials";

  /**
   * Retrieves the standing instructions template from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {FormBuilder} formBuilder Form Builder
   * @param {Router} router Router
   * @param {AccountTransfersService} accountTransfersService Account Transfers Service
   * @param {DatePipe} datePipe Date Pipe
   * @param {SettingsService} settingsService Settings Service
   * @param {ClientsService} clientsService Clients Service
   */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountTransfersService: AccountTransfersService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private clientsService: ClientsService
  ) {
    this.route.data.subscribe((data: { accountTransferTemplate: any }) => {
      this.accountTransferTemplateData = data.accountTransferTemplate;
      this.setParams();
      this.setOptions();
    });
  }
  /** Sets the value from the URL */
  setParams() {
    this.accountType = this.route.snapshot.queryParams["accountType"];
    switch (this.accountType) {
      case "fromloans":
        this.accountTypeId = "1";
        this.id = this.route.snapshot.queryParams["loanId"];
        break;
      case "fromsavings":
        this.accountTypeId = "2";
        this.id = this.route.snapshot.queryParams["savingsId"];
        break;
      default:
        this.accountTypeId = "0";
    }
  }

  /**
   * Creates and sets the create standing instructions form.
   */
  ngOnInit() {
    this.createMakeAccountTransferForm();
  }

  /**
   * Creates the standing instruction form.
   */
  createMakeAccountTransferForm() {
    this.makeAccountTransferForm = this.formBuilder.group({
      toOfficeId: ["", Validators.required],
      toClientId: ["", Validators.required],
      toAccountType: ["", Validators.required],
      toAccountId: ["", Validators.required],
      transferAmount: [this.accountTransferTemplateData.transferAmount, Validators.required],
      transferDate: ["", Validators.required],
      transferDescription: ["", Validators.required],
    });
  }

  /** Sets options value */
  setOptions() {
    this.toOfficeTypeData = this.accountTransferTemplateData.toOfficeOptions;
    this.toAccountTypeData = this.accountTransferTemplateData.toAccountTypeOptions;
    this.toAccountData = this.accountTransferTemplateData.toAccountOptions;
    //this.toClientTypeData = this.accountTransferTemplateData.toClientOptions;
  }

  /** Executes on change of various select options */
  changeEvent() {
    const formValue = this.refineObject(this.makeAccountTransferForm.value);
    if (formValue) {
      this.accountTransfersService
        .newAccountTranferResource(this.id, this.accountTypeId, formValue)
        .subscribe((response: any) => {
          this.accountTransferTemplateData = response;
          this.toClientTypeData = response.toClientOptions;
          this.setOptions();
        });
    }
  }

  changeOffice() {
    const formValue = this.refineObject(this.makeAccountTransferForm.value);
    if (formValue) {
      this.clientsService.getFilteredClients("id", "ASC", true, "", formValue.toOfficeId).subscribe((data: any) => {
        this.clientsData = data.pageItems;
        this.clientsDataOrigin = data.pageItems;

        this.makeAccountTransferForm.controls.toClientId.reset();
        this.makeAccountTransferForm.controls.toAccountType.reset();
        this.makeAccountTransferForm.controls.toAccountId.reset();
      });
    }
  }

  /** Refine Object
   * Removes the object param with null or '' values
   */
  refineObject(dataObj: { [x: string]: any; transferAmount: any; transferDate: any; transferDescription: any }) {
    delete dataObj.transferAmount;
    delete dataObj.transferDate;
    delete dataObj.transferDescription;
    if (dataObj.toClientId) {
      dataObj.toClientId = dataObj.toClientId.id;
    }
    const propNames = Object.getOwnPropertyNames(dataObj);
    for (let i = 0; i < propNames.length; i++) {
      const propName = propNames[i];
      if (dataObj[propName] === null || dataObj[propName] === undefined || dataObj[propName] === "") {
        delete dataObj[propName];
      }
    }
    return dataObj;
  }

  /**
   * Subscribes to Clients search filter:
   */
  ngAfterViewInit() {
    this.makeAccountTransferForm.controls.toClientId.valueChanges.subscribe((value: any) => {
      // reset account choose if exist
      if (!value || !this.clientsDataOrigin) {
        return;
      }
      this.makeAccountTransferForm.controls.toAccountType.reset();
      this.makeAccountTransferForm.controls.toAccountId.reset();
      this.clientsData = this.clientsDataOrigin;

      this.clientsData = this.clientsData.filter((item: any) => {
        let clientName = value.displayName ? value.displayName : value;
        let status_string = item.status.value;
        return item.displayName.toUpperCase().includes(clientName.toUpperCase()) && status_string == "Active";
      });

    });
  }

  /**
   * Displays Client name in form control input.
   * @param {any} client Client data.
   * @returns {string} Client name if valid otherwise undefined.
   */
  displayClient(client: any): string | undefined {
    return client ? client.displayName : undefined;
  }

  /**
   * Submits the standing instructions form
   */
  submit() {
    this.accessToken = JSON.parse(
      sessionStorage.getItem(this.credentialsStorageKey) || localStorage.getItem(this.credentialsStorageKey)
    );
    const dateFormat = this.settingsService.dateFormat;
    const locale = this.settingsService.language.code;
    const makeAccountTransferData = {
      ...this.makeAccountTransferForm.value,
      transferDate: this.datePipe.transform(this.makeAccountTransferForm.value.transferDate, dateFormat),
      dateFormat,
      locale,
      toClientId: this.makeAccountTransferForm.controls.toClientId.value.id,
      fromAccountId: this.id,
      fromAccountType: this.accountTypeId,
      fromClientId: this.accountTransferTemplateData.fromClient
        ? this.accountTransferTemplateData.fromClient.id
        : this.accountTransferTemplateData.fromAccount.id,
      fromOfficeId: this.accountTransferTemplateData.fromClient
        ? this.accountTransferTemplateData.fromClient.officeId
        : this.accessToken.officeId,
    };
    this.accountTransfersService.createAccountTransfer(makeAccountTransferData).subscribe(() => {
      this.router.navigate(["../../transactions"], { relativeTo: this.route });
      console.log(this.router.navigate(["../../transactions"], { relativeTo: this.route }));
    });
  }
}
