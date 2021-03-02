import { Component, Inject, OnInit } from "@angular/core";
import { ClientsService } from "../../../../clients/clients.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GroupsService } from "app/groups/groups.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "midas-advance",
  templateUrl: "./advance.component.html",
  styleUrls: ["./advance.component.scss"],
})
export class AdvanceComponent implements OnInit {
  currentUser: any;
  disable = false;
  savingsAccountData: any;

  constructor(
    private serviceClient: ClientsService,
    private groupService: GroupsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      entityAdvanceCash: ["", Validators.required],
      clientAdvanceCash: ["", Validators.required],
      typeAdvanceCash: ["", Validators.required],
      amountAdvance: ["", Validators.required],
      noteAdvance: [""],
    });

    this.currentUser = data.currentUser;
    this.disable = data.disableUser;
    this.savingsAccountData = data.savingsAccountData;
    if (this.disable) {
      this.form.get("clientAdvanceCash").setValue(data.savingsAccountData.clientName);
    }

  }

  typeEntityAdvanceCashes: any[] = [
    {
      id: "C",
      value: "Khách hàng",
    },
    {
      id: "G",
      value: "Đại lý",
    },
  ];

  typeAdvanceCashes: any[] = [
    {
      id: "19",
      value: "Ứng tiền phí",
    },
    {
      id: "3",
      value: "Thu hộ",
    },
    {
      id: "37",
      value: "Chi hộ",
    },
  ];
  form: FormGroup;
  clients: any;
  filteredClient: any[];

  ngOnInit(): void {

    this.form.get("entityAdvanceCash").valueChanges.subscribe((value) => {
      this.clients = [];
      this.filteredClient = [];
      if (value == "C") {
        this.serviceClient.getClients("", "", 0, -1).subscribe((cl: any) => {
          this.clients = cl.pageItems?.filter(
            (v: any) => v?.accountNo?.startsWith("C")
          );
          this.filteredClient = this.filterClient(null).slice(0, 30);
        });
      } else {
        const filterGroupsBy = [
          {
            type: "name",
            value: "",
          },
        ];
        this.groupService.getGroups(filterGroupsBy, "", "", 0, -1).subscribe((gr: any) => {
          this.clients = gr.pageItems;
          this.filteredClient = this.filterClient(null).slice(0, 30);
        });
      }

      this.client.valueChanges.subscribe((value: any) => {
        this.filteredClient = this.filterClient(value).slice(0, 30);
      });
    });
  }

  get client() {
    return this.disable
      ? this.clients?.find((v: any) => v.id === this.savingsAccountData.clientId)
      : this.form.get("clientAdvanceCash");
  }

  displayFn(client?: any): string | undefined {
    return this.disable ? client : client.displayName ? client.displayName : client.name;
  }

  private filterClient(value: string | any) {
    let filterValue = "";
    if (this.form.get("entityAdvanceCash").value == "C") {
      if (value) {
        filterValue = typeof value === "string" ? value.toLowerCase() : "";
        return this.clients.filter((client: any) => client.displayName.toLowerCase().includes(filterValue));
      } else {
        return this.clients;
      }
    } else {
      if (value) {
        filterValue = typeof value === "string" ? value.toLowerCase() : "";
        return this.clients.filter((client: any) => client.name.toLowerCase().includes(filterValue));
      } else {
        return this.clients;
      }
    }
  }
}
