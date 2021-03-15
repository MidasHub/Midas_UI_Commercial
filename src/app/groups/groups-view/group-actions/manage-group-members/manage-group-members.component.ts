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
export class ManageGroupMembersComponent implements AfterViewInit,OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  /** Group Data */
  groupData: any;
  /** Client data. */
  clientsData: any = [];
  /** Client Members. */
  clientMembers: any[] = [];
  /** Client Choice. */
  clientChoice = new FormControl('');

  dataSource: MatTableDataSource<any>;
  displayedColumns =  ['displayName', 'Status','Action'];

  displayAddClient: boolean = true;

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
        this.dataSource = new MatTableDataSource();
    });
  }
  ngOnInit(): void {
    this.dataSource.data = this.clientMembers;
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }


  /**
   * Subscribes to Clients search filter:
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.clientChoice.valueChanges.subscribe( (value: string) => {
      if (value.length >= 2) {
        //this.clientsService.getFilteredClients('displayName', 'ASC', true, value, this.groupData.officeId)
        this.clientsService.getFilteredClients('displayName', 'ASC', false, value,'')
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
          .subscribe(() => { this.clientMembers.splice(0,0,this.clientChoice.value); this.dataSource.data = this.clientMembers;});
      }
    }else{
      this.clientMembers = [];
      this.groupsService.executeGroupCommand(this.groupData.id, 'associateClients', {clientMembers: [this.clientChoice.value.id]})
          .subscribe(() => { this.clientMembers.push(this.clientChoice.value); this.dataSource.data = this.clientMembers;});
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
          .subscribe(() => { 
            this.clientMembers.splice(index, 1); 
            this.dataSource.data = this.clientMembers;
          });
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
    const dialogRef = this.dialog.open(DialogOverviewClientDialog, {
      width: '400px',
      data: {...client}
    });
    //dialogRef.afterClosed().subscribe();
  }
 
  doFilterGroupClients(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getClientIdSelect(clientSelect:any){
    this.displayAddClient = true;
    this.clientMembers.forEach((item)=>{ 
      if(item.id === clientSelect.id){
        this.displayAddClient = false;
      }
    });
    // if(!this.displayAddClient){
    //   this.doFilterGroupClients(clientSelect.displayName);
    // }
  }
}

export interface DialogDataClient {
  accountNo: string;
  externalId: string;
  officeName: string;
  staffName: string;
  mobileNo: string;
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'group_member_details.html',
})
export class DialogOverviewClientDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewClientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataClient) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}