import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'app/core/alert/alert.service';
import { ThirdPartyService } from 'app/third-party/third-party.service';
 

@Component({
  selector: 'midas-partner-dialog',
  templateUrl: './partner-dialog.component.html',
  styleUrls: ['./partner-dialog.component.scss']
})
export class PartnerDialogComponent implements OnInit {
  partnerForm: FormGroup;
  dataFrom: any;
  action:string
  constructor(
    private formBuilder: FormBuilder,
    private thirdPartyService: ThirdPartyService,
    private alertServices: AlertService,
    public dialogRef: MatDialogRef<PartnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.dataFrom = data;
    this.action = data.action;
  }

  ngOnInit(): void {
    this.partnerForm = this.formBuilder.group({
      'code': ['', [Validators.required, Validators.pattern('^([^!@#$%^&*()+=<>,.?\/\]*)$')]],
      'desc': ['', Validators.required],
      'typeCheckValid': [''],
      'limit': [0],
      'active': [true],
    });

    if(this.dataFrom.action ==="edit"){
      
      this.partnerForm.patchValue({
        'code': this.dataFrom.code,
        'desc': this.dataFrom.desc,
        'typeCheckValid': this.dataFrom.typeCheckValid,
        'limit': this.dataFrom.limit,
        'active': this.dataFrom.status,
      });
    }
  }


  submit(){

    if (!this.partnerForm.valid) {
      return false;
    }

    const payload = {
      ...this.partnerForm.value
    };
  
    this.thirdPartyService.savePartner(payload).subscribe((response: any) => {
      if (response.statusCode === 'success') {
        this.alertServices.alert({
          type: "🎉🎉🎉 Thành công !!!",
          message: "🎉🎉 Xử lý thành công",
          msgClass: "cssSuccess",
        });
        this.dialogRef.close(payload);
      } else {
        this.alertServices.alert({
          type: "🚨🚨🚨🚨 Lỗi ",
          msgClass: "cssBig",
          message: "🚨🚨 Lỗi vui lòng liên hệ IT Support để được hổ trợ 🚨🚨",
        });
        this.dialogRef.close(payload);
      }
    });

  } 

  update(){
    if (!this.partnerForm.valid) {
      return false;
    }

    const payload = {
      ...this.partnerForm.value
    };
    
    this.thirdPartyService.updatePartner(payload).subscribe((response: any) => {
      if (response.statusCode === 'success') {
        this.alertServices.alert({
          type: "🎉🎉🎉 Thành công !!!",
          message: "🎉🎉 Xử lý thành công",
          msgClass: "cssSuccess",
        });
        this.dialogRef.close(payload);
      } else {
        this.alertServices.alert({
          type: "🚨🚨🚨🚨 Lỗi ",
          msgClass: "cssBig",
          message: "🚨🚨 Lỗi Điều chuyển máy POS, vui lòng liên hệ IT Support để được hổ trợ 🚨🚨",
        });
        this.dialogRef.close(payload);
      }
    });
  } 
}