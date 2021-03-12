/** Angular Imports */
import { DatePipe } from '@angular/common';
import {Component, Output, EventEmitter, Input} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from 'app/settings/settings.service';

/**
 * Client Preview Step Component
 */
@Component({
  selector: 'mifosx-client-preview-step',
  templateUrl: './client-preview-step.component.html',
  styleUrls: ['./client-preview-step.component.scss']
})
export class ClientPreviewStepComponent {

  /** Client Address field configuration */
  @Input() clientAddressFieldConfig: any;
  /** Client Template */
  @Input() clientTemplate: any;
  /** Client Object */
  @Input() client: any;
  @Input() documents: any;
  familyMemberForm: any;
  /** Historical page from URL */
  @Input() go_back: any;

  /** Form submission event */
  @Output() submit = new EventEmitter();

  constructor( private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private settingsService: SettingsService) {
    this.submit.subscribe(function (e: any) {
    }, function (error: any) {
    }, function (success: any) {
    });
  }


  /**
   * Utilized in address preview.
   * Find pipe doesn't work with accordian.
   * @param {any} fieldName Field Name
   * @param {any} fieldId Field Id
   */
  getSelectedValue(fieldName: any, fieldId: any) {
    return (this.clientTemplate.address[0][fieldName].find((fieldObj: any) => fieldObj.id === fieldId));
  }

  /**
   * Utilized in address preview to check if field is enabled in configuration.
   * @param {any} fieldName Field Name
   */
  isFieldEnabled(fieldName: any) {
    return (this.clientAddressFieldConfig.find((fieldObj: any) => fieldObj.field === fieldName))?.isEnabled;
  }

  onSubmit(event: any) {
    const data = {...this.client};

    delete data.files;
    this.submit.emit();
    return;
  }

  clickCancel(){
    console.log (this.go_back)
  }
}
