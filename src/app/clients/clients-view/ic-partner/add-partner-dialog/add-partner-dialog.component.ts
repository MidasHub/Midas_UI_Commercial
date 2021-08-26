/** Angular Imports */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {ClientsService} from '../../../clients.service';
import { AlertService } from 'app/core/alert/alert.service';
/**
 * Upload image dialog component.
 */
@Component({
  selector: 'midas-add-partner-dialog',
  templateUrl: './add-partner-dialog.component.html',
  styleUrls: ['./add-partner-dialog.component.scss']
})
export class AddPartnerDialogComponent implements OnInit {

addPartnerForm: FormGroup = new FormGroup({});
addPartnerData: any = [];
documentIdentifier = false;
displayName!: string;
externalId!: string;
partnerName!: string;
partner: PartnerObj = {displayName : '__________' , externalId : '__________'};
payloads!: any[];
constructor(public dialogRef: MatDialogRef<AddPartnerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
            private formBuilder: FormBuilder,
            private clientsService: ClientsService, private alertServices: AlertService
           ) {   }


    ngOnInit(): void {

    }

search() {
    this.clientsService.SearchPartner(this.partnerName).subscribe((data: any) => {
        const payload = data.result.Client[0];
        if (!payload) {
            this.alertServices.alert({
                type: '🚨🚨🚨🚨 Lỗi ',
                msgClass: 'cssBig',
                message: 'Không Tìm Thấy Đối Tác',
              });
        } else {
            this.partner = data.result.Client[0];
        }
    });
}

submit() {
    this.clientsService.AddICPartner(this.partner.externalId).subscribe((data: any) => {
        this.partner = data.result;
        if (data.result.status) {
            this.partner = { displayName: '', externalId : ''};
            this.partnerName = '' ;
            this.alertServices.alert({
              type: '🎉🎉🎉 Thành công !!!',
              message: '🎉🎉 Xử lý thành công',
              msgClass: 'cssSuccess',
            });
            this.payloads.push(data.result.payload);
          } else {
            this.alertServices.alert({
              type: '🚨🚨🚨🚨 Lỗi ',
              msgClass: 'cssBig',
              message: data?.result?.message,
            });
        }
    });
}
cancel() {
    this.dialogRef.close(this.payloads);
}

}
interface PartnerObj {
    displayName: string ;
    externalId: string;
}
