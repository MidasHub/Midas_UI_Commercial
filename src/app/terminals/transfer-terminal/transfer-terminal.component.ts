import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TerminalsService } from "../terminals.service";
import { AlertService } from "app/core/alert/alert.service";
import { BanksService } from "app/banks/banks.service";
import { MatTableDataSource } from "@angular/material/table";
import { ReturnStatement } from "@angular/compiler";
import { forEach } from "lodash";

@Component({
  selector: "midas-transfer-terminal",
  templateUrl: "./transfer-terminal.component.html",
  styleUrls: ["./transfer-terminal.component.scss"],
})
export class TransferTerminalComponent implements OnInit {
  transferTerminalForm: FormGroup = new FormGroup({});
  listLimitPos?: any[];
  offices?: any[];
  listPartner?: any[];
  limitRemain?: number;
  officeName?: string;
  terminalName: string;
  terminalId: string;
  rate?: string;
  itemPos: any;
  isChoosePartner: boolean = true;
  isTransferBack: boolean = false;
  transferRequest: any;
  officeId?: number;
  isTF: boolean = true;
  cardTypes: any[] = [];
  listRateDefault: any[] = [];
  dataSourceRateDefault :any;
  commonOffices: any[] = this.bankService.documentOffices;
  transferOptions: any[] = [
    { code: 0, value: "Nội bộ" },
    { code: 1, value: "Liên đối tác" }
  ];
  displayedColumns: string[] = [

    "CardType",
    "FeeCost",

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
    this.dataSourceRateDefault = new MatTableDataSource();
    this.bankService.getCardType().subscribe((result) => {
      this.cardTypes = result?.result?.listCardType;

      this.listRateDefault = [];
      this.cardTypes.forEach((card: any) => {
        let limit = {

          cardCode: card.code,
          cardDescription: card.description,
          costPercentage: "",

        };
        this.listRateDefault.push(limit);
      });
    this.dataSourceRateDefault.data = this.listRateDefault;

    });

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
    this.transferTerminalForm.get("limitRemain")!.disable();

    this.transferTerminalForm.get("transferType")!.valueChanges.subscribe((value) => {
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
          this.transferTerminalForm.addControl("rate", new FormControl("",));

          this.transferTerminalForm.get("transferTarget")!.valueChanges.subscribe((value) => {
            if (this.isTransferBack &&
               this.transferRequest.senderExternalId == value) {
                this.transferTerminalForm.get("transferType")?.setValue(2);
            }
          });

        } else {
          if (value == 2) {
            this.isChoosePartner = false;
            this.transferTerminalForm.removeControl("transferTarget");
            this.transferTerminalForm.addControl(
              "transferTarget",
              new FormControl(this.isTransferBack ? this.transferRequest.senderExternalId : "", [Validators.required])
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
          this.isTransferBack = false;
        } else {
          this.isTransferBack = true;
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
    if (!this.isTransferBack) {
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
        msgClass: "cssDanger",
        message: "🚨🚨 Chi nhánh không thay đổi  🚨🚨",
      });
      return;
    }

    const rates = this.listRateDefault;
    let isValidRateSetup = true;
    // check valid list default rate on case transfer to partner global
    if (transferType == 1){
     for (let i = 0; i < rates.length; i++) {
       let rate = rates[i];
      if (!rate.costPercentage || rate.costPercentage < 0) {
        this.alertServices.alert({
          type: "🚨🚨🚨🚨 Lỗi ",
          msgClass: "cssDanger",
          message: `🚨🚨🚨🚨 Lỗi cài đặt phí cho loại thẻ ${rate.cardDescription}`,
        });
        isValidRateSetup = false;
        return;
      }
     }
    }
    if (!isValidRateSetup){
      return;
    }
    const rate = this.transferTerminalForm.get("rate") ? JSON.stringify(rates) : "";

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
          msgClass: "cssDanger",
          message: "🚨🚨 Lỗi dịch vụ vui lòng liên hệ IT Support để được hổ trợ 🚨🚨",
        });
        this.dialogRef.close({ status: false });
      }
    });
  }
}
