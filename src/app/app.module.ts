/** Angular Imports */
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';


/** Environment Configuration */
import { environment } from 'environments/environment';

/** Main Component */
import { WebAppComponent } from './web-app.component';

/** Not Found Component */
import { NotFoundComponent } from './not-found/not-found.component';

/** Custom Modules */
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { SettingsModule } from './settings/settings.module';
import { NavigationModule } from './navigation/navigation.module';
import { ClientsModule } from './clients/clients.module';
import { GroupsModule } from './groups/groups.module';
import { CentersModule } from './centers/centers.module';
import { AccountingModule } from './accounting/accounting.module';
import { SelfServiceModule } from './self-service/self-service.module';
import { SystemModule } from './system/system.module';
import { ProductsModule } from './products/products.module';
import { OrganizationModule } from './organization/organization.module';
import { TemplatesModule } from './templates/templates.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { SearchModule } from './search/search.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CollectionsModule } from './collections/collections.module';
import { ProfileModule } from './profile/profile.module';
import { TasksModule } from './tasks/tasks.module';

/** Main Routing Module */
import { AppRoutingModule } from './app-routing.module';

/** Billpos Module */
import { TerminalsModule } from './terminals/terminals.module';
import { MidasClientModule } from './midas-client/midas-client.module';
import { TransactionModule } from './transactions/transaction.module';
import { ThirdPartyModule } from './third-party/third-party.module';
import { BookingManageModule } from './booking-manage/booking-manage.module';
import { BillsManageModule } from './bills-manage/bills-manage.module';
import { MarketingModule } from './marketing/marketing.module';
import { BanksModule } from './banks/banks.module';
import { CardTransferModule } from './card-transfer/card-transfer.module';
import { CommonHttpParams } from './shared/CommonHttpParams';

/**
 * Import Vietnamese locale for built-in pipe like DatePipe, CurrencyPipe...
 * and import the Translate Module (@ngx-translate)
 */
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';

registerLocaleData(localeVi, 'vi');
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Gooogle Firebase
 */

// import { AngularFireMessagingModule } from '@angular/fire/messaging';
// import { AngularFireDatabaseModule } from '@angular/fire/database';
// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { AngularFireModule } from '@angular/fire';
// import { FireBaseMessagingService } from './firebase/fire-base-messaging.service';
import { AsyncPipe } from '@angular/common';

/** Tour guide for self study */
import { TourMatMenuModule } from 'ngx-tour-md-menu';

/** Google Analytics  */
// import { GoogleAnalyticsService } from './firebase/google-analytics.service';



/**
 * App Module
 *
 * Core module and all feature modules should be imported here in proper order.
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    TranslateModule.forRoot({
      defaultLanguage: 'vi-VN',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),
    TourMatMenuModule.forRoot(),
    // AngularFireDatabaseModule,
    // AngularFireAuthModule,
    // AngularFireMessagingModule,
    // AngularFireModule.initializeApp(environment.firebase),
    CoreModule,
    HomeModule,
    LoginModule,
    ProfileModule,
    SettingsModule,
    NavigationModule,
    ClientsModule,
    ReportsModule,
    GroupsModule,
    CentersModule,
    AccountingModule,
    SelfServiceModule,
    SystemModule,
    ProductsModule,
    OrganizationModule,
    TemplatesModule,
    UsersModule,
    NotificationsModule,
    SearchModule,
    CollectionsModule,
    TasksModule,
    TransactionModule,
    MidasClientModule,
    TerminalsModule,
    ThirdPartyModule,
    BookingManageModule,
    BillsManageModule,
    MarketingModule,
    BanksModule,
    CardTransferModule,
    AppRoutingModule,
  ],
  declarations: [WebAppComponent, NotFoundComponent],
  providers: [
    CommonHttpParams,
    {
      provide: LOCALE_ID,
      useValue: 'vi',
    },
    // FireBaseMessagingService,
    // GoogleAnalyticsService,
    AsyncPipe,
  ],
  bootstrap: [WebAppComponent],
})
export class AppModule {}
