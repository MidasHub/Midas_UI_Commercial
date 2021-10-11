/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';

/** Custom Services */
import { ClientsService } from '../clients.service';
import { SettingsService } from 'app/settings/settings.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';

/**
 * Edit Client Component
 */
@Component({
  selector: 'mifosx-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();

  /** Client Data and Template */
  clientDataAndTemplate: any;
  /** Edit Client Form */
  editClientForm: FormGroup = new FormGroup({});

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
  currentUser: any;

  /**
   * Fetches client template data from `resolve`
   * @param {FormBuilder} formBuilder Form Builder
   * @param {ActivatedRoute} route ActivatedRoute
   * @param {Router} router Router
   * @param {ClientsService} clientsService Clients Service
   * @param {DatePipe} datePipe Date Pipe
   * @param {SettingsService} settingsService Settings Service
   */
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private clientsService: ClientsService,
              private authenticationService: AuthenticationService,
              private datePipe: DatePipe,
              private settingsService: SettingsService,
              private location: Location) {
    this.route.data.subscribe((data: { clientDataAndTemplate: any }| Data) => {
      this.clientDataAndTemplate = data.clientDataAndTemplate;
      // this.clientDataAndTemplate = data.clientDataAndTemplate.result.clientTemplate;
    });
  }

  ngOnInit() {
    this.createEditClientForm();
    this.setOptions();
    this.buildDependencies();
    this.editClientForm.patchValue({
      'officeId': this.clientDataAndTemplate.officeId,
      'staffId': this.clientDataAndTemplate.staffId,
      'legalFormId': this.clientDataAndTemplate.legalForm && this.clientDataAndTemplate.legalForm.id,
      'accountNo': this.clientDataAndTemplate.accountNo,
      'externalId': this.clientDataAndTemplate.externalId,
      'genderId': this.clientDataAndTemplate.gender && this.clientDataAndTemplate.gender.id,
      'isStaff': this.clientDataAndTemplate.isStaff,
      'active': this.clientDataAndTemplate.active,
      'mobileNo': this.clientDataAndTemplate.mobileNo,
      'dateOfBirth': this.clientDataAndTemplate.dateOfBirth && new Date(this.clientDataAndTemplate.dateOfBirth),
      'clientTypeId': this.clientDataAndTemplate.clientType && this.clientDataAndTemplate.clientType.id,
      'clientClassificationId': this.clientDataAndTemplate.clientClassification && this.clientDataAndTemplate.clientClassification.id,
      'submittedOnDate': this.clientDataAndTemplate.timeline.submittedOnDate && new Date(this.clientDataAndTemplate.timeline.submittedOnDate),
      'activationDate': this.clientDataAndTemplate.timeline.activatedOnDate && new Date(this.clientDataAndTemplate.timeline.activatedOnDate)
    });
  }

  /**
   * Creates the edit client form.
   */
  createEditClientForm() {
    this.currentUser = this.authenticationService.getCredentials();
    const { permissions } = this.currentUser;
    const permit_manager = permissions.includes('ASSIGNSTAFF_CLIENT') || permissions.includes('ALL_FUNCTIONS');
    const permit_IT = permissions.includes('SYSTEM_CONFIG') ;

    this.editClientForm = this.formBuilder.group({
      'officeId': [{ value: '', disabled: !permit_IT ? true : false }],
      'staffId': [{ value: '', disabled: !permit_manager ? true : false }],
      'legalFormId': [''],
      'isStaff': [false],
      'active': [false],
      'accountNo': [{ value: '', disabled: true }],
      'externalId': [''],
      'genderId': [''],
      'mobileNo': [''],
      'dateOfBirth': [''],
      'clientTypeId': [''],
      'clientClassificationId': [''],
      'submittedOnDate': [''],
      'activationDate': ['', Validators.required]
    });
  }

  /**
   * Sets select dropdown options.
   */
  setOptions() {
    this.officeOptions = this.clientDataAndTemplate.officeOptions;
    this.staffOptions = this.clientDataAndTemplate.staffOptions;
    this.legalFormOptions = this.clientDataAndTemplate.clientLegalFormOptions;
    this.clientTypeOptions = this.clientDataAndTemplate.clientTypeOptions;
    this.clientClassificationTypeOptions = this.clientDataAndTemplate.clientClassificationOptions;
    this.businessLineOptions = this.clientDataAndTemplate.clientNonPersonMainBusinessLineOptions;
    this.constitutionOptions = this.clientDataAndTemplate.clientNonPersonConstitutionOptions;
    this.genderOptions = this.clientDataAndTemplate.genderOptions;
  }

  /**
   * Adds controls conditionally.
   */
  buildDependencies() {
    this.editClientForm.get('legalFormId')?.valueChanges.subscribe((legalFormId: any) => {
      if (legalFormId === 1) {
        this.editClientForm.removeControl('fullname');
        this.editClientForm.removeControl('clientNonPersonDetails');
        // J ean changed from "Validators.required" to "[Validators.required, Validators.pattern('^([^!@#$%^&*()+=<>,?\/]*)$')]"
        this.editClientForm.addControl('firstname', new FormControl(this.clientDataAndTemplate.firstname, [Validators.required]));
        this.editClientForm.addControl('middlename', new FormControl(this.clientDataAndTemplate.middlename,  [Validators.required]));
        this.editClientForm.addControl('lastname', new FormControl(this.clientDataAndTemplate.lastname,  [Validators.required]));

        this.editClientForm.get('firstname')?.valueChanges.subscribe( (value: string) => {
          this.editClientForm.get('firstname')?.patchValue( value.toUpperCase(), {emitEvent: false} );

        });
        this.editClientForm.get('middlename')?.valueChanges.subscribe( (value: string) => {
          this.editClientForm.get('middlename')?.patchValue( value.toUpperCase(), {emitEvent: false} );
        });
        this.editClientForm.get('lastname')?.valueChanges.subscribe( (value: string) => {
          this.editClientForm.get('lastname')?.patchValue( value.toUpperCase(), {emitEvent: false} );
        });

      } else {
        this.editClientForm.removeControl('firstname');
        this.editClientForm.removeControl('middlename');
        this.editClientForm.removeControl('lastname');
        this.editClientForm.addControl('fullname', new FormControl(this.clientDataAndTemplate.fullname, [Validators.required, Validators.pattern('^([^!@#$%^&*()+=<>,?\/]*)$')]));
        this.editClientForm.addControl('clientNonPersonDetails', this.formBuilder.group({
          'constitutionId': [this.clientDataAndTemplate.clientNonPersonDetails.constitution && this.clientDataAndTemplate.clientNonPersonDetails.constitution.id],
          'incorpValidityTillDate': [this.clientDataAndTemplate.clientNonPersonDetails.incorpValidityTillDate && new Date(this.clientDataAndTemplate.clientNonPersonDetails.incorpValidityTillDate)],
          'incorpNumber': [this.clientDataAndTemplate.clientNonPersonDetails.incorpNumber],
          'mainBusinessLineId': [this.clientDataAndTemplate.clientNonPersonDetails.mainBusinessLine && this.clientDataAndTemplate.clientNonPersonDetails.mainBusinessLine.id],
          'remarks': [this.clientDataAndTemplate.clientNonPersonDetails.remarks]
        }));

        this.editClientForm.get('fullname')?.valueChanges.subscribe( (value: string) => {
          this.editClientForm.get('fullname')?.patchValue( value.toUpperCase(), {emitEvent: false} );

        });
      }
    });
  }

  /**
   * Submits the edit client form.
   */
  submit() {
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    // TODO: Update once language and date settings are setup
    const editClientFormValue: any = this.editClientForm.getRawValue();
    const clientData = {
      ...editClientFormValue,
      dateOfBirth: editClientFormValue.dateOfBirth && this.datePipe.transform(editClientFormValue.dateOfBirth, dateFormat),
      submittedOnDate: editClientFormValue.submittedOnDate && this.datePipe.transform(editClientFormValue.submittedOnDate, dateFormat),
      activationDate: this.datePipe.transform(editClientFormValue.activationDate, dateFormat),
      dateFormat,
      locale
    };
    delete clientData.officeId;
    if (editClientFormValue.clientNonPersonDetails) {
      clientData.clientNonPersonDetails = {
        ...editClientFormValue.clientNonPersonDetails,
        incorpValidityTillDate: editClientFormValue.clientNonPersonDetails.incorpValidityTillDate && this.datePipe.transform(editClientFormValue.clientNonPersonDetails.incorpValidityTillDate, dateFormat),
        dateFormat,
        locale
      };
    } else {
      clientData.clientNonPersonDetails = {};
    }
    this.clientsService.updateClient(this.clientDataAndTemplate.id, clientData).subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  goback() {
    this.location.back();
  }

}
