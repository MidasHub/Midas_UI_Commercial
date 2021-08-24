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
  limitTypes = [
    {
      id: 0,
      value: 0
    },
    {
      id: 1,
      value: 1
    },
    {
      id: 2,
      value: 2
    },
    {
      id: 3,
      value: 3
    }
  ];
  editData: any;
  constructor(
    public dialogRef: MatDialogRef<CreateEditSpendingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private groupsService: GroupsService
  ) {
    console.log(this.data);
    this.editData = this.data.editData;
    this.formDialog = this.formBuilder.group({
      officeId: [ this.editData ? this.editData.officeId : ''],
      paymentTypeId: [this.editData ? this.editData.paymentTypeId : ''],
      staffId: [this.editData ? this.editData.staffId : ''],
      limitType: [this.editData ? this.editData.limitType : ''],
      limitDefault: [this.editData ? this.editData.limitDefault : ''],
      month: [this.editData ? this.editData.month : new Date().getMonth() + 1],
      year: [ this.editData ? this.editData.year : new Date().getFullYear()]
    });
    if (this.editData) {
      this.groupsService.getStaffs(this.editData.officeId).subscribe((result: any) => {
        if (result) {
          this.staffs = result?.result?.listStaff;
        }
      });
    }
    this.formDialog.get('officeId')?.valueChanges.subscribe(officeId => {
      this.groupsService.getStaffs(officeId).subscribe((result: any) => {
        if (result) {
          this.staffs = result?.result?.listStaff;
        }
      });
    });
  }

  ngOnInit(): void { }

}
