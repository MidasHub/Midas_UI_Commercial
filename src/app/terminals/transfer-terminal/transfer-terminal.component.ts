import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TerminalsService } from "../terminals.service";
import { AlertService } from "app/core/alert/alert.service";
import { BanksService } from "app/banks/banks.service";

@Component({
  selector: "midas-transfer-terminal",
  templateUrl: "./transfer-terminal.component.html",
  styleUrls: ["./transfer-terminal.component.scss"],
})
export class TransferTerminalComponent implements OnInit {
  transferTerminalForm: FormGroup;
  listLimitPos: any[];
  offices: any[];
  listPartner: any[];
  limitRemain: number;
  officeName: string;
  terminalName: string;
  terminalId: string;
  rate: string;
  itemPos: any;
  isChoosePartner: boolean = true;
  transferRequest: any;
  officeId: number;
  isTF: boolean = true;
  commonOffices: any[] = this.bankService.documentOffices;
  transferOptions: any[] = [
    { code: 0, value: "Nội bộ" },
    { code: 1, value: "Liên đối tác" }
  ];
  constructor(
    private formBuilder: FormBuilder,
    private terminalsService: TerminalsService,
    private alertServices: AlertService,
    private bankService: BanksService,
    public dialogRef: MatDialogRef<TransferTerminalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.terminalId = data.terminalId;
    this.terminalName = data.terminalName;
  }

  ngOnInit() {
    this.transferTerminalForm = this.formBuilder.group({
      transferType: [0],
      terminalId: [""],
      terminalName: [""],
      officeId: ["", [Validators.required]],
      officeName: [""],
      limitRemain: [""],
    });
    this.transferTerminalForm.get("limitRemain").disable();

    this.transferTerminalForm.get("transferType").valueChanges.subscribe((value) => {
      if (value == 0) {
        this.transferTerminalForm.removeControl("transferTarget");
        this.transferTerminalForm.removeControl("rate");
        this.transferTerminalForm.addControl("officeId", new FormControl("", [Validators.required]));
      } else {
        if (value == 1) {
          this.isChoosePartner = true;
          this.transferTerminalForm.removeControl("transferTarget");
          this.transferTerminalForm.removeControl("officeId");
          this.transferTerminalForm.addControl("transferTarget", new FormControl("", [Validators.required]));
          this.transferTerminalForm.addControl("rate", new FormControl("", [Validators.required]));

          this.transferTerminalForm.get("transferTarget").valueChanges.subscribe((value) => {
            if (this.transferRequest.isTransferBack &&
               this.transferRequest.senderExternalId == value) {
                this.transferTerminalForm.get("transferType").setValue(2);
            }
          });

        } else {
          if (value == 2) {
            this.isChoosePartner = false;
            this.transferTerminalForm.removeControl("transferTarget");
            this.transferTerminalForm.addControl(
              "transferTarget",
              new FormControl(this.transferRequest.isTransferBack ? this.transferRequest.senderExternalId : "", [Validators.required])
            );
            this.transferTerminalForm.removeControl("rate");
            this.transferTerminalForm.removeControl("officeId");
          }
        }
      }
    });

    this.terminalsService.getTerminalInfo(this.terminalId).subscribe((data) => {
      if (data.status === "200") {
        this.itemPos = data.result.limitPos;
        this.offices = this.commonOffices;
        this.transferRequest = data.result.requestTransfer;
        if (!this.transferRequest || this.transferRequest.status == 1) {
          this.transferRequest.isTransferBack = false;
        } else {
          this.transferRequest.isTransferBack = true;
          this.transferOptions.push({ code: 2, value: "Trả máy" })
        };

        if (!this.offices) {
          this.bankService.getListOfficeCommon().subscribe((offices: any) => {
            this.offices = offices.result.listOffice;
          });
        }
        this.listPartner = data.result.listPartner;

        this.transferTerminalForm.patchValue({
          terminalId: this.terminalId,
          terminalName: this.terminalName,
          officeName: this.itemPos.officeId,
          limitRemain: this.itemPos.limitRemain,
        });
      } else {
        this.isTF = false;
      }
    });
  }

  showOptionPartnerTransfer(partnerId: string, partnerName: string) {
    if (!this.transferRequest.isTransferBack) {
      return partnerName;
    } else {
      if (partnerId == this.transferRequest.senderExternalId) {
        return `${partnerName} (Trả máy)`;
      } else {
        return `${partnerName}`;
      }
    }
  }

  submit() {
    if (!this.transferTerminalForm.valid) {
      return;
    }

    let transferType = this.transferTerminalForm.value.transferType;
    let officeIdSelect =
      transferType == 0 ? this.transferTerminalForm.value.officeId : this.transferTerminalForm.value.transferTarget;
    if (this.itemPos.officeId === officeIdSelect && transferType == 0) {
      this.alertServices.alert({
        type: "🚨🚨🚨🚨 Lỗi ",
        msgClass: "cssBig",
        message: "🚨🚨 Chi nhánh không thay đổi  🚨🚨",
      });
      return;
    }

    const rate = this.transferTerminalForm.get("rate") ? this.transferTerminalForm.get("rate").value : 0;

    this.terminalsService.transfer(this.terminalId, rate, officeIdSelect, transferType).subscribe((response: any) => {
      if (response.statusCode === "success") {
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
