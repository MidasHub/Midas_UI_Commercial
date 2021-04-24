import { filter } from "rxjs/operators";
import { Component, Inject, OnInit } from "@angular/core";
import { ClientsService } from "../../../../clients/clients.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupsService } from "app/groups/groups.service";
import { SavingsService } from "app/savings/savings.service";

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
  partners: any[] = [];
  transferIc: boolean = false;
  transferToIc: boolean = false;

  constructor(
    private serviceClient: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private savingsService: SavingsService,
    private clientsService: ClientsService
  ) {
    this.transferIc = data.transferIc;
    this.transferToIc = data.transferToIc;
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

  typeAdvanceCashes: any[] = [
    {
      id: "6",
      name: "Chuyển tiền đối tác",
    },
    {
      id: "7",
      name: "Chuyển tiền nội bộ chi nhánh",
    },
    {
      id: "8",
      name: "Chuyển quỹ cuối ngày",
    },
  ];

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
    if (this.transferIc && !this.transferToIc) {
      this.typeAdvanceCashes = [
        {
          id: "58",
          name: "Interchange: Chuyển tiền toàn cầu",
        },
        {
          id: "59",
          name: "Interchange: Chuyển tiền nội bộ IC",
        },
        {
          id: "60",
          name: "Interchange: Chuyển tiền về Chi nhánh",
        },
      ];

      this.form = this.formBuilder.group({
        typeAdvanceCashes: ["58", Validators.required],
        partner: ["", Validators.required],
        office: ["", Validators.required],
        client: ["", Validators.required],
        savingAccountId: ["", Validators.required],
        amount: ["", Validators.required],
        note: [""],
      });
      this.modifiedForm();

      this.form.get("typeAdvanceCashes").valueChanges.subscribe((value) => {
        this.modifiedForm();
      });

      this.savingsService.getListIcPartner().subscribe((response: any) => {
        this.partners = response.result.listClient;
      });
    } else {
      if (this.transferIc && this.transferToIc) {
        this.typeAdvanceCashes = [
          {
            id: "61",
            name: "Interchange: Chuyển tiền về Ic",
          },
        ];

        this.form = this.formBuilder.group({
          typeAdvanceCashes: ["61", Validators.required],
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
    this.savingsService.getListOfficeCommon().subscribe((offices: any) => {
      this.offices = offices.result.listOffice;
    });

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
