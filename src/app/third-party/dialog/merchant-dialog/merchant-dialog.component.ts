import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "app/core/alert/alert.service";
import { ThirdPartyService } from "app/third-party/third-party.service";

@Component({
  selector: "midas-merchant-dialog",
  templateUrl: "./merchant-dialog.component.html",
  styleUrls: ["./merchant-dialog.component.scss"],
})
export class MerchantDialogComponent implements OnInit {
  merchantForm: FormGroup;
  dataFrom: any;
  action: string;
  partners: any[];
  merchant: any;
  timeTypes: any[] = [
    {
      code: "DAY",
      desc: "Ngày",
    },
    {
      code: "HOUR",
      desc: "Giờ",
    },
    {
      code: "MINUTE",
      desc: "Phút",
    },
    {
      code: "SECOND",
      desc: "Giây",
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private thirdPartyService: ThirdPartyService,
    private alertServices: AlertService,
    public dialogRef: MatDialogRef<MerchantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataFrom = data;
    this.action = data.action;
  }

  ngOnInit(): void {
    this.thirdPartyService.getPartners("active").subscribe((data: any) => {
      this.partners = data.result.partners;
    });
    this.merchantForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^([^!@#$%^&*()+=<>,.?/]*)$")]],
      partner: ["", Validators.required],
      rangeDay: [""],
      unitType: ["DAY"],
      active: [true],
    });

    if (this.dataFrom.action === "edit") {
      this.merchantForm.patchValue({
        name: this.dataFrom.name,
        partner: this.dataFrom.partnerCode,
        rangeDay: this.dataFrom.rangeDay,
        unitType: this.dataFrom.unitType,
        active: this.dataFrom.status,
      });

    } else {
      this.merchantForm.removeControl("active");
    }
  }

  submit() {
    if (!this.merchantForm.valid) {
      return false;
    }

    const payload = {
      ...this.merchantForm.value,
    };

    this.thirdPartyService.saveMerchant(payload).subscribe((response: any) => {
      if (response.statusCode === "success") {
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

  update() {
    if (!this.merchantForm.valid) {
      return false;
    }

    const payload = {
      ...this.merchantForm.value,
    };

    this.thirdPartyService.updateMerchant(payload).subscribe((response: any) => {
      if (response.statusCode === "success") {
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
