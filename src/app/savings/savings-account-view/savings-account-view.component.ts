/** Angular Imports */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

/** Custom Dialogs */
import {DeleteDialogComponent} from 'app/shared/delete-dialog/delete-dialog.component';
import {CalculateInterestDialogComponent} from './custom-dialogs/calculate-interest-dialog/calculate-interest-dialog.component';
import {PostInterestDialogComponent} from './custom-dialogs/post-interest-dialog/post-interest-dialog.component';
import {ToggleWithholdTaxDialogComponent} from './custom-dialogs/toggle-withhold-tax-dialog/toggle-withhold-tax-dialog.component';

/** Custom Buttons Configuration */
import {SavingsButtonsConfiguration} from './savings-buttons.config';
import {SavingsService} from '../savings.service';
import {AuthenticationService} from '../../core/authentication/authentication.service';
import {I18nService} from '../../core/i18n/i18n.service';
import {ProductsService} from '../../products/products.service';
import {FormfieldBase} from '../../shared/form-dialog/formfield/model/formfield-base';
import {SelectBase} from '../../shared/form-dialog/formfield/model/select-base';
import {ClientsService} from '../../clients/clients.service';
import {AdvanceComponent} from './form-dialog/advance/advance.component';

/**
 * Savings Account View Component
 */
@Component({
  selector: 'mifosx-savings-account-view',
  templateUrl: './savings-account-view.component.html',
  styleUrls: ['./savings-account-view.component.scss']
})
export class SavingsAccountViewComponent implements OnInit {

  /** Savings Account Data */
  savingsAccountData: any;
  /** Savings Data Tables */
  savingsDatatables: any;
  /** Button Configurations */
  buttonConfig: SavingsButtonsConfiguration;
  /** Entity Type */
  entityType: string;

  isTeller = true;

  currentUser: any;

  savingProduct: any;

  /**
   * Fetches savings account data from `resolve`
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SavingsService} savingsService Savings Service
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private savingsService: SavingsService,
              public dialog: MatDialog,
              private authenticationService: AuthenticationService,
              private i18n: I18nService,
              private productsService: ProductsService) {
    this.route.data.subscribe((data: { savingsAccountData: any, savingsDatatables: any }) => {
      this.savingsAccountData = data.savingsAccountData;
      this.savingsDatatables = data.savingsDatatables;
    });
    console.log(this.savingsAccountData, this.savingsDatatables);
    if (this.router.url.includes('clients')) {
      this.entityType = 'Client';
    } else if (this.router.url.includes('groups')) {
      this.entityType = 'Group';
    } else if (this.router.url.includes('centers')) {
      this.entityType = 'Center';
    }
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.getCredentials();
    const {roles} = this.currentUser;
    const {savingsProductId} = this.savingsAccountData;
    this.productsService.getSavingProduct(savingsProductId).subscribe((data: any) => {
      console.log(data);
      this.savingProduct = data;
      if (['CCA0', 'ACA0'].indexOf(this.savingProduct.shortName) === -1) {
        this.buttonConfig.addButton({
          name: 'Quản lý vốn đối tác',
          icon: 'fa fa-arrow-right',
          taskPermissionName: 'POSTINTEREST_SAVINGSACCOUNT',
          action: 'Post Interest As On'
        });
      }
      if (['FCA0', 'SCA0'].indexOf(this.savingProduct.shortName) === -1) {
        this.buttonConfig.addButton({
          name: 'Công nợ khách hàng',
          icon: 'fa fa-arrow-right',
          taskPermissionName: 'POSTINTEREST_SAVINGSACCOUNT',
          action: 'advanceCash'
        });
      }
    });
    roles.map((role: any) => {
      if (role.id !== 3) {
        this.isTeller = false;
      }
    });
    this.setConditionalButtons();
  }

  advanceCash() {
    const data = {
      title: 'Ứng tiền cho khách hàng',
    };
    const refDialog = this.dialog.open(AdvanceComponent, {data});
    refDialog.afterClosed().subscribe((response: any) => {
      console.log(response);
    });
  }

  /**
   * Adds options to button config. conditionaly.
   */
  setConditionalButtons() {
    const status = this.savingsAccountData.status.value;
    this.buttonConfig = new SavingsButtonsConfiguration(status);
    if (this.savingsAccountData.clientId) {
      this.buttonConfig.addButton({
        name: this.i18n.getTranslate('Saving_Account_Component.ViewSavingAccount.buttonTransferFunds'),
        taskPermissionName: 'CREATE_ACCOUNTTRANSFER',
        icon: 'fa fa-paper-plane',
        action: 'Transfer Funds'
      });
    }
    // if (!this.savingsAccountData.fieldOfficerId) {
    //   this.buttonConfig.addOption({
    //     name: 'Assign Staff',
    //     taskPermissionName: 'UPDATESAVINGSOFFICER_SAVINGSACCOUNT'
    //   });
    // } else {
    //   this.buttonConfig.addOption({
    //     name: 'Unassign Staff',
    //     taskPermissionName: 'REMOVESAVINGSOFFICER_SAVINGSACCOUNT'
    //   });
    // }
    // if (this.savingsAccountData.charges) {
    //   const charges: any[] = this.savingsAccountData.charges;
    //   charges.forEach((charge: any) => {
    //     if (charge.name === 'Annual fee - INR') {
    //       this.buttonConfig.addOption({
    //         name: 'Apply Annual Fees',
    //         taskPermissionName: 'APPLYANNUALFEE_SAVINGSACCOUNT'
    //       });
    //     }
    //   });
    // }
    // if (this.savingsAccountData.taxGroup) {
    //   if (this.savingsAccountData.withHoldTax) {
    //     this.buttonConfig.addOption({
    //       name: 'Disable Withhold Tax',
    //       taskPermissionName: 'UPDATEWITHHOLDTAX_SAVINGSACCOUNT'
    //     });
    //   } else {
    //     this.buttonConfig.addOption({
    //       name: 'Enable Withhold Tax',
    //       taskPermissionName: 'UPDATEWITHHOLDTAX_SAVINGSACCOUNT'
    //     });
    //   }
    // }
  }


  /**
   * Refetches data foe the component
   * TODO: Replace by a custom reload component instead of hard-coded back-routing.
   */
  private reload() {
    const url: string = this.router.url;
    const refreshUrl: string = this.router.url.slice(0, this.router.url.indexOf('savings-accounts') + 'savings-accounts'.length);
    this.router.navigateByUrl(refreshUrl, {skipLocationChange: true})
      .then(() => this.router.navigate([url]));
  }

  /**
   * Performs action button/option action.
   * @param {string} name action name.
   */
  doAction(name: string) {
    switch (name) {
      case 'Approve':
      case 'Reject':
      case 'Deposit':
      case 'Activate':
      case 'Close':
      case 'Undo Approval':
      case 'Post Interest As On':
      case 'Assign Staff':
      case 'Add Charge':
      case 'Unassign Staff':
      case 'Withdraw By Client':
      case 'Apply Annual Fees':
        this.router.navigate([`actions/${name}`], {relativeTo: this.route});
        break;
      case 'Withdraw':
        this.router.navigate([`actions/Withdrawal`], {relativeTo: this.route});
        break;
      case 'advanceCash':
        this.advanceCash();
        break;
      case 'Modify Application':
        this.router.navigate(['edit'], {relativeTo: this.route});
        break;
      case 'Delete':
        this.deleteSavingsAccount();
        break;
      case 'Calculate Interest':
        this.calculateInterest();
        break;
      case 'Post Interest':
        this.postInterest();
        break;
      case 'Enable Withhold Tax':
        this.enableWithHoldTax();
        break;
      case 'Disable Withhold Tax':
        this.disableWithHoldTax();
        break;
      case 'Transfer Funds':
        const queryParams: any = {savingsId: this.savingsAccountData.id, accountType: 'fromsavings'};
        this.router.navigate(['transfer-funds/make-account-transfer'], {
          relativeTo: this.route,
          queryParams: queryParams
        });
        break;
    }
  }

  /**
   * Deletes Savings Account.
   */
  private deleteSavingsAccount() {
    const deleteSavingsAccountDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {deleteContext: `savings account with id: ${this.savingsAccountData.id}`}
    });
    deleteSavingsAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.savingsService.deleteSavingsAccount(this.savingsAccountData.id).subscribe(() => {
          this.router.navigate(['../../'], {relativeTo: this.route});
        });
      }
    });
  }

  /**
   * Calculates savings account's interest
   */
  private calculateInterest() {
    const calculateInterestAccountDialogRef = this.dialog.open(CalculateInterestDialogComponent);
    calculateInterestAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        this.savingsService.executeSavingsAccountCommand(this.savingsAccountData.id, 'calculateInterest', {}).subscribe(() => {
          this.reload();
        });
      }
    });
  }

  /**
   * Posts savings account's interest
   */
  private postInterest() {
    const postInterestAccountDialogRef = this.dialog.open(PostInterestDialogComponent);
    postInterestAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        this.savingsService.executeSavingsAccountCommand(this.savingsAccountData.id, 'postInterest', {}).subscribe(() => {
          this.reload();
        });
      }
    });
  }

  /**
   * Enables withhold tax for savings account.
   */
  private enableWithHoldTax() {
    const deleteSavingsAccountDialogRef = this.dialog.open(ToggleWithholdTaxDialogComponent, {
      data: {isEnable: true}
    });
    deleteSavingsAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        this.savingsService.executeSavingsAccountUpdateCommand(this.savingsAccountData.id, 'updateWithHoldTax', {withHoldTax: true})
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

  /**
   * Disables withhold tac for savings account
   */
  private disableWithHoldTax() {
    const disableWithHoldTaxDialogRef = this.dialog.open(ToggleWithholdTaxDialogComponent, {
      data: {isEnable: false}
    });
    disableWithHoldTaxDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        this.savingsService.executeSavingsAccountUpdateCommand(this.savingsAccountData.id, 'updateWithHoldTax', {withHoldTax: false})
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

}
