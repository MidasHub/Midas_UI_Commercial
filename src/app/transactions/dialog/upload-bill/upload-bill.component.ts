import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'midas-upload-bill',
  templateUrl: './upload-bill.component.html',
  styleUrls: ['./upload-bill.component.scss']
})
export class UploadBillComponent implements OnInit {
  file: any;
  constructor(public dialogRef: MatDialogRef<UploadBillComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  fileChange(event: any): Promise<any> {
    console.log(event)
    return new Promise<any>(async resolve => {
      const file = event.target.files[0];
      file.path = await this.readURL(file);
      this.file = file;
    });
  }

  readURL(file: any): Promise<any> {
    return new Promise<any>(resolve => {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
}
