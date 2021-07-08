import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../core/authentication/authentication.service';
import {AlertService} from '../../../../core/alert/alert.service';
import {BanksService} from '../../../../banks/banks.service';

import { Logger } from '../../../../core/logger/logger.service';
import {environment} from 'environments/environment';
import {LuhnService} from './luhn.service';
const log = new Logger('-Add-Identities-');

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-add-identities',
  templateUrl: './add-identities.component.html',
  styleUrls: ['./add-identities.component.scss']
})
export class AddIdentitiesComponent implements OnInit {
  form: FormGroup;
  documentTypes: any[];
  statusOptions: any[] = [{value: 'Active', description: 'Giử thẻ'}, {value: 'Inactive', description: 'Không giử thẻ'}];
  documentCardBanks: any[] = this.bankService.documentCardBanks;
  documentCardTypes: any[] = this.bankService.documentCardTypes;
  currentUser: any;
  isTeller = true;
  existBin = false;
  classCardEnum = ['CLASSIC', 'GOLD', 'PLATINUM', 'TITANINUM', 'PRECIOUS', 'SIGNATURE', 'INFINITY'];
  isValidCardNumber = false;

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private bankService: BanksService,
              private luhnService: LuhnService,
              private authenticationService: AuthenticationService,
              private alterService: AlertService) {
    this.documentTypes = [];
    const {clientIdentifierTemplate} = data;
    // Chuyển đổi thông tin Documenttype ID thành type
    clientIdentifierTemplate.allowedDocumentTypes.forEach((type: any) => {
      if (data.addOther) {
        // Nếu có thông tin add Other trong bộ đata
        if (type.id < 38 || type.id > 57) {

          this.documentTypes.push(type);
        }
      } else {
        // Nếu là thẻ
        if (type.id >= 38 && type.id <= 57) {
          this.documentTypes.push(type);
        }
      }
    });
    // this.documentTypes = clientIdentifierTemplate.allowedDocumentTypes;
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    const {roles} = this.currentUser;
    roles.map((role: any) => {
      if (role.id !== 3) {
        this.isTeller = false;
      }
    });
    this.form = this.formBuilder.group({
      'documentTypeId': [''],
      'status': ['Inactive'],
      'documentKey': [''],
      'description': ['']
    });

    log.debug('The data import from bankService: ', this.documentCardBanks, this.documentCardTypes);

    this.form.get('documentTypeId').valueChanges.subscribe((value: any) => {

      const type = this.documentTypes.find(v => v.id === value);
      if (type && Number(type.id) >= 38 && Number(type.id) <= 57) {
        this.form.removeControl('documentKey');
        this.form.addControl('documentKey', new FormControl('', [Validators.required,
          Validators.minLength(16), Validators.maxLength(16)]));
        this.form.addControl('documentCardBank', new FormControl('', [Validators.required]));
        this.form.addControl('documentCardType', new FormControl('', [Validators.required]));
        this.form.addControl('dueDay', new FormControl('', [Validators.required, Validators.max(31), Validators.min(1)]));
        this.form.addControl('expiredDate', new FormControl('', [Validators.required]));
        this.form.addControl('limitCard', new FormControl(0, [Validators.required]));
        this.form.addControl('classCard', new FormControl('', [Validators.required]));
        this.form.addControl('isValid', new FormControl(false));

        this.form.get('documentKey').valueChanges.subscribe((value: any) => {
          if (value.length === 6 || value.length === 16 ) {
            const typeDocument = this.form.get('documentTypeId').value;
            const type = this.documentTypes.find(v => v.id === typeDocument);
            if (type && Number(type.id) >= 38 && Number(type.id) <= 57) {

              this.bankService?.getInfoBinCode(value.slice(0, 6)).subscribe((res: any) => {

                if (res) {
                  if (res.existBin) {
                    const {bankCode, cardType} = res;
                    this.existBin = res.existBin;
                    this.form.get('documentCardBank').patchValue(bankCode);
                    this.form.get('documentCardType').patchValue(cardType);
                  } else {
                    this.existBin = false;
                    this.form.get('documentCardBank').patchValue('');
                    this.form.get('documentCardType').patchValue('');
                    this.alterService.alert({
                      message: `Đầu thẻ ${value.slice(0, 6)} chưa tồn tại trong hệ thống, vui lòng liên hệ IT Support!`,
                      msgClass: 'cssDanger'
                    });
                  }
                }
              });
            }
          }
          if (value.length === 16 && environment.applyLuhnAlgorithm ) {
            console.log (this.luhnService.isLuhnId(value));
            console.log ('show button', (!this.form.valid || this.form.pristine) && !this.isValidCardNumber);
            if (this.luhnService.isLuhnId(value)) {

              this.isValidCardNumber = this.luhnService.isLuhnId(value);
              this.alterService.alert({
                message: 'Chúc mừng! Đây là số thẻ đúng.',
                msgClass: 'cssInfo'
              });
            } else {
              this.isValidCardNumber = this.luhnService.isLuhnId(value);
              this.alterService.alert({
                message: 'Đây không phải là số thẻ đúng. Vui lòng kiểm tra lại!',
                msgClass: 'cssDanger'
              });
            }

            this.form.get('isValid').setValue(this.isValidCardNumber);

          }
        });

      } else {
        this.form.addControl('documentKey', new FormControl(''));
        this.form.removeControl('isValid');
        this.form.removeControl('documentCardBank');
        this.form.removeControl('documentCardType');
        this.form.removeControl('dueDay');
        this.form.removeControl('expiredDate');
        this.form.removeControl('limitCard');
        this.form.removeControl('classCard');
      }
    });


  }

}
