import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { TerminalsService } from '../terminals.service';

@Component({
  selector: 'midas-edit-terminals',
  templateUrl: './edit-terminals.component.html',
  styleUrls: ['./edit-terminals.component.scss']
})
export class EditTerminalsComponent implements OnInit {

  editTerminalForm:FormGroup;
  offices:any;
  terminalData: any;
  configTerminalColumns: string[] = ['Office', 'Card Type', 'Fee POS', 'Fee Cost', 'Fee Min','Fee Max','Limit Amount/Transaction','Term Transaction/Card'];

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private TerminalsService: TerminalsService,
    private datePipe: DatePipe,
    private settingsService: SettingsService) {
    this.route.data.subscribe((data: { terminalData: any }) => {
      this.terminalData = data.terminalData.result; 
    });
     
  }

  ngOnInit(){
    console.log("terminalData",this.terminalData);
    this.createEditTerminalForm();
    this.setOptions();
    this.buildDependencies();
    this.editTerminalForm.patchValue({
      'terminalId': this.terminalData.ItemPos.terminalId,
      'terminalCode': this.terminalData.ItemPos.terminalCode,
      'terminalName': this.terminalData.ItemPos.terminalName,
      
    });
  }

  createEditTerminalForm() {
    this.editTerminalForm = this.formBuilder.group({
      'terminalId': ['', [Validators.required, Validators.pattern('^([^!@#$%^&*()+=<>,.?\/\]*)$')]],
      'terminalCode': ['', [Validators.required, Validators.pattern('^([^!@#$%^&*()+=<>,.?\/\]*)$')]],
      'terminalName': ['', [Validators.required, Validators.pattern('^([^!@#$%^&*()+=<>,.?\/\]*)$')]],
      'limitPerDay': [''],
      'merchantId': [{ value: '', disabled: true }],
      'officeId': [{ value: '', disabled: true }],
      'status': [''],
      'minFeeDefault': [''],
      'costPercentage':[''],
      'cogsPercentage': [''],
      'minPercentage': [''],
      'maxPercentage': [''],
      'maxLimitAmount': [''],
      'levelLimit': [''],
      'limitList':['']
    });
  }

  setOptions() {
    // this.officeOptions = this.clientDataAndTemplate.officeOptions;
    // this.staffOptions = this.clientDataAndTemplate.staffOptions;
    // this.legalFormOptions = this.clientDataAndTemplate.clientLegalFormOptions;
    // this.clientTypeOptions = this.clientDataAndTemplate.clientTypeOptions;
    // this.clientClassificationTypeOptions = this.clientDataAndTemplate.clientClassificationOptions;
    // this.businessLineOptions = this.clientDataAndTemplate.clientNonPersonMainBusinessLineOptions;
    // this.constitutionOptions = this.clientDataAndTemplate.clientNonPersonConstitutionOptions;
    // this.genderOptions = this.clientDataAndTemplate.genderOptions;
  }
  buildDependencies() {
    
    // this.editClientForm.get('legalFormId').valueChanges.subscribe((legalFormId: any) => {
    //   if (legalFormId === 1) {
    //     this.editClientForm.removeControl('fullname');
    //     this.editClientForm.removeControl('clientNonPersonDetails');
    //     //Jean changed from "Validators.required" to "[Validators.required, Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')]"
    //     this.editClientForm.addControl('firstname', new FormControl(this.clientDataAndTemplate.firstname,[Validators.required, Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')] ));
    //     this.editClientForm.addControl('middlename', new FormControl(this.clientDataAndTemplate.middlename, Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')));
    //     this.editClientForm.addControl('lastname', new FormControl(this.clientDataAndTemplate.lastname, [Validators.required, Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')]));
    //   } else {
    //     this.editClientForm.removeControl('firstname');
    //     this.editClientForm.removeControl('middlename');
    //     this.editClientForm.removeControl('lastname');
    //     this.editClientForm.addControl('fullname', new FormControl(this.clientDataAndTemplate.fullname, [Validators.required, Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')]));
    //     this.editClientForm.addControl('clientNonPersonDetails', this.formBuilder.group({
    //       'constitutionId': [this.clientDataAndTemplate.clientNonPersonDetails.constitution && this.clientDataAndTemplate.clientNonPersonDetails.constitution.id],
    //       'incorpValidityTillDate': [this.clientDataAndTemplate.clientNonPersonDetails.incorpValidityTillDate && new Date(this.clientDataAndTemplate.clientNonPersonDetails.incorpValidityTillDate)],
    //       'incorpNumber': [this.clientDataAndTemplate.clientNonPersonDetails.incorpNumber],
    //       'mainBusinessLineId': [this.clientDataAndTemplate.clientNonPersonDetails.mainBusinessLine && this.clientDataAndTemplate.clientNonPersonDetails.mainBusinessLine.id],
    //       'remarks': [this.clientDataAndTemplate.clientNonPersonDetails.remarks]
    //     }));
    //   }
    // });
  }
  submit(){}
}
