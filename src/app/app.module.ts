/** Angular Imports */
import {NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HttpClient} from '@angular/common/http'; //Jean
import {ServiceWorkerModule} from '@angular/service-worker';

/** Tanslation Imports */
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/** Environment Configuration */
import {environment} from 'environments/environment';

/** Main Component */
import {WebAppComponent} from './web-app.component';

/** Not Found Component */
import {NotFoundComponent} from './not-found/not-found.component';

/** Custom Modules */
import {CoreModule} from './core/core.module';
import {HomeModule} from './home/home.module';
import {LoginModule} from './login/login.module';
import {SettingsModule} from './settings/settings.module';
import {NavigationModule} from './navigation/navigation.module';
import {ClientsModule} from './clients/clients.module';
import {GroupsModule} from './groups/groups.module';
import {CentersModule} from './centers/centers.module';
import {AccountingModule} from './accounting/accounting.module';
import {SelfServiceModule} from './self-service/self-service.module';
import {SystemModule} from './system/system.module';
import {ProductsModule} from './products/products.module';
import {OrganizationModule} from './organization/organization.module';
import {TemplatesModule} from './templates/templates.module';
import {UsersModule} from './users/users.module';
import {ReportsModule} from './reports/reports.module';
import {SearchModule} from './search/search.module';
import {NotificationsModule} from './notifications/notifications.module';
import {CollectionsModule} from './collections/collections.module';
import {ProfileModule} from './profile/profile.module';
import {TasksModule} from './tasks/tasks.module';

/** Main Routing Module */
import {AppRoutingModule} from './app-routing.module';

/** Billpos Module */
import { TerminalsModule } from './terminals/terminals.module';
import {MidasClientModule} from './midas-client/midas-client.module';
import { TransactionModule } from './transactions/transaction.module';
import { ThirdPartyModule } from './third-party/third-party.module';
import { BookingManageModule } from './booking-manage/booking-manage.module';
import { BillsManageModule } from './bills-manage/bills-manage.module';
import {MarketingModule} from './marketing/marketing.module';
import {BanksModule} from './banks/banks.module';
import { CommonHttpParams } from './shared/CommonHttpParams';

/**
 * Import Vietnamese locale for built-in pipe like DatePipe, CurrencyPipe...
 */
 import { registerLocaleData } from '@angular/common';
 import localeVi from '@angular/common/locales/vi';
import { LOCALE_ID } from '@angular/core';
 
 registerLocaleData(localeVi, 'vi');


/**
 * App Module
 *
 * Core module and all feature modules should be imported here in proper order.
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    HttpClientModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {enabled: environment.production}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true,
    }),

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
    AppRoutingModule],
  declarations: [WebAppComponent, NotFoundComponent],
  providers: [CommonHttpParams,
    {
      provide: LOCALE_ID,
      useValue: 'vi'
    },
  ],
  bootstrap: [WebAppComponent]
})
export class AppModule { }
