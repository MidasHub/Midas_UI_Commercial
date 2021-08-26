import { filter } from "rxjs/operators";
import { Component, Inject, OnInit } from "@angular/core";
import { ClientsService } from "../../../../clients/clients.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupsService } from "app/groups/groups.service";
import { SavingsService } from "app/savings/savings.service";
import { BanksService } from "app/banks/banks.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "midas-transfer-cross-office",
  templateUrl: "./transfer-cross-office.component.html",
  styleUrls: ["./transfer-cross-office.component.scss"],
})
export class TransferCrossOfficeComponent implements OnInit {
  currentUser: any;
  disable = false;
  savingsAccountData: any;
  isLoading: boolean = false;
  offices: any[] = [];
  clientOfGroup: any[] = [];
  partners: any[] = [];
  partnersLocal: any[] = [];
  transferIc: boolean = false;
  transferToIc: boolean = false;
  transferFromGroup: boolean = false;
  groupId: string = null;
  noteSuggest: string = null;

  constructor(
    private serviceClient: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private savingsService: SavingsService,
    private clientsService: ClientsService,
    private groupsService: GroupsService

  ) {
    this.transferIc = data.transferIc;
    this.transferToIc = data.transferToIc;
    this.transferFromGroup = data.transferFromGroup ? data.transferFromGroup : this.transferFromGroup ;
    this.groupId = data.groupId;
    this.form = this.formBuilder.group({
      typeAdvanceCashes: ["", Validators.required],
      office: ["", Validators.required],
      client: ["", Validators.required],
      savingAccountId: ["", Validators.required],
      amount: ["", Validators.required],
      note: [""],
    });

    this.currentUser = data.currentUser;
    this.disable = data.disableUser;
    this.savingsAccountData = data.savingsAccountData;
  }

  typeAdvanceCashes: any[] = [];

  form: FormGroup;
  clients: any;
  staffs: any[];
  accounts: any[];

  modifiedForm() {
    const value = this.form.get("typeAdvanceCashes").value;
    if (value == 58) {
      this.form.removeControl("office");
      this.form.removeControl("client");
      this.form.addControl("partner", new FormControl("", Validators.required));
      this.form.get("partner").valueChanges.subscribe((value) => {
        this.savingsService.getListICSavingAccountByPartner(value).subscribe((result) => {
          this.accounts = result.result.listClientSavingVault;
        });
      });
    } else {
      if (value == 59) {
        this.form.removeControl("partner");
        this.form.removeControl("office");
        this.form.removeControl("client");

        this.savingsService.getListICSavingAccountByPartner(this.savingsAccountData.clientId).subscribe((result) => {
          this.accounts = result.result.listClientSavingVault;
        });
      } else {
        if (value == 60) {
          this.form.removeControl("partner");
          this.form.addControl("office", new FormControl("", Validators.required));
          this.form.addControl("client", new FormControl("", Validators.required));

          this.form.get("office").valueChanges.subscribe((value) => {
            this.serviceClient.getStaffsByOffice(value).subscribe((result) => {
              this.staffs = result.result.listStaff;
            });
          });

          this.form.get("client").valueChanges.subscribe((value) => {
            this.savingsService.getListClientSavingStaffByOffice(value).subscribe((result) => {
              this.accounts = result.result.listClientSavingVault;
            });
          });
        }
      }
    }
  }

  ngOnInit(): void {
    this.savingsService.getTransferFundTemplate().subscribe((result) => {
      this.partnersLocal = result?.result?.listPartner;
      this.offices = result.result.listOffice;
      this.typeAdvanceCashes = result.result.listTransferOption;
      if (!this.transferIc) {

        if (this.transferFromGroup) {
          this.typeAdvanceCashes = result.result.listTransferOptionFromGroupToClient;

          this.form = this.formBuilder.group({
            typeAdvanceCashes: [this.typeAdvanceCashes[0].paymentType, Validators.required],
            clientOfGroup: ["", Validators.required],
            savingAccountId: ["", Validators.required],
            amount: ["", Validators.required],
            note: [""],
          });

          this.groupsService.getGroupMemberData(this.groupId).subscribe((result) => {
            this.noteSuggest = `Đại lý ${result.name} thanh toán phí cho KH `;
            this.clientOfGroup = result.clientMembers;
          });

          this.form.get("clientOfGroup")?.valueChanges.subscribe((value) => {
            const clientChosen = this.clientOfGroup.filter((client: any) => client.id == value);
            this.form.get('note').setValue(`${this.noteSuggest} ${clientChosen[0]?.displayName}`)
            this.clientsService.getClientAccountDataCross(value).subscribe((savings) => {
              const ListAccount = savings?.result?.clientAccount?.savingsAccounts;
              this.accounts = ListAccount.filter((account: any) => account.status.id == 300);
            });
          });

        }

      } else {
        if (this.transferIc && !this.transferToIc) {
          this.typeAdvanceCashes = result.result.listTransferOptionFromIC;

          this.form = this.formBuilder.group({
            typeAdvanceCashes: [this.typeAdvanceCashes[0].paymentType, Validators.required],
            partner: ["", Validators.required],
            office: ["", Validators.required],
            client: ["", Validators.required],
            savingAccountId: ["", Validators.required],
            amount: ["", Validators.required],
            note: [""],
          });
          this.modifiedForm();

          this.form.get("typeAdvanceCashes")?.valueChanges.subscribe((value) => {
            this.modifiedForm();
          });

          this.savingsService.getListIcPartner().subscribe((response: any) => {
            this.partners = response.result.listClient;
          });
        } else {
          if (this.transferIc && this.transferToIc) {
            this.typeAdvanceCashes = result.result.listTransferOptionToIC;

            this.form = this.formBuilder.group({
              typeAdvanceCashes: [this.typeAdvanceCashes[0].paymentType, Validators.required],
              partnerLocal: ["", Validators.required],
              savingAccountId: ["", Validators.required],
              amount: ["", Validators.required],
              note: [""],
            });

            this.clientsService.getICClientAccount().subscribe((res) => {
              this.accounts = res.result.clientAccount.savingsAccounts;
              this.accounts = this.accounts.filter((account) => account.status.id == 300);
            });
          }
        }
      }
    });
    // this.bankService.getListOfficeCommon().subscribe((offices: any) => {
    //   this.offices = offices.result.listOffice;
    // });

    this.form.get("office")?.valueChanges.subscribe((value) => {
      this.serviceClient.getStaffsByOffice(value).subscribe((result) => {
        this.staffs = result.result.listStaff;
      });
    });

    this.form.get("client")?.valueChanges.subscribe((value) => {
      this.savingsService.getListClientSavingStaffByOffice(value).subscribe((result) => {
        this.accounts = result.result.listClientSavingVault;
      });
    });
  }
}
