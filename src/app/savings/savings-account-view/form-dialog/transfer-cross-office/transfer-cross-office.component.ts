import { Component, Inject, OnInit } from "@angular/core";
import { ClientsService } from "../../../../clients/clients.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  isLoading:boolean = false;
  offices: any[] = [];

  constructor(
    private serviceClient: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private savingsService: SavingsService,
  ) {
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
      name: "Chuyển tiền liên chi nhánh",
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

  ngOnInit(): void {
    this.savingsService.getListOfficeCommon().subscribe((offices: any) => {
      this.offices = offices.result.listOffice;
    })

    this.form.get("office").valueChanges.subscribe((value) => {
      this.serviceClient.getStaffsByOffice(value).subscribe(result => {
        this.staffs = result.result.listStaff;
      })

    });

    this.form.get("client").valueChanges.subscribe((value) => {
      this.savingsService.getListClientSavingStaffByOffice(value).subscribe(result => {
        this.accounts = result.result.listClientSavingVault;
      })
    })

  }


}
