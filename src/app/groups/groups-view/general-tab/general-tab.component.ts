/** Angular Imports */
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AddIdentitiesComponent } from 'app/clients/clients-view/identities-tab/add-identities/add-identities.component';
import { CreateCardBatchTransactionComponent } from 'app/transactions/dialog/create-card-batch-transaction/create-card-batch-transaction.component';

/**
 * Groups View General Tab Component.
 */
@Component({
  selector: 'mifosx-general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.scss']
})
export class GeneralTabComponent implements AfterViewInit {

  /** Group's all accounts data */
  groupAccountData: any;
  /** Group's loan accounts data */
  loanAccounts: any;
  /** Group's savings accounts data */
  savingAccounts: any;
  /** Group Summary */
  groupSummary: any;
  /** Group's Client Members */
  groupClientMembers: any;
  /** Columns to be Displayed for client members table */
  clientMemberColumns: string[] = ['Name', 'Account No', 'Office', 'JLG Loan Application'];
  /** Columns to be displayed for open loan accounts table */
  openLoansColumns: string[] = ['Account No', 'Loan Account', 'Original Loan', 'Loan Balance', 'Amount Paid', 'Type', 'Actions'];
  /** Columns to be displayed for closed loan accounts table */
  closedLoansColumns: string[] = ['Account No', 'Loan Account', 'Original Loan', 'Loan Balance', 'Amount Paid', 'Type', 'Closed Date'];
  /** Columns to be displayed for open savings accounts table */
  openSavingsColumns: string[] = ['Account No', 'Saving Account', 'Last Active', 'Balance', 'Actions'];
  /** Columns to be displayed for closed accounts table */
  closedSavingsColumns: string[] = ['Account No', 'Saving Account', 'Closed Date'];
  /** Boolean for toggling loan accounts table */
  showClosedLoanAccounts = false;
  /** Boolean for toggling savings accounts table */
  showClosedSavingAccounts = false;

  groupClientMembersDiffidentOffice: any;
  groupClientMembersSameOffice: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  groupViewData:any;


  /**
   * Fetches group's related data from `resolve`
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.route.data.subscribe((data: { groupAccountsData: any, groupClientMembers: any, groupSummary: any }) => {
      this.groupAccountData = data.groupAccountsData;
      this.savingAccounts = data.groupAccountsData.savingsAccounts;
      this.loanAccounts = data.groupAccountsData.loanAccounts;
      this.groupSummary = data.groupSummary[0];
    });
    this.route.parent.data.subscribe((data: { groupViewData: any }) => {
      this.groupViewData = data.groupViewData;
      console.log("this.groupViewData = data.groupViewData;", this.groupViewData);
      this.groupClientMembers = this.groupViewData.clientMembers;
      // this.groupClientMembersSameOffice  = this.groupClientMembers.filter( (member: { officeId: any; }) => member.officeId === data.groupViewData.officeId);
      // this.groupClientMembersDiffidentOffice  = this.groupClientMembers.filter( (member: { officeId: any; }) => member.officeId !== data.groupViewData.officeId);

      this.groupClientMembersSameOffice = new MatTableDataSource<clientElement>(this.groupClientMembers.filter( (member: { officeId: any; }) => member.officeId === this.groupViewData.officeId));
      this.groupClientMembersDiffidentOffice = new MatTableDataSource<clientElement>(this.groupClientMembers.filter( (member: { officeId: any; }) => member.officeId !== this.groupViewData.officeId));
    });
  }

  ngAfterViewInit() {
    this.groupClientMembersSameOffice.paginator = this.paginator;
    this.groupClientMembersDiffidentOffice.paginator = this.paginator;
  }

  /**
   * Toggles loan accounts table.
   */
  toggleLoanAccountsOverview() {
    this.showClosedLoanAccounts = !this.showClosedLoanAccounts;
  }

  /**
   * Toggles savings account table.
   */
  toggleSavingAccountsOverview() {
    this.showClosedSavingAccounts = !this.showClosedSavingAccounts;
  }

  /**
   * Stops the propagation to view pages.
   * @param $event Mouse Event
   */
  routeEdit($event: MouseEvent) {
    $event.stopPropagation();
  }

  public doFilterGroupClientMembersSameOffice = (value: string) => {
    this.groupClientMembersSameOffice.filter = value.trim().toLocaleLowerCase();
  }

  public doFilterGroupClientMembersDiffidentOffice = (value: string) => {
    this.groupClientMembersDiffidentOffice.filter = value.trim().toLocaleLowerCase();
  }
 

  clientIdentifierTemplate: any;

  addIdentifier(element:any){

    const dialogConfig = new MatDialogConfig();
    
    let mem = [{
      "cardNumber": "",
      "clientId": element.id,
      "documentId": 0,
      "documentTypeId": "38",
      "fullName": element.displayName,
      "groupId": 0
    }];

    dialogConfig.data = {
      members: mem,
      group: this.groupViewData.id
    };
    const dialog = this.dialog.open(CreateCardBatchTransactionComponent, dialogConfig);
    dialog.afterClosed().subscribe();
  }

}
export interface clientElement {
  name: string;
  accountNo: string;
  Office: number;
}
