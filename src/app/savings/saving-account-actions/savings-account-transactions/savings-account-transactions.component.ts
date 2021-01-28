/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

/** Custom Services */
import { SavingsService } from '../../savings.service';

/**
 * Create savings account transactions component.
 */
@Component({
  selector: 'mifosx-savings-transactions',
  templateUrl: './savings-account-transactions.component.html',
  styleUrls: ['./savings-account-transactions.component.scss']
})
export class SavingsAccountTransactionsComponent implements OnInit {

  /** Minimum Due Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Due Date allowed. */
  maxDate = new Date();
  /** Savings account transaction form. */
  savingAccountTransactionForm: FormGroup;
  /** savings account transaction payment options. */
  paymentTypeOptions: {
    id: number,
    name: string,
    description: string,
    isCashPayment: boolean,
    position: number
  }[];
  /** Flag to enable payment details fields. */
  addPaymentDetailsFlag: Boolean = false;
  paymentTypeIdGroup: string = "!Expense";
  /** transaction type flag to render required UI */
  transactionType: { deposit: boolean, withdrawal: boolean } = { deposit: false, withdrawal: false };
  /** transaction command for submit request */
  transactionCommand: string;
  /** saving account's Id */
  savingAccountId: string;
  filteredOptions: any = [];
  paymentTypeDescription: string;
  /**
   * Retrieves the Saving Account transaction template data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {SavingsService} savingsService Savings Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {DatePipe} datePipe DatePipe.
   * @param {Router} router Router for navigation.
   */
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private savingsService: SavingsService) {
    this.route.data.subscribe((data: { savingsAccountActionData: any }) => {
      this.paymentTypeOptions = data.savingsAccountActionData.paymentTypeOptions;
    });
    this.transactionCommand = this.route.snapshot.params['name'].toLowerCase();
    this.transactionType[this.transactionCommand] = true;
    this.savingAccountId = this.route.parent.snapshot.params['savingAccountId'];
  }

  /**
   * Creates the Saving account transaction form when component loads.
   */
  ngOnInit() {
    this.createSavingAccountTransactionForm();
  }

  /**
   * Method to create the Saving Account Transaction Form.
   */
  createSavingAccountTransactionForm() {
    this.savingAccountTransactionForm = this.formBuilder.group({
      'transactionDate': [new Date(), Validators.required],
      'transactionAmount': ['', Validators.required],
      'paymentTypeGroup': ['', Validators.required],
      'paymentTypeId': ['', Validators.required],
      'note': ['']
    });

     // **SÁNG** filter payment type by group
    this.savingAccountTransactionForm.get('paymentTypeGroup').valueChanges.subscribe((value => {
      this.filterPaymentType();
    }));

    this.savingAccountTransactionForm.get('paymentTypeId').valueChanges.subscribe((value => {
      this.changePaymentType();
    }));
     // **SÁNG** open add on info on default
     this.addPaymentDetails();
  }

  filterPaymentType() {
    this.paymentTypeDescription = "";
    let groupId = String(this.savingAccountTransactionForm.get("paymentTypeGroup").value) ;
    this.filteredOptions = this.paymentTypeOptions.filter(
      item =>{
        if (groupId.startsWith("!")){
          return item.name.indexOf(groupId.substring(1)) == -1;

        }else{
          return item.name.includes(groupId);

        }
      }
    );
    this.savingAccountTransactionForm.get("paymentTypeId").setValue(null);
  }

  changePaymentType(){

    let paymentTypeId = this.savingAccountTransactionForm.get("paymentTypeId").value ;
    if(!paymentTypeId){
      return;
    }
    let paymentTypeDescription = "";
    this.paymentTypeOptions.forEach(function(paymentType){
        if (paymentType.id == paymentTypeId){
          paymentTypeDescription = paymentType.description;
        }
    })
    this.paymentTypeDescription = paymentTypeDescription;
    this.checkValidAmountWithdrawalTransaction(paymentTypeId);

}

checkValidAmountWithdrawalTransaction(paymentTypeId: string, staffId?: string){

  this.savingsService.getLimitSavingsTransactionConfig(paymentTypeId).subscribe((config) => {
    console.log(config);
  })
}

  /**
   * Method to add payment detail fields to the UI.
   */
  addPaymentDetails() {
    this.addPaymentDetailsFlag = !this.addPaymentDetailsFlag;
    if (this.addPaymentDetailsFlag) {
      this.savingAccountTransactionForm.addControl('accountNumber', new FormControl(''));
      this.savingAccountTransactionForm.addControl('checkNumber', new FormControl(''));
      this.savingAccountTransactionForm.addControl('routingCode', new FormControl(''));
      this.savingAccountTransactionForm.addControl('receiptNumber', new FormControl(''));
      this.savingAccountTransactionForm.addControl('bankNumber', new FormControl(''));
    } else {
      this.savingAccountTransactionForm.removeControl('accountNumber');
      this.savingAccountTransactionForm.removeControl('checkNumber');
      this.savingAccountTransactionForm.removeControl('routingCode');
      this.savingAccountTransactionForm.removeControl('receiptNumber');
      this.savingAccountTransactionForm.removeControl('bankNumber');
    }
  }

  /**
   * Method to submit the transaction details.
   */
  submit() {
    const prevTransactionDate: Date = this.savingAccountTransactionForm.value.transactionDate;
    // TODO: Update once language and date settings are setup
    const dateFormat = 'dd-MM-yyyy';
    this.savingAccountTransactionForm.patchValue({
      transactionDate: this.datePipe.transform(prevTransactionDate, dateFormat)
    });
    const transactionData = this.savingAccountTransactionForm.value;
    transactionData.locale = 'en';
    transactionData.dateFormat = dateFormat;
    this.savingsService.executeSavingsAccountTransactionsCommand(this.savingAccountId, this.transactionCommand, transactionData).subscribe(res => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
}
