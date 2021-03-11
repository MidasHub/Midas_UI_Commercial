/** Angular Imports */
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/** Custom Dialogs */
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';

/** Custom Services */
import { GroupsService } from 'app/groups/groups.service';
import { ClientsService } from 'app/clients/clients.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core'; 
import { Inject } from '@angular/core';
/**
 * Manage Group Members Component
 */
@Component({
  selector: 'mifosx-manage-group-members',
  templateUrl: './manage-group-members.component.html',
  styleUrls: ['./manage-group-members.component.scss']
})
export class ManageGroupMembersComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  /** Group Data */
  groupData: any;
  /** Client data. */
  clientsData: any = [];
  /** Client Members. */
  clientMembers: any[] = [];
  /** Client Choice. */
  clientChoice = new FormControl('');

  dataSource: MatTableDataSource<any>;
  displayedColumns =  ['Name', 'Action'];
  /**
   * Fetches group action data from `resolve`
   * @param {ActivatedRoute} route Activated Route
   * @param {GroupsService} groupsService Groups Service
   * @param {ClientsService} clientsService Clients Service
   * @param {MatDialog} dialog Mat Dialog
   */
  constructor(private route: ActivatedRoute,
              private groupsService: GroupsService,
              private clientsService: ClientsService,
              public dialog: MatDialog) {
    this.route.data.subscribe((data: { groupActionData: any }) => {
      this.groupData = data.groupActionData;
      this.clientMembers = data.groupActionData.clientMembers;
       
      this.dataSource = new MatTableDataSource(data.groupActionData.clientMembers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  /**
   * Subscribes to Clients search filter:
   */
  ngAfterViewInit() {
    this.clientChoice.valueChanges.subscribe( (value: string) => {
      if (value.length >= 2) {
        //this.clientsService.getFilteredClients('displayName', 'ASC', true, value, this.groupData.officeId)
        this.clientsService.getFilteredClients('displayName', 'ASC', true, value,'')
          .subscribe((data: any) => {
            this.clientsData = data.pageItems;
          });
      }
    });
  }

  /**
   * Add client.
   */
  addClient() {
    if(this.clientMembers){
      if (!this.clientMembers.includes(this.clientChoice.value)) {
        this.groupsService.executeGroupCommand(this.groupData.id, 'associateClients', {clientMembers: [this.clientChoice.value.id]})
          .subscribe(() => { this.clientMembers.push(this.clientChoice.value); });
      }
    }else{
      this.clientMembers = [];
      this.groupsService.executeGroupCommand(this.groupData.id, 'associateClients', {clientMembers: [this.clientChoice.value.id]})
          .subscribe(() => { this.clientMembers.push(this.clientChoice.value); });
    }
  }

  /**
   * Remove client.
   * @param {number} index Client's array index.
   * @param {any} client Client
   */
  removeClient(index: number, client: any) {
    const removeMemberDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `client member: ${client.displayName}` }
    });
    removeMemberDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.groupsService.executeGroupCommand(this.groupData.id, 'disassociateClients', {clientMembers: [client.id]})
          .subscribe(() => { this.clientMembers.splice(index, 1); });
      }
    });
  }

  /**
   * Displays Client name in form control input.
   * @param {any} client Client data.
   * @returns {string} Client name if valid otherwise undefined.
   */
  displayClient(client: any): string | undefined {
    return client ? client.displayName : undefined;
  }


  /**
   * This is customer function to show some customer infor and a view detial button.
   * @param {any} client Client data.
   * @returns {string} Client name if valid otherwise undefined.
   */
  showClientDetail(client: any): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: {...client}
    });
    //dialogRef.afterClosed().subscribe();
  }
 
  doFilterGroupClients(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface DialogDataClient {
  animal: string;
  name: string;
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'group_member_details.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataClient) {
      console.log("data===",data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}