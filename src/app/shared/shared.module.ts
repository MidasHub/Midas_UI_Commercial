/** Angular Imports */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

/** Custom Components */
import {FormfieldComponent} from './form-dialog/formfield/formfield.component';
import {FormDialogComponent} from './form-dialog/form-dialog.component';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {CancelDialogComponent} from './cancel-dialog/cancel-dialog.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {FooterComponent} from './footer/footer.component';
import {LanguageSelectorComponent} from './language-selector/language-selector.component';
import {ThemePickerComponent} from './theme-picker/theme-picker.component';
import {ChangePasswordDialogComponent} from './change-password-dialog/change-password-dialog.component';
import {EnableDialogComponent} from './enable-dialog/enable-dialog.component';
import {DisableDialogComponent} from './disable-dialog/disable-dialog.component';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {ErrorDialogComponent} from './error-dialog/error-dialog.component';
import {NotificationsTrayComponent} from './notifications-tray/notifications-tray.component';
import {SearchToolComponent} from './search-tool/search-tool.component';
import {KeyboardShortcutsDialogComponent} from './keyboard-shortcuts-dialog/keyboard-shortcuts-dialog.component';
import {MatSelectSearchComponent} from './mat-select-search/mat-select-search.component';
import { ServerSelectorComponent } from './server-selector/server-selector.component';
import {BillposSelectorComponent} from './billpos-selector/billpos-selector.component';

/** Custom Modules */
import {IconsModule} from './icons.module';
import {MaterialModule} from './material.module';

/** Jean: language */
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import {CurrencyMaskInputMode, NgxCurrencyModule} from 'ngx-currency';
import {PipesModule} from '../pipes/pipes.module';
import {DirectivesModule} from '../directives/directives.module';
import { UserAccountInfoComponent } from './user-account-info/user-account-info.component';
import { MainboardComponent } from 'app/home/mainboard/mainboard.component';
import { RouterModule } from '@angular/router';
import { EcoFabSpeedDialModule} from '@ecodev/fab-speed-dial';
import { TourMatMenuModule } from 'ngx-tour-md-menu';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  allowZero: true,
  decimal: '.',
  precision: 0,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: true,
  // min: 0,
  // max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

/**
 * Shared Module
 *
 * Modules and components that are shared throughout the application should be here.
 */
@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NgxMaskModule.forRoot(maskConfig),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    DirectivesModule,
    PipesModule,
    EcoFabSpeedDialModule,
    TourMatMenuModule,
  ],
  declarations: [
    FormfieldComponent,
    FormDialogComponent,
    DeleteDialogComponent,
    CancelDialogComponent,
    FileUploadComponent,
    FooterComponent,
    LanguageSelectorComponent,
    ThemePickerComponent,
    ChangePasswordDialogComponent,
    EnableDialogComponent,
    DisableDialogComponent,
    ConfirmationDialogComponent,
    KeyboardShortcutsDialogComponent,
    ErrorDialogComponent,
    NotificationsTrayComponent,
    SearchToolComponent,
    ServerSelectorComponent,
    BillposSelectorComponent,
    UserAccountInfoComponent,
    MainboardComponent,
    MatSelectSearchComponent
  ],
  exports: [
    FileUploadComponent,
    FooterComponent,
    LanguageSelectorComponent,
    ServerSelectorComponent,
    BillposSelectorComponent,
    ThemePickerComponent,
    NotificationsTrayComponent,
    UserAccountInfoComponent,
    SearchToolComponent,
    ErrorDialogComponent,
    // MatSelectSearchComponent,
    MainboardComponent,
    CommonModule,
    IconsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxMaskModule,
    NgxCurrencyModule,
    DirectivesModule,
    PipesModule,
    EcoFabSpeedDialModule,
    TourMatMenuModule
  ]
})
export class SharedModule {
}
