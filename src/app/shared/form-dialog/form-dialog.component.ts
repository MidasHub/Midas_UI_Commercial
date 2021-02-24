import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup} from '@angular/forms';

import {FormfieldBase} from './formfield/model/formfield-base';

import {FormGroupService} from './form-group.service';

import {I18nService} from 'app/core/i18n/i18n.service';

const layoutGap = 2;

@Component({
  selector: 'mifosx-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {

  layout: {
    columns: number,
    columnWidth?: number,
    flex?: number,
    gap?: number,
    cancelButtonText?: string,
    addButtonText?: string
  } = {
    columns: 1,
    columnWidth: 400,
    flex: 100,
    cancelButtonText: this.i18n.getTranslate('Shared_Component.FormDialog.btnCancel'), //'Cancel',
    addButtonText: this.i18n.getTranslate('Shared_Component.FormDialog.btnAdd')// 'Add'
  };

  form: FormGroup;
  formfields: FormfieldBase[];
  pristine: boolean;
  cardTypes: any[];

  constructor(public dialogRef: MatDialogRef<FormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formGroupService: FormGroupService,
              private i18n: I18nService) {
    this.dialogRef.disableClose = data.disableClose !== undefined ? data.disableClose : true;
    this.formfields = data.formfields.sort((formfieldA: FormfieldBase, formfieldB: FormfieldBase) => formfieldA.order - formfieldB.order);
    this.cardTypes = data.cardTypes ;
    this.pristine = data.pristine !== undefined ? data.pristine : true;
    this.layout = {...this.layout, ...data.layout};
    this.layout.gap = this.layout.columns > 1 ? layoutGap : 0;
    this.layout.flex = (this.layout.flex / this.layout.columns) - this.layout.gap;
  }

  ngOnInit() {
    this.dialogRef.updateSize(`${this.layout.columnWidth * this.layout.columns}px`);
    this.form = this.formGroupService.createFormGroup(this.formfields);
    this.form.controls["binCode"].valueChanges.subscribe((value) => {
          for (const typeCard of this.cardTypes) {
            if (String(value).startsWith(String(typeCard.codeDigit))) {
              this.form.controls["cardType"].setValue(typeCard.code);
            }
          }
    });
    if (!this.pristine) {
      this.form.markAsDirty();
    }
  }

  get getForm() {
    return this.form;
  }
}
