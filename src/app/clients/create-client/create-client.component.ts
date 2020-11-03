/** Angular Imports */
import {Component, Input, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

/** Custom Services */
import {ClientsService} from '../clients.service';

/** Custom Components */
import {ClientGeneralStepComponent} from '../client-stepper/client-general-step/client-general-step.component';
import {ClientFamilyMembersStepComponent} from '../client-stepper/client-family-members-step/client-family-members-step.component';
import {ClientAddressStepComponent} from '../client-stepper/client-address-step/client-address-step.component';

/** Custom Services */
import {SettingsService} from 'app/settings/settings.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {I18nService} from 'app/core/i18n/i18n.service';
import * as _ from 'lodash';


/**
 * Create Client Component.
 */
@Component({
  selector: 'mifosx-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent {

  /** Client General Step */
  @ViewChild(ClientGeneralStepComponent, {static: true}) clientGeneralStep: ClientGeneralStepComponent;
  /** Client Family Members Step */
  @ViewChild(ClientFamilyMembersStepComponent, {static: true}) clientFamilyMembersStep: ClientFamilyMembersStepComponent;
  /** Client Address Step */
  @ViewChild(ClientAddressStepComponent, {static: true}) clientAddressStep: ClientAddressStepComponent;

  go_back: any;
  /** Client Template */
  clientTemplate: any;
  /** Client Address Field Config */
  clientAddressFieldConfig: any;
  clientIdentifierTemplate: any;

  /**
   * Fetches client and address template from `resolve`
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {ClientsService} clientsService Clients Service
   * @param {SettingsService} settingsService Setting service
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private clientsService: ClientsService,
              private settingsService: SettingsService,
              private snackbar: MatSnackBar,
              private i18n: I18nService,) {
    this.route.data.subscribe((data: { clientTemplate: any, clientAddressFieldConfig: any, clientIdentifierTemplate: any, currentUser: any }) => {
      this.clientTemplate = data.clientTemplate;
      this.clientAddressFieldConfig = data.clientAddressFieldConfig;
      this.clientIdentifierTemplate = data.clientIdentifierTemplate;
    });
    this.route.queryParams.subscribe(params => {
        console.log(params); // { order: "popular" }
        const {go_back} = params;
        if (go_back) {
          this.go_back = go_back;
        }
      }
    );
  }

  /**
   * Retrieves general information about client.
   */
  get clientGeneralForm() {
    return this.clientGeneralStep.createClientForm;
  }

  /**
   * Retrieves the client object
   */
  get client() {
    return {
      ...this.clientGeneralStep.clientGeneralDetails,
      ...this.clientFamilyMembersStep.familyMembers,
      ...this.clientGeneralStep.files,
      ...this.clientAddressStep.address
    };
  }


  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const width = image.width;
        const height = image.height;

        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
        }

        let newWidth;
        let newHeight;

        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const context = canvas.getContext('2d');

        context.drawImage(image, 0, 0, newWidth, newHeight);

        canvas.toBlob((b => {
          return resolve(<File>b);
        }), file.type);
      };
      image.onerror = reject;
    });
  }

  /**
   * Submits the create client form.
   */
  submit() {
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    // TODO: Update once language and date settings are setup
    const data = this.client;
    delete data.documentTypeId;
    delete data.files;
    if (_.isEmpty(data.address)) {
      alert('Vui lòng nhập ít nhất một địa chỉ');
      return;
    }
    if (_.isEmpty(this.client.files) || this.client.files.length !== 2) {
      alert('Vui lòng chọn hình ảnh trước khi upload, không quá 2 hình');
      return;
    }
    const clientData = {
      ...data,
      dateFormat,
      locale
    };
    this.clientsService.createClient(clientData).subscribe(async (response: any) => {
      if (response && response.clientId) {
        const identities_value = {
          'documentTypeId': this.client.documentTypeId,
          'documentKey': this.client.externalId,
          'description': this.client.documentTypeId,
          status: 'Active'
        };
        this.clientsService.addClientIdentifier(response.clientId, identities_value).subscribe(async (res: any) => {
          const {resourceId} = res;
          for (const file of this.client.files) {
            const item = await this.resizeImage(file, 500, 600);
            const formData: FormData = new FormData;
            formData.append('name', file.name);
            formData.append('file', item);
            formData.append('fileName', file.name);
            this.clientsService.uploadClientIdentifierDocument(resourceId, formData).subscribe((ssss: any) => {
              console.log('document Uploaded', ssss);
            });
          }
          if (this.go_back === 'home') {
            this.snackbar.open(this.i18n.getTranslate('Client_Component.ClientStepper.lblCustomerCreated') + response.resourceId + '!', this.i18n.getTranslate('Client_Component.ClientStepper.lblClose'), {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['../', response.resourceId], {relativeTo: this.route});
          }
        });


      }
    });
  }

}
