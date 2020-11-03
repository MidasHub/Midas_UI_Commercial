import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BankService} from '../../../../services/bank.service';

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

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private bankService: BankService) {
    console.log(data);
    const {clientIdentifierTemplate} = data;
    this.documentTypes = clientIdentifierTemplate.allowedDocumentTypes;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'documentTypeId': [''],
      'documentCardBank': [''],
      'status': [''],
      'documentKey': [''],
      'description': ['']
    });
    this.bankService.getListBank().subscribe((result: any) => {
      console.log('_________ list bank', result);
    });
  }

}
