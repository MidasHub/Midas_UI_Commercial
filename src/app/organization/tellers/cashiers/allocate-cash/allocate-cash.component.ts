/** Angular Imports. */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

/** Custom Services. */
import { OrganizationService } from 'app/organization/organization.service';
import { SettingsService } from 'app/settings/settings.service';

/**
 * Allocate Cash component.
 */
@Component({
  selector: 'mifosx-allocate-cash',
  templateUrl: './allocate-cash.component.html',
  styleUrls: ['./allocate-cash.component.scss']
})
export class AllocateCashComponent implements OnInit {

  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Date allowed. */
  maxDate = new Date();
  /** Cashier data. */
  cashierData: any;
  /** Cashier Form. */
  allocateCashForm!: FormGroup;

  /**
   * Get cashier data from `Resolver`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ActivatedRoute} route ActivateRoute.
   * @param {DatePipe} datePipe Date Pipe.
   * @param {OrganizationService} organizationService Organization Service.
   * @param {SettingsService} settingsService Settings Service.
   * @param {Router} router Router.
   */
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private datePipe: DatePipe,
              private organizationService: OrganizationService,
              private settingsService: SettingsService,
              private router: Router) {
    this.route.data.subscribe((data: { cashierTemplate: any} | Data) => {
      this.cashierData = data.cashierTemplate;
    });
  }

  ngOnInit() {
    this.setCashierForm();
  }

  /**
   * Set Cashier form.
   */
  setCashierForm() {
    this.allocateCashForm = this.formBuilder.group({
      'office': [{value: this.cashierData.officeName, disabled: true}],
      'tellerName': [{value: this.cashierData.tellerName, disabled: true}],
      'cashier': [{value: this.cashierData.cashierName, disabled: true}],
      'assignmentPeriod': [{value: this.datePipe.transform(this.cashierData.startDate, 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(this.cashierData.endDate, 'dd/MM/yyyy'), disabled: true}],
      'txnDate': [new Date(), Validators.required],
      'currencyCode': ['', Validators.required],
      'txnAmount': ['', Validators.required],
      'txnNote': ['', Validators.required]
    });
  }

  /**
   * Submits Allocate Cash form.
   */
  submit() {
    const dateFormat = this.settingsService.dateFormat;
    const txnDate = this.allocateCashForm.value.txnDate;
    this.allocateCashForm.patchValue({
      txnDate: this.datePipe.transform(txnDate, dateFormat)
    });
    const allocateCashForm = this.allocateCashForm.value;
    allocateCashForm.dateFormat = dateFormat;
    allocateCashForm.locale = this.settingsService.language.code;
    this.organizationService.allocateCash(this.cashierData.tellerId, this.cashierData.cashierId, allocateCashForm).subscribe((response: any) => {
      this.router.navigate(['../'], {relativeTo: this.route});
    });
  }

}
