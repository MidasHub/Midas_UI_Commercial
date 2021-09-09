/** Angular Imports */
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

/** rxjs Imports */
import { merge } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

/** Translation Imports */
import { TranslateService } from '@ngx-translate/core';

/** Environment Configuration */
import { environment } from 'environments/environment';

/** Custom Services */

import { I18nService } from './core/i18n/i18n.service';
import { ThemeStorageService } from './shared/theme-picker/theme-storage.service';
import { AlertService } from './core/alert/alert.service';
import { AuthenticationService } from './core/authentication/authentication.service';
import { SettingsService } from './settings/settings.service';
import { BanksService } from './banks/banks.service';

/** Custom Items */
import { Alert } from './core/alert/alert.model';
import { KeyboardShortcutsConfiguration } from './keyboards-shortcut-config';


/** Initialize Logger */
import { Logger } from './core/logger/logger.service';
const log = new Logger('Midas');

/** Device detector */
import { DeviceDetectorService } from 'ngx-device-detector';
import { TourService } from 'ngx-tour-core';
import { SwUpdate } from '@angular/service-worker';
import { AddToHomeScreenService } from './service-worker/add-to-home-screen.service';


/**
 * Main web app component.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-web-app',
  templateUrl: './web-app.component.html',
  styleUrls: ['./web-app.component.scss'],
})
export class WebAppComponent implements OnInit {
  buttonConfig?: KeyboardShortcutsConfiguration;
  deviceInfo: any;
  public lat?: String;
  public lng?: String;

  /** Show add to home screen */
  @HostListener('window:beforeinstallprompt', ['$event'])
  onEventFire(e: any) {
    this.a2hs.deferredPrompt = e;
  }

  /**
   * @param {Router} router Router for navigation.
   * @param {ActivatedRoute} activatedRoute Activated Route.
   * @param {Title} titleService Title Service.
   * @param {TranslateService} translateService Translate Service.
   * @param {I18nService} i18nService I18n Service.
   * @param {ThemeStorageService} themeStorageService Theme Storage Service.
   * @param {MatSnackBar} snackBar Material Snackbar for notifications.
   * @param {AlertService} alertService Alert Service.
   * @param {AuthenticationService} authenticationService Authentication service.
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private i18nService: I18nService,
    private themeStorageService: ThemeStorageService,
    public snackBar: MatSnackBar,
    private alertService: AlertService,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    // private messagingService: FireBaseMessagingService,
    private deviceService: DeviceDetectorService,
    private tourService: TourService,
    private update: SwUpdate,
    private a2hs: AddToHomeScreenService
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      /** START : Code to Track Page View  */
      const event_ = event as NavigationEnd;
      log.info('GA: ', event_?.urlAfterRedirects);
    });
  }


  // Variables for Firebase messsage
  // message: any;

  /**
   * Initial Setup:
   *
   * 1) Logger
   *
   * 2) Language and Translations
   *
   * 3) Page Title
   *
   * 4) Theme
   *
   * 5) Alerts
   */
  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }
    log.debug('init in Dev Env: ', environment.production);
    log.debug('path:', window.location.hostname);

    // Setup translations
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    // Change page title on navigation or language change, based on route data
    const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(`${this.translateService.instant(title)} | MIDAS`);
        }
      });

    // Stores top 100 user activites as local storage object.
    let activities: string[] = [];
    if (sessionStorage.getItem('midasLocation')) {
      const activitiesArray: string[] = JSON.parse(sessionStorage.getItem('midasLocation') || '');
      const length = activitiesArray.length;
      activities = length > 100 ? activitiesArray.slice(length - 100) : activitiesArray;
    }
    // Store route URLs array in local storage on navigation end.
    onNavigationEnd.subscribe(() => {
      activities.push(this.router.url);
      sessionStorage.setItem('midasLocation', JSON.stringify(activities));
    });

    // Setup theme
    const theme = this.themeStorageService.getTheme();
    if (theme) {
      this.themeStorageService.installTheme(theme);
    }

    // Setup alerts
    this.alertService.alertEvent.subscribe((alertEvent: Alert) => {
      this.snackBar.open(
        `${alertEvent.message}`,
        this.i18nService.getTranslate('Client_Component.ClientStepper.lblClose'),
        {
          duration: alertEvent.msgDuration ? alertEvent.msgDuration : 7000,
          horizontalPosition: alertEvent.hPosition ? alertEvent.hPosition : 'right',
          verticalPosition: alertEvent.vPosition ? alertEvent.vPosition : 'top',
          panelClass: [alertEvent.msgClass ? alertEvent.msgClass : ''] ,
        }
      );
    });
    this.buttonConfig = new KeyboardShortcutsConfiguration();

    // initialize language and date format if they are null.
    if (!localStorage.getItem('midasLanguageCode')) {
      const langCode = environment.defaultLanguage.split('-')[0];
      console.log('[WEB-APP]LangCode:', langCode, ' - name:', environment.languagesName[langCode]);

      this.settingsService.setLanguage({
        name: environment.languagesName[langCode],
        code: langCode,
      });
    }
    if (!localStorage.getItem('midasDateFormat')) {
      // this.settingsService.setDateFormat('dd MMMM yyyy');
      this.settingsService.setDateFormat('dd/MM/yyyy');
    }

    /** check if not in Production will do the following code */
    if (!environment.production) {
      if (!sessionStorage.getItem('midasServers')) {
        this.settingsService.setServers([
          'https://staging.kiotthe.app',
          'https://training.kiotthe.com',
          'https://midas.kiotthe.com',
          'https://localhost:9443',
          'https://ic.kiotthe.com',
          'https://hdcredit.kiotthe.com',
          'https://localhost:7443',
        ]);
      }

      if (!sessionStorage.getItem('midasBillposServers')) {
        this.settingsService.setBillposServers([
          'https://staging.kiotthe.app',
          'https://training.kiotthe.com',
          'https://midas.kiotthe.com',
          'https://hdcredit.kiotthe.com',
          'http://localhost:8088',
          'http://119.82.141.26:8088',
          'http://localhost:8087',
        ]);
      }
    }



    // Get client location
    this.getLocation();
    this.loadDeviceData();

    // Check update for service worker
    if (this.update.isEnabled) {
      this.update.available.subscribe(() => {
        if (confirm('New version available. Load New Version?')) {
          window.location.reload();
        }
      });
    }
    // ----- End ngOnInit
  }


  loadDeviceData() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    if (!sessionStorage.getItem('midasDevice')) {
      this.settingsService.setDeviceData(this.deviceInfo);
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos: any) => {
          if (pos) {
            log.debug('Latitude: ' + pos.coords.latitude + ' - Longitude: ' + pos.coords.longitude);
          }
        },
        (error: any) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  help() {
    window.open('https://drive.google.com/drive/folders/1-J4JQyaaxBz2QSfZMzC4bPrPwWlksFWw?usp=sharing', '_blank');
  }

  // Monitor all keyboard events and excute keyboard shortcuts
  @HostListener('window:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    const routeD = this.buttonConfig?.buttonCombinations.find(
      (x) =>
        x.ctrlKey === event.ctrlKey && x.shiftKey === event.shiftKey && x.altKey === event.altKey && x.key === event.key
    );
    if (!(routeD === undefined)) {
      switch (routeD.id) {
        case 'logout':
          this.logout();
          break;
        case 'help':
          this.help();
          break;
        case 'runReport':
          document.getElementById('runReport')?.click();
          break;
        case 'cancel':
          const cancelButtons = document.querySelectorAll('button');
          const filteredcancelButtons = Array.prototype.filter.call(cancelButtons, function (el: any) {
            return el.textContent.trim() === 'Cancel';
          });
          if (filteredcancelButtons.length > 0) {
            filteredcancelButtons[0].click();
          }
          break;
        case 'submit':
          const submitButton = document.querySelectorAll('button');
          const filteredSubmitButton = Array.prototype.filter.call(submitButton, function (el: any) {
            return el.textContent.trim() === 'Submit';
          });
          if (filteredSubmitButton.length > 0) {
            filteredSubmitButton[0].click();
          }
          break;
        default:
          this.router.navigate([routeD.route], { relativeTo: this.activatedRoute });
      }
    }
  }

  /** Scroll to Top Page for any route */
  onActivate(event: any) {
    window.scroll(0, 0);
    // or document.body.scrollTop = 0;
    // or document.querySelector('body').scrollTo(0,0)
  }

  /** End Tour */
  endTour() {
    console.log('End tour');
    this.tourService.end();
  }
}
