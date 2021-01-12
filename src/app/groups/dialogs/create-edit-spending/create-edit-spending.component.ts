import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsService } from 'app/groups/groups.service';

@Component({
  selector: 'midas-create-edit-spending',
  templateUrl: './create-edit-spending.component.html',
  styleUrls: ['./create-edit-spending.component.scss']
})
export class CreateEditSpendingComponent implements OnInit {

  formDialog: FormGroup;
  member: any;
  staffs: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<CreateEditSpendingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private groupsService: GroupsService
  ) {
    console.log(this.data);
    this.formDialog = this.formBuilder.group({
      officeId: [''],
      paymentTypeId: [''],
      staffId: [''],
      limitType: [''],
      limitDefault: [''],
      month: [new Date().getMonth() + 1],
      year: [new Date().getFullYear()]
    });
    this.formDialog.get('officeId').valueChanges.subscribe(officeId => {
      this.groupsService.getStaffs(officeId).subscribe(( result: any) => {
        if (result) {
          this.staffs = result?.result?.listStaff;
        }
      });
    });
  }

  ngOnInit(): void { }

}
