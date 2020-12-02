import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BillsService } from "app/bills-manage/bills-manage.service";

@Component({
  selector: "midas-upload-bill",
  templateUrl: "./upload-bill.component.html",
  styleUrls: ["./upload-bill.component.scss"],
})
export class UploadBillComponent implements OnInit {
  formDialog: FormGroup;
  listMerchant: any;
  listPartner: any;
  fileNameChosen: string;
  file: any;

  constructor(
    public dialogRef: MatDialogRef<UploadBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private billsService: BillsService
  ) {
    this.billsService.getListMerchant().subscribe((data: any) => {
      this.listMerchant = data.result.listMerchant;
    });

    this.formDialog = this.formBuilder.group({
      fileName: ["", Validators.required],
      merchantId: ["", Validators.required],
      partner: ["", Validators.required],
      note: ["", Validators.required],
      file: ["", Validators.required],
    });

    this.formDialog.get('merchantId').valueChanges.subscribe((value => {
      // const office = this.offices.find(v => v.name === value);
      this.billsService.getListPartnerByMerchant(value).subscribe((listPartner: any) => {
        this.listPartner = listPartner?.result?.listPartner;
        this.formDialog.get('partner').setValue(this.listPartner[0].code);
      });
    }));

    this.formDialog.get('file').valueChanges.subscribe((value => {
      this.fileNameChosen = value === ''? 'Chưa chọn file':value;
    }));
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

  fileChange(event: any): Promise<any> {
    console.log(event)
    return new Promise<any>(async resolve => {
      const file = event.target.files[0];
      file.path = await this.readURL(file);
      this.file = file;
    });
  }

  ngOnInit(): void {}
}
