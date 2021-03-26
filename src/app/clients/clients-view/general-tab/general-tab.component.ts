/** Angular Imports */
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

/** Custom Services. */
import {ClientsService} from 'app/clients/clients.service';
import {AuthenticationService} from '../../../core/authentication/authentication.service';

/**
 * General Tab component.
 */
@Component({
  selector: 'mifosx-general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.scss']
})
export class GeneralTabComponent {

  /** Open Loan Accounts Columns */
  openLoansColumns: string[] = ['Account No', 'Loan Account', 'Original Loan', 'Loan Balance', 'Amount Paid', 'Type', 'Actions'];
  /** Closed Loan Accounts Columns */
  closedLoansColumns: string[] = ['Account No', 'Loan Account', 'Original Loan', 'Loan Balance', 'Amount Paid', 'Type', 'Closed Date'];
  /** Open Savings Accounts Columns */
  openSavingsColumns: string[] = ['Account No', 'External Id', 'Saving Account', 'Last Active', 'Balance', 'Actions'];
  /** Closed Savings Accounts Columns */
  closedSavingsColumns: string[] = ['Account No', 'Saving Account', 'Closed Date'];
  /** Open Shares Accounts Columns */
  openSharesColumns: string[] = ['Account No', 'Share Account', 'Approved Shares', 'Pending For Approval Shares', 'Actions'];
  /** Closed Shares Accounts Columns */
  closedSharesColumns: string[] = ['Account No', 'Share Account', 'Approved Shares', 'Pending For Approval Shares', 'Closed Date'];
  /** Upcoming Charges Columns */
  upcomingChargesColumns: string[] = ['Name', 'Due as of', 'Due', 'Paid', 'Waived', 'Outstanding', 'Actions'];

  /** Client Account Data */
  clientAccountData: any;
  /** Loan Accounts Data */
  loanAccounts: any;
  /** Savings Accounts Data */
  savingAccounts: any;
  /** Shares Accounts Data */
  shareAccounts: any;
  /** Upcoming Charges Data */
  upcomingCharges: any;
  /** Client Summary Data */
  clientSummary: any;

  /** Show Closed Loan Accounts */
  showClosedLoanAccounts = false;
  /** Show Closed Saving Accounts */
  showClosedSavingAccounts = false;
  /** Show Closed Share Accounts */
  showClosedShareAccounts = false;
  /** Show Closed Reccuring Deposits Accounts */
  showClosedRecurringAccounts = false;
  /** Show Closed Fixed Deposits Accounts */
  showClosedFixedAccounts = false;

  /** Client Id */
  clientid: any;
  isTeller = true;
  isInterchangeClient = false;
  routingSavingAccountUrl: string = "savings-accounts";


  /**
   * @param {ActivatedRoute} route Activated Route
   * @param {ClientsService} clientService Clients Service
   * @param {Router} router Router
   */
  constructor(
    private route: ActivatedRoute,
    private clientService: ClientsService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.route.data.subscribe((data: { clientAccountsData: any, clientChargesData: any, clientSummary: any }) => {

      this.clientAccountData = data.clientAccountsData.result.clientAccount;
      this.savingAccounts = data.clientAccountsData.result.clientAccount.savingsAccounts.sort((v: any) => ['SCA0', 'CCA0', 'ACA0', 'FCA0'].indexOf(v.shortProductName) === -1);
      this.loanAccounts = data.clientAccountsData.result.clientAccount.loanAccounts;
      this.shareAccounts = data.clientAccountsData.result.clientAccount.codeshareAccounts;
      this.upcomingCharges = data.clientChargesData ? data.clientChargesData.pageItems : [];
      this.clientSummary = data.clientSummary ? data.clientSummary[0] :  {};
      this.clientid = this.route.parent.snapshot.params['clientId'];
      this.route.queryParamMap
      .subscribe((params) => {
          if (params.get("clientType") == 'ic') {
          this.isInterchangeClient = true ;
          // this.routingSavingAccountUrl = "savings-accounts-ic"
        }
      });
    });
    const currentUser = this.authenticationService.getCredentials();
    const {roles, staffId} = currentUser;
    roles.map((role: any) => {
      if (role.id !== 3) {
        this.isTeller = false;
      }
    });
  }

  /**
   * Toggles Loan Accounts Overview
   */
  toggleLoanAccountsOverview() {
    this.showClosedLoanAccounts = !this.showClosedLoanAccounts;
  }

  /**
   * Toggles Loan Accounts Overview
   */
  toggleSavingAccountsOverview() {
    this.showClosedSavingAccounts = !this.showClosedSavingAccounts;
  }

  /**
   * Toggles Loan Accounts Overview
   */
  toggleShareAccountsOverview() {
    this.showClosedShareAccounts = !this.showClosedShareAccounts;
  }

  /**
   * Toggles Reccuring Accounts Overview
   */
  toggleRecurringAccountsOverview() {
    this.showClosedRecurringAccounts = !this.showClosedRecurringAccounts;
  }

  /**
   * Toggles Fixed Accounts Overview
   */
  toggleFixedAccountsOverview() {
    this.showClosedFixedAccounts = !this.showClosedFixedAccounts;
  }

  /**
   * Waive Charge.
   * @param chargeId Selected Charge Id.
   * @param clientId Selected Client Id.
   */
  waiveCharge(chargeId: string, clientId: string) {
    const charge = {clientId: clientId.toString(), resourceType: chargeId};
    this.clientService.waiveClientCharge(charge).subscribe(() => {
      this.getChargeData(clientId);
    });
  }

  /**
   * Get Charge Data.
   * @param clientId Selected Client Id.
   */
  getChargeData(clientId: string) {
    this.clientService.getClientChargesData(clientId).subscribe((data: any) => {
      this.upcomingCharges = data.pageItems;
    });
  }

  /**
   * Stops the propagation to view pages.
   * @param $event Mouse Event
   */
  routeEdit($event: MouseEvent) {
    $event.stopPropagation();
  }

  /**
   * @param {any} loanId Loan Id
   */
  routeTransferFund(loanId: any) {
    const queryParams: any = {loanId: loanId, accountType: 'fromloans'};
    this.router.navigate(['../', 'loans-accounts', loanId, 'transfer-funds', 'make-account-transfer'], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

}
