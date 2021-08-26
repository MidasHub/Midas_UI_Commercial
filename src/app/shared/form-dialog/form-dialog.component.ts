import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

import { FormfieldBase } from './formfield/model/formfield-base';

import { FormGroupService } from './form-group.service';

import { I18nService } from 'app/core/i18n/i18n.service';
import { ClientsService } from 'app/clients/clients.service';

const layoutGap = 2;

@Component({
  selector: 'mifosx-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent implements OnInit {
  layout: {
    columns: number;
    columnWidth?: number;
    flex: number;
    gap?: number;
    cancelButtonText?: string;
    addButtonText?: string;
  } = {
    columns: 1,
    columnWidth: 400,
    flex: 100,
    cancelButtonText: this.i18n.getTranslate('Shared_Component.FormDialog.btnCancel'), // 'Cancel',
    addButtonText: this.i18n.getTranslate('Shared_Component.FormDialog.btnAdd'), // 'Add'
  };

  form: FormGroup = new FormGroup({});
  formfields: FormfieldBase[];
  pristine: boolean;
  cardTypes: any[];

  constructor(
    private clientService: ClientsService,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formGroupService: FormGroupService,
    private i18n: I18nService
  ) {
    this.dialogRef.disableClose = data.disableClose !== undefined ? data.disableClose : true;
    this.formfields = data.formfields.sort(
      (formfieldA: FormfieldBase, formfieldB: FormfieldBase) => formfieldA.order - formfieldB.order
    );
    this.cardTypes = data.cardTypes;
    this.pristine = data.pristine !== undefined ? data.pristine : true;
    this.layout = { ...this.layout, ...data.layout };
    this.layout.gap = this.layout.columns > 1 ? layoutGap : 0;
    this.layout.flex = this.layout.flex / this.layout.columns - this.layout.gap;
  }

  ngOnInit() {
    this.dialogRef.updateSize(`${(this.layout.columnWidth ? this.layout.columnWidth : 0) * this.layout.columns}px`);
    this.form = this.formGroupService.createFormGroup(this.formfields);
    this.form?.controls['binCode']?.valueChanges.subscribe((value) => {
      for (const typeCard of this.cardTypes) {
        if (String(value).startsWith(String(typeCard.codeDigit))) {
          this.form.controls['cardType'].setValue(typeCard.code);
        }
      }
    });
    this.form?.controls['amountSubmit']?.valueChanges.subscribe((value) => {
      this.form.get('amountSubmit')?.patchValue(this.formatCurrency(value), { emitEvent: false });
    });
    if (!this.pristine) {
      this.form.markAsDirty();
    }

    this.form?.controls['stateProvinceId']?.valueChanges.subscribe((value) => {
      this.clientService.getClientDistrict(value).subscribe((res: any) => {
        this.formfields.map((item: any) => {
          if (item.controlName === 'countyDistrict') {
            item.value = res.result.listAddressDistrict ? res.result.listAddressDistrict.refid : '';
            item.options = { label: 'description', value: 'refid', data: res.result.listAddressDistrict };
          }
        });
      });
    });

    this.form?.controls['countyDistrict']?.valueChanges.subscribe((value) => {
      this.clientService.getClientTownVillage(value).subscribe((res: any) => {
        this.formfields.map((item: any) => {
          if (item.controlName === 'townVillage') {
            item.value = res.result.listAddressWard ? res.result.listAddressWard.refid : '';
            item.options = { label: 'description', value: 'refid', data: res.result.listAddressWard };
          }
        });
      });
    });

  }
  formatCurrency(value: string) {
    value = String(value);
    const neg = value.startsWith('-');
    value = value.replace(/[-\D]/g, '');
    value = value.replace(/(\d{3})$/, ',$1');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    value = value !== '' ? '' + value : '';
    if (neg) {
      value = '-'.concat(value);
    }

    return value;
  }
  get getForm() {
    return this.form;
  }

}
