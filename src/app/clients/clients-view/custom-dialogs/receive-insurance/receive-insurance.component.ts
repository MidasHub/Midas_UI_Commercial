import { ClientsService } from "app/clients/clients.service";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BookingService } from "app/booking-manage/booking.service";
import { AuthenticationService } from "app/core/authentication/authentication.service";
import { DatePipe } from "@angular/common";
import { SettingsService } from "app/settings/settings.service";

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
    private datePipe: DatePipe,
    private settingsService: SettingsService,
  ) {
    this.dataInject = data;
  }

  form: FormGroup;
  listSavingAccount: any;
  buSavingAccounts: any;
  filteredClient: any[];

  ngOnInit(): void {
    if (!this.dataInject?.action || this.dataInject.action == "INSERT") {
      this.form = this.formBuilder.group({
        buSavingAccount: [""],
        amount: [undefined],
        insuranceId: ["", [Validators.required]],
        driverLicenseNumber: ["", [Validators.required]],
        activeDate: [new Date(), [Validators.required]],
        expiredDate: [new Date(new Date().setFullYear(new Date().getFullYear() + 1)), [Validators.required]],
        note: [""],
      });
      this.clientService.getReceiveInsuranceTemplate().subscribe((template: any) => {
        this.buSavingAccounts = template.result.listSavingAccountStaff;
      });
    } else {
      if (this.dataInject.action == "EDIT") {
        const dateFormat = this.settingsService.dateFormat;
        this.form = this.formBuilder.group({
          insuranceId: [this.dataInject.insurance.insuranceId, [Validators.required]],
          driverLicenseNumber: [this.dataInject.insurance.driverLicenseNumber, [Validators.required]],
          activeDate: [new Date(this.datePipe.transform(this.dataInject.insurance.activeDate, "yyyy-MM-dd")), [Validators.required]],
          expiredDate: [new Date(this.datePipe.transform(this.dataInject.insurance.expireDate, "yyyy-MM-dd")), [Validators.required]],
          note: [this.dataInject.insurance.note],
        });

      }
    }
  }
}
