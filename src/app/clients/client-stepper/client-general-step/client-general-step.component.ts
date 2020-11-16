/** Angular Imports */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';

/** Custom Services */
import {SettingsService} from 'app/settings/settings.service';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {CentersService} from '../../../centers/centers.service';
import * as moment from 'moment';


/**
 * Create Client Component
 */
@Component({
  selector: 'mifosx-client-general-step',
  templateUrl: './client-general-step.component.html',
  styleUrls: ['./client-general-step.component.scss']
})
export class ClientGeneralStepComponent implements OnInit {

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();

  /** Client Template */
  @Input() clientTemplate: any;
  /** Identifier Template */
  @Input() clientIdentifierTemplate: any;

  @Output() cancelEvent = new EventEmitter();

  currentUser: any;
  /** Create Client Form */
  createClientForm: FormGroup;

  /** Office Options */
  officeOptions: any;
  /** Staff Options */
  staffOptions: any;
  /** Legal Form Options */
  legalFormOptions: any;
  /** Client Type Options */
  clientTypeOptions: any;
  /** Client Classification Options */
  clientClassificationTypeOptions: any;
  /** Business Line Options */
  businessLineOptions: any;
  /** Constitution Options */
  constitutionOptions: any;
  /** Gender Options */
  genderOptions: any;
  /** Saving Product Options */
  savingProductOptions: any;
  /** Account Payment Options */
  accountPayments: any;
  /** review images */
  reviewFiles: any;
  /** Documents type */
  documentTypes: any;

  clientFilesDataBefore: any;
  clientFilesDataAfter: any;
  isTeller = true;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {DatePipe} datePipe Date Pipe
   * @param {SettingsService} settingsService Setting service
   */
  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private settingsService: SettingsService,
              private authenticationService: AuthenticationService,
              private centersService: CentersService) {
    this.setClientForm();
  }

  ngOnInit() {
    this.setOptions();
    this.buildDependencies();
  }

  /**
   * Creates the client form.
   */
  setClientForm() {
    this.createClientForm = this.formBuilder.group({
      'officeId': ['', Validators.required],
      'staffId': [''],
      'isStaff': [false],
      'active': [true],
      'addSavings': [true],
      'accountNo': [''],
      'externalId': [''],
      'genderId': [''],
      'mobileNo': [''],
      'dateOfBirth': [''],
      'clientTypeId': [21],
      'clientClassificationId': [''],
      // 'submittedOnDate': [{value: '', disabled: true}],
      'staff_code': [''],
      'documentTypeId': [''],
      // 'activationDate': [{value: '', disabled: true}],
      'savingsProductId': [2],
      'firstname': [''],
      'middlename': [''],
      'lastname': [''],
      'legalFormId': [1]
    });
    this.createClientForm.addControl('activationDate', new FormControl(new Date()));
    this.createClientForm.addControl('submittedOnDate', new FormControl(new Date()));
    this.createClientForm.get('officeId').valueChanges.subscribe((value: any) => {
      this.centersService.getStaff(value).subscribe((staffs: any) => {
        console.log(staffs);
        this.staffOptions = staffs?.staffOptions;
      });
    });
  }

  /**
   * Sets select dropdown options.
   */
  setOptions() {
    this.officeOptions = this.clientTemplate.officeOptions;
    this.staffOptions = this.clientTemplate.staffOptions;
    this.legalFormOptions = this.clientTemplate.clientLegalFormOptions;
    this.clientTypeOptions = this.clientTemplate.clientTypeOptions;
    this.clientClassificationTypeOptions = this.clientTemplate.clientClassificationOptions;
    this.businessLineOptions = this.clientTemplate.clientNonPersonMainBusinessLineOptions;
    this.constitutionOptions = this.clientTemplate.clientNonPersonConstitutionOptions;
    this.genderOptions = this.clientTemplate.genderOptions;
    this.savingProductOptions = this.clientTemplate.savingProductOptions;
    this.documentTypes = [];
    this.clientIdentifierTemplate.allowedDocumentTypes?.map((type: any) => {
      if (type.name === 'Passport' || type.name === 'CMND' || type.name === 'CCCD') {
        this.documentTypes.push(type);
      }
      if (type.name === 'CMND') {
        this.createClientForm.get('documentTypeId').setValue(type.id);
      }
    });
    this.currentUser = this.authenticationService.getCredentials();
    const {roles, staffId} = this.currentUser;
    this.createClientForm.get('staffId').setValue(staffId);
    roles.map((role: any) => {
      if (role.id !== 3) {
        this.isTeller = false;
      }
    });
  }

  /**
   * Adds controls conditionally.
   */
  buildDependencies() {
    // this.createClientForm.get('legalFormId').valueChanges.subscribe((legalFormId: any) => {
    //   if (legalFormId === 1) {
    //     this.createClientForm.removeControl('fullname');
    //     this.createClientForm.removeControl('clientNonPersonDetails');
    //     // Jean: change from '(^[A-z]).*' to  '^([^!@#$%^&*()_+=<>,.?\/\-]*)$'
    //     this.createClientForm.addControl('firstname', new FormControl('', [Validators.required, Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')]));
    //     this.createClientForm.addControl('middlename', new FormControl('', Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')));
    //     this.createClientForm.addControl('lastname', new FormControl('', [Validators.required, Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')]));
    //   } else {
    //     this.createClientForm.removeControl('firstname');
    //     this.createClientForm.removeControl('middlename');
    //     this.createClientForm.removeControl('lastname');
    //     this.createClientForm.addControl('fullname', new FormControl('', [Validators.required, Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')]));
    //     this.createClientForm.addControl('clientNonPersonDetails', this.formBuilder.group({
    //       'constitutionId': [''],
    //       'incorpValidityTillDate': [''],
    //       'incorpNumber': [''],
    //       'mainBusinessLineId': [''],
    //       'remarks': ['']
    //     }));
    //   }
    // });
    // this.createClientForm.get('legalFormId').patchValue(1);
  }

  fileChangeBefore(event: any): Promise<any> {
    return new Promise<any>(async resolve => {
      const file = event.target.files[0];
      file.path = await this.readURL(file);
      this.clientFilesDataBefore = file;
    });
  }

  fileChangeAfter(event: any): Promise<any> {
    return new Promise<any>(async resolve => {
      const file = event.target.files[0];
      file.path = await this.readURL(file);
      this.clientFilesDataAfter = file;
    });
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

  /**
   * Client General Details
   */
  get clientGeneralDetails() {
    const generalDetails = this.createClientForm.value;
    const dateFormat = this.settingsService.dateFormat;
    const locale = this.settingsService.language.code;
    // TODO: Update once language and date settings are setup
    for (const key in generalDetails) {
      if (generalDetails[key] === '' || key === 'addSavings') {
        delete generalDetails[key];
      }
    }
    if (generalDetails.submittedOnDate && moment.isDate(generalDetails.submittedOnDate)) {
      generalDetails.submittedOnDate = this.datePipe.transform(generalDetails.submittedOnDate, dateFormat);
    }
    if (generalDetails.activationDate && moment.isDate(generalDetails.activationDate)) {
      generalDetails.activationDate = this.datePipe.transform(generalDetails.activationDate, dateFormat);
    }
    if (generalDetails.dateOfBirth && moment.isDate(generalDetails.dateOfBirth)) {
      generalDetails.dateOfBirth = this.datePipe.transform(generalDetails.dateOfBirth, dateFormat);
    }
    //
    // if (generalDetails.clientNonPersonDetails && generalDetails.clientNonPersonDetails.incorpValidityTillDate) {
    //   generalDetails.clientNonPersonDetails = {
    //     ...generalDetails.clientNonPersonDetails,
    //     incorpValidityTillDate: this.datePipe.transform(generalDetails.dateOfBirth, dateFormat),
    //     dateFormat,
    //     locale
    //   };
    // }
    // generalDetails.addSavings = true;
    console.log({generalDetails});
    return generalDetails;
  }

  get files() {
    const files = [];
    if (this.clientFilesDataBefore) {
      files.push(this.clientFilesDataBefore);
    }
    if (this.clientFilesDataAfter) {
      files.push(this.clientFilesDataAfter);
    }
    return {files: files};
  }

  clickCancel() {
    this.cancelEvent.emit();
  }
}
