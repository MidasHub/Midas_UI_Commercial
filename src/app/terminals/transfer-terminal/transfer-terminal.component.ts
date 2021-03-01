import { Component, OnInit,Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { TerminalsService } from '../terminals.service';
import { AlertService } from 'app/core/alert/alert.service';

@Component({
  selector: 'midas-transfer-terminal',
  templateUrl: './transfer-terminal.component.html',
  styleUrls: ['./transfer-terminal.component.scss']
})
export class TransferTerminalComponent implements OnInit {

  transferTerminalForm:FormGroup;
  listLimitPos:any[];
  offices: any[];
  limitRemain:number
  officeName:string;
  terminalName:string;
  terminalId:string;
  itemPos:any;
  officeId:number;
  isTF:boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private terminalsService: TerminalsService,
    private alertServices: AlertService,
    public dialogRef: MatDialogRef<TransferTerminalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {

      this.terminalId = data.terminalId;
      this.terminalName = data.terminalName;
  }

  ngOnInit(){

   this.transferTerminalForm = this.formBuilder.group({
    'terminalId': [''],
    'terminalName': [''],
    'officeId': ['',[Validators.required,]],
    'officeName': [''],
    'limitRemain': [''],
    });
    this.terminalsService.getTerminalInfo(this.terminalId).subscribe((data) => {
      console.log("TransferTerminalComponent result",data);
      if(data.status==='200'){
        this.itemPos = data.result.limitPos;
        this.offices = data.result.listOffice;
        this.transferTerminalForm.patchValue({
          'terminalId': this.terminalId ,
          'terminalName': this.terminalName,
          'officeId': this.itemPos.officeId,
          'officeName': this.itemPos.officeName,
          'limitRemain': this.itemPos.limitRemain,
        });
      }else{
        this.isTF = false;
      }

    });
  }


submit(){

    if (!this.transferTerminalForm.valid) {
      return false;
    }
    let officeIdSelect = this.transferTerminalForm.value.officeId;
    if(this.itemPos.officeId === officeIdSelect){
      this.alertServices.alert({
        type: "🚨🚨🚨🚨 Lỗi ",
        msgClass: "cssBig",
        message: "🚨🚨 NoThing Change 🚨🚨",
      });
      return false;
    }
    const data = {
        "terminalId":this.terminalId,
        "officeId":officeIdSelect,
    };

    this.terminalsService.transfer(this.terminalId, officeIdSelect).subscribe((response: any) => {
      if (response.statusCode === 'success') {
        this.alertServices.alert({
          type: "🎉🎉🎉 Thành công !!!",
          message: "🎉🎉 Xử lý thành công",
          msgClass: "cssSuccess",
        });
        this.dialogRef.close({ status: true });
      } else {
        this.alertServices.alert({
          type: "🚨🚨🚨🚨 Lỗi ",
          msgClass: "cssBig",
          message: "🚨🚨 Lỗi dịch vụ vui lòng liên hệ IT Support để được hổ trợ 🚨🚨",
        });
        this.dialogRef.close({ status: false });
      }
    });

  }
}
