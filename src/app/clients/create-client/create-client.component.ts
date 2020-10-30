/** Angular Imports */
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
/** Custom Services */
import { ClientsService } from '../clients.service';
// import { map } from 'rxjs/operators';
/** Custom Components */
import { ClientGeneralStepComponent } from '../client-stepper/client-general-step/client-general-step.component';
import { ClientFamilyMembersStepComponent } from '../client-stepper/client-family-members-step/client-family-members-step.component';
import { ClientAddressStepComponent } from '../client-stepper/client-address-step/client-address-step.component';

/** Custom Services */
import { SettingsService } from 'app/settings/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I18nService } from 'app/core/i18n/i18n.service';


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
  @ViewChild(ClientGeneralStepComponent, { static: true }) clientGeneralStep: ClientGeneralStepComponent;
  /** Client Family Members Step */
  @ViewChild(ClientFamilyMembersStepComponent, { static: true }) clientFamilyMembersStep: ClientFamilyMembersStepComponent;
  /** Client Address Step */
  @ViewChild(ClientAddressStepComponent, { static: true }) clientAddressStep: ClientAddressStepComponent;

  /** Client Template */
  clientTemplate: any;
  /** Client Address Field Config */
  clientAddressFieldConfig: any;

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
              private http: HttpClient,
              private snackbar: MatSnackBar,
              private i18n: I18nService
              ) {
    this.route.data.subscribe((data: { clientTemplate: any, clientAddressFieldConfig: any }) => {
      this.clientTemplate = data.clientTemplate;
      this.clientAddressFieldConfig = data.clientAddressFieldConfig;
    });
  }

  /**
   * Retrieves general information about client.
   */
  get clientGeneralForm() {

    return this.clientGeneralStep.createClientForm;
  }

  ngOnInit() {
    this.clientsService.getClientTest(5, 50000000).subscribe( (data: any) => {
      console.log(data);
  })
}

  /**
   * Retrieves the client object
   */
  get client() {

    return {
      ...this.clientGeneralStep.clientGeneralDetails,
      ...this.clientFamilyMembersStep.familyMembers,
      ...this.clientAddressStep.address
    };
  }
  /**
   * Submits the create client form.
   */
  submit() {
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    // TODO: Update once language and date settings are setup
    const clientData = {
      ...this.client,
      dateFormat,
      locale
    };
    this.clientsService.createClient(clientData).subscribe((response: any) => {
      //Jean customized here
      if (this.router.url.indexOf('client')>=0) {
        this.router.navigate(['../', response.resourceId], { relativeTo: this.route });
      }else{
        
        this.snackbar.open( this.i18n.getTranslate('Client_Component.ClientStepper.lblCustomerCreated')+ response.resourceId  + "!",this.i18n.getTranslate('Client_Component.ClientStepper.lblClose'), {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/home']);
      }
      
    });
  }

}
