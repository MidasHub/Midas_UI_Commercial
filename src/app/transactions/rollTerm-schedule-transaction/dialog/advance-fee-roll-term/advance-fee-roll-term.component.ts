import { Component, Inject, OnInit } from "@angular/core";
import { ClientsService } from "../../../../clients/clients.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MidasClientService } from "app/midas-client/midas-client.service";
import { SavingsService } from "app/savings/savings.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "midas-advance-fee-roll-term",
  templateUrl: "./advance-fee-roll-term.component.html",
  styleUrls: ["./advance-fee-roll-term.component.scss"],
})
export class AdvanceFeeRollTermComponent implements OnInit {
  clientId: any;

  constructor(
    private midasClientService: MidasClientService,
    private savingsService: SavingsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.clientId = data.clientId;

  }

  typeAdvanceCashes: any[] = [];
  form: FormGroup;
  listSavingAccount: any;
  buSavingAccounts: any;
  filteredClient: any[];

  ngOnInit(): void {
    this.savingsService.getAdvanceFeeOnDueDayCardTemplate(this.clientId).subscribe((template: any) => {
      this.listSavingAccount = template.result.listSavingAccountClient;
      this.buSavingAccounts = template.result.listSavingAccountBu;
      this.typeAdvanceCashes = template.result.typeAdvanceCashesClient;
    });

    this.form = this.formBuilder.group({
      clientAdvanceCash: [""],
      buSavingAccount: [""],
      typeAdvanceCash: [""],
      amountAdvance: [""],
      noteAdvance: [""],
    });
    // this.midasClientService.getListSavingAccountByClientId(this.clientId).subscribe((cl: any) => {
    //   this.listSavingAccount = cl.result.listSavingAccount;

    // });

    // this.midasClientService.getListSavingAccountFtByUserId().subscribe((saving: any) => {
    //   this.buSavingAccounts = saving.result.listSavingAccount;

    // });
  }

  get client() {
    return this.form.get("clientAdvanceCash");
  }

}
