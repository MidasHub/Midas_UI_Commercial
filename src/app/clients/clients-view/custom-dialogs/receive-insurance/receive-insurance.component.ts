import { ClientsService } from 'app/clients/clients.service';
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BookingService } from "app/booking-manage/booking.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "midas-receive-insurance-dialog",
  templateUrl: "./receive-insurance.component.html",
  styleUrls: ["./receive-insurance.component.scss"],
})
export class ReceiveInsuranceComponent implements OnInit {
  dataInject: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
  ) {
    // this.dataInject = data;
  }

  form: FormGroup;
  listSavingAccount: any;
  buSavingAccounts: any;
  filteredClient: any[];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      buSavingAccount: [""],
      amount: [undefined],
      insuranceId: ["",  [Validators.required]],
      driverLicenseNumber: ["",  [Validators.required]],
      activeDate: [new Date() , [Validators.required]],
      expiredDate: [new Date(new Date().setFullYear(new Date().getFullYear() + 1)) , [Validators.required]],
      note: [""],
    });
    this.clientService.getReceiveInsuranceTemplate().subscribe((template: any) => {
      this.buSavingAccounts = template.result.listSavingAccountStaff;
    });

  }

}
