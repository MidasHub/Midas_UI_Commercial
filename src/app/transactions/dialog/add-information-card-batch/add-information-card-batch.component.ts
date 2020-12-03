import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'midas-add-information-card-batch',
  templateUrl: './add-information-card-batch.component.html',
  styleUrls: ['./add-information-card-batch.component.scss']
})
export class AddInformationCardBatchComponent implements OnInit {
  formDialog: FormGroup;
  member: any;

  constructor(public dialogRef: MatDialogRef<AddInformationCardBatchComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {
    this.member = data.member;
    console.log(data);
    this.formDialog = this.formBuilder.group({});
  }

  ngOnInit(): void {
  }

}
