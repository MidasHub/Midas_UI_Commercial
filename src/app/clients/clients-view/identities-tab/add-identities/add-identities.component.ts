import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../core/authentication/authentication.service';
import {AlertService} from '../../../../core/alert/alert.service';
import {BanksService} from '../../../../banks/banks.service';

import { Logger } from "../../../../core/logger/logger.service";
import { slice } from 'lodash';
const log = new Logger('-Add-Identities-')

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-add-identities',
  templateUrl: './add-identities.component.html',
  styleUrls: ['./add-identities.component.scss']
})
export class AddIdentitiesComponent implements OnInit {
  form: FormGroup;
  documentTypes: any[];
  statusOptions: any[] = [{value: 'Active'}, {value: 'Inactive'}];
  documentCardBanks: any[] = this.bankService.documentCardBanks;
  documentCardTypes: any[] = this.bankService.documentCardTypes;
  currentUser: any;
  isTeller = true;
  existBin = false;

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private bankService: BanksService,
              private authenticationService: AuthenticationService,
              private alterService: AlertService) {
    this.documentTypes = [];
    const {clientIdentifierTemplate} = data;
    //Chuyển đổi thông tin Documenttype ID thành type
    clientIdentifierTemplate.allowedDocumentTypes.forEach((type: any) => {
      if (data.addOther) {
        //Nếu có thông tin add Other trong bộ đata
        if (type.id < 38 || type.id > 57) {

          this.documentTypes.push(type);
        }
      } else {
        //Nếu là thẻ
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
      'status': ['Active'],
      'documentKey': [''],
      'description': ['']
    });

    // this.bankService.getBanks().subscribe((result: any) => {
    //   log.debug(result);
    //   if (result) {
    //     this.documentCardBanks = result;
    //   }
    // });

    // this.bankService.getCardTypes().subscribe((result: any) => {
    //   log.debug(result);
    //   if (result) {
    //     this.documentCardTypes = result;
    //   }
    // });
    log.debug('The data import from bankService: ', this.documentCardBanks,this.documentCardTypes);

    this.form.get('documentTypeId').valueChanges.subscribe((value: any) => {
      const type = this.documentTypes.find(v => v.id === value);
      if (type && Number(type.id) >= 38 && Number(type.id) <= 57) {
        this.form.addControl('documentCardBank', new FormControl());
        this.form.addControl('documentCardType', new FormControl());
        this.form.addControl('dueDay', new FormControl('', [Validators.max(31), Validators.min(0)]));
        this.form.addControl('expiredDate', new FormControl(''));
      } else {
        this.form.removeControl('documentCardBank');
        this.form.removeControl('documentCardType');
        this.form.removeControl('dueDay');
        this.form.removeControl('expiredDate');
      }
    });

    this.form.get('documentKey').valueChanges.subscribe((value: any) => {
      if (value.length === 6) {
        const typeDocument = this.form.get('documentTypeId').value;
        const type = this.documentTypes.find(v => v.id === typeDocument);
        if (type && Number(type.id) >= 38 && Number(type.id) <= 57) {

          log.debug('Cần tìm thông bincode: ',value,' - 6 first: ', value.slice(0,6))

          this.bankService.getInfoBinCode(value.slice(0,6)).subscribe((res: any) => {
            if (res) {
              if (res.existBin) {
                const {bankCode, cardType} = res;
                this.existBin = res.existBin;
                this.form.get('documentCardBank').setValue(bankCode);
                this.form.get('documentCardType').setValue(cardType);
              } else {
                this.existBin = false;
                this.alterService.alert({
                  message: 'Đầu thẻ chưa tồn tại trong hệ thống, vui lòng chọn ngân hàng bên cạnh!',
                  msgClass: 'cssDanger'
                });
              }
            }
          });
        }
      }
    });
  }

}
