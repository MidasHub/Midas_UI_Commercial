/** Angular Imports */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

/** Custom Services */
import {SavingsService} from 'app/savings/savings.service';
import {BanksService} from '../../../banks/banks.service';

/**
 * Savings Account Details Step
 */
@Component({
    selector: 'mifosx-savings-account-details-step',
    templateUrl: './savings-account-details-step.component.html',
    styleUrls: ['./savings-account-details-step.component.scss']
})
export class SavingsAccountDetailsStepComponent implements OnInit {

    /** Savings Account Template */
    @Input() savingsAccountTemplate: any;

    /** Minimum date allowed. */
    minDate = new Date(2000, 0, 1);
    /** Maximum date allowed. */
    maxDate = new Date();
    /** Product Data */
    productData: any;
    /** Field Officer Data */
    fieldOfficerData: any;
    /** For edit savings form */
    isFieldOfficerPatched = false;
    /** Savings Account Details Form */
    savingsAccountDetailsForm: FormGroup;
    banks: any;
    isSelectBank: boolean;
    /** Savings Account Template with product data  */
    @Output() savingsAccountProductTemplate = new EventEmitter();

    /**
     * Sets share account details form.
     * @param {FormBuilder} formBuilder Form Builder.
     * @param {SavingsService} savingsService Savings Service.
     */
    constructor(private formBuilder: FormBuilder,
                private savingsService: SavingsService,
                private banksServices: BanksService) {
        this.isSelectBank = false;
        this.banksServices.getBanks().subscribe(bak => {
            this.banks = bak;
        });
        this.createSavingsAccountDetailsForm();
    }

    ngOnInit() {
        this.buildDependencies();
        if (this.savingsAccountTemplate) {
            this.productData = this.savingsAccountTemplate.productOptions;
            if (this.savingsAccountTemplate.savingsProductId) {
                this.savingsAccountDetailsForm.patchValue({
                    'productId': this.savingsAccountTemplate.savingsProductId,
                    'submittedOnDate': this.savingsAccountTemplate.timeline.submittedOnDate && new Date(this.savingsAccountTemplate.timeline.submittedOnDate),
                    'externalId': this.savingsAccountTemplate.externalId
                });
            }
        }
    }

    /**
     * Creates savings account details form.
     */
    createSavingsAccountDetailsForm() {
        this.savingsAccountDetailsForm = this.formBuilder.group({
            'productId': ['', Validators.required],
            'submittedOnDate': [new Date(), Validators.required],
            'fieldOfficerId': [''],
            'externalId': [''],
            'bank': [''],
            'bankNo': ['']
        });
        // trigger on change product savings
        this.savingsAccountDetailsForm.get('productId').valueChanges.subscribe((value) => {
            this.buildDependencies();
            console.log('productId', value, this.banks);
            if (value === 8) {
                this.isSelectBank = true;
            } else {
                this.isSelectBank = false;
            }
        });
    }

    /**
     * Fetches savings account product template on productId value changes
     */
    buildDependencies() {

        const entityId = this.savingsAccountTemplate.clientId || this.savingsAccountTemplate.groupId;
        this.savingsAccountDetailsForm.get('productId').valueChanges.subscribe((productId: string) => {
          if (this.savingsAccountTemplate.isIcClient){
            this.savingsService.getSavingsAccountIcTemplate(productId)
            .subscribe((response: any) => {
              const template = response.result.clientAccountTemplate;
              this.savingsAccountProductTemplate.emit(template);
              this.fieldOfficerData = template.fieldOfficerOptions;
              if (!this.isFieldOfficerPatched && this.savingsAccountTemplate.fieldOfficerId) {
                  this.savingsAccountDetailsForm.get('fieldOfficerId').patchValue(this.savingsAccountTemplate.fieldOfficerId);
                  this.isFieldOfficerPatched = true;
              } else {
                  this.savingsAccountDetailsForm.get('fieldOfficerId').patchValue('');
              }
          });
          } else {
            this.savingsService.getSavingsAccountTemplate(entityId, productId, this.savingsAccountTemplate.groupId ? true : false)
                .subscribe((response: any) => {
                    this.savingsAccountProductTemplate.emit(response);
                    this.fieldOfficerData = response.fieldOfficerOptions;
                    if (!this.isFieldOfficerPatched && this.savingsAccountTemplate.fieldOfficerId) {
                        this.savingsAccountDetailsForm.get('fieldOfficerId').patchValue(this.savingsAccountTemplate.fieldOfficerId);
                        this.isFieldOfficerPatched = true;
                    } else {
                        this.savingsAccountDetailsForm.get('fieldOfficerId').patchValue('');
                    }
                });
          }


        });
    }

    /**
     * Returns savings account form value.
     */
    get savingsAccountDetails() {
        const result = {
            'productId': this.savingsAccountDetailsForm.get('productId').value,
            'submittedOnDate': this.savingsAccountDetailsForm.get('submittedOnDate').value,
            'fieldOfficerId': this.savingsAccountDetailsForm.get('fieldOfficerId').value,
            'externalId': this.savingsAccountDetailsForm.get('externalId').value,
        };
        if (this.savingsAccountDetailsForm.get('productId').value === 8) {
            result.externalId = `${this.savingsAccountDetailsForm.get('bank').value}#${this.savingsAccountDetailsForm.get('bankNo').value}`;
        }
        return result;
    }

}
