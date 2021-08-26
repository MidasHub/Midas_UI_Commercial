import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';
import { BanksService } from '../../../../banks/banks.service';

// **Logger */
import { Logger } from '../../../../core/logger/logger.service';
const log = new Logger('-Add card extra info-');
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-dialog-add-limit-extra-info',
  templateUrl: './dialog-add-limit-extra-info.component.html',
  styleUrls: ['./dialog-add-limit-extra-info.component.scss'],
})
export class AddLimitIdentitiesExtraInfoComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  documentTypes: any[];
  statusOptions: any[] = [{ value: 'Active' }, { value: 'Inactive' }];
  documentCardBanks!: any[];
  documentCardTypes!: any[];
  currentUser: any;
  isTeller = true;
  existBin = false;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    log.debug(data);
    const { clientIdentifierTemplate } = data;
    this.documentTypes = clientIdentifierTemplate.allowedDocumentTypes;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      limitCard: [0, Validators.required],
      classCard: ['', Validators.required],
    });
  }
}
