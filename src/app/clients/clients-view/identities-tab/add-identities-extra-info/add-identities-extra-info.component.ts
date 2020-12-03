import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BankService} from '../../../../services/bank.service';
import {AuthenticationService} from '../../../../core/authentication/authentication.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-add-identities-extra-info',
  templateUrl: './add-identities-extra-info.component.html',
  styleUrls: ['./add-identities-extra-info.component.scss']
})
export class AddIdentitiesExtraInfoComponent implements OnInit {
  form: FormGroup;
  documentTypes: any[];
  statusOptions: any[] = [{value: 'Active'}, {value: 'Inactive'}];
  documentCardBanks: any[];
  documentCardTypes: any[];
  currentUser: any;
  isTeller = true;
  existBin = false;

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private bankService: BankService,
              private authenticationService: AuthenticationService) {
    console.log(data);
    const {clientIdentifierTemplate} = data;
    this.documentTypes = clientIdentifierTemplate.allowedDocumentTypes;
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
      dueDay: ['', Validators.required],
      expiredDate: ['',  Validators.required]
    });

  }

}
