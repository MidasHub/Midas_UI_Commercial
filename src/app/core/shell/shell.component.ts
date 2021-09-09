/** Angular Imports */
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

/** rxjs Imports */
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { ProgressBarService } from '../progress-bar/progress-bar.service';
import { TourService } from 'ngx-tour-md-menu';
import { DeviceDto } from './devicedto';
import { AlertService } from '../alert/alert.service';
import { SwPush } from '@angular/service-worker';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../authentication/credentials.model';

/**
 * Shell component.
 */
@Component({
  selector: 'midas-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  isDesktop?: Boolean;
  /** Subscription to breakpoint observer for handset. */
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));
  _isHandset = false;
  /** Sets the initial state of sidenav as collapsed. Not collapsed if false. */
  sidenavCollapsed = true;
  /** Progress bar mode. */
  progressBarMode: any;
  /** Subscription to progress bar. */
  progressBar$!: Subscription;

  /** Variable for Notification Push Api */
  private device: DeviceDto = new DeviceDto();
  public subscription$ = this.swPush.subscription;
  public isEnabled = this.swPush.isEnabled;
  private VAPID_PUBLIC_KEY = '';
  private credential: Credentials ;

  /**
   * @param {BreakpointObserver} breakpointObserver Breakpoint Observer to detect screen size.
   * @param {ProgressBarService} progressBarService Progress Bar Service.
   * @param {ChangeDetectorRef} cdr Change Detector Ref.
   * @param tourService
   */
  constructor(
    private breakpointObserver: BreakpointObserver,
    private progressBarService: ProgressBarService,
    private cdr: ChangeDetectorRef,
    private tourService: TourService,
    private swPush: SwPush,
    private alertService: AlertService,
    private http: HttpClient
    // private detectDevice: DeviceDetectorService
  ) {
    // this.isDesktop = this.detectDevice.isDesktop();
    this.credential = JSON.parse(localStorage.getItem('Credentials') || sessionStorage.getItem('Credentials') ||'{}');
    /**
     * log info about SW
     * and use SW to listen to push message
     */
     console.log('SW in navigator: ', 'serviceWorker' in navigator);
     console.log('SwPush is Enable:: ', this.swPush.isEnabled);
     this.swPush.messages.subscribe((msg) => this.handlePushMessage(msg));
     this.swPush.notificationClicks.subscribe((options) =>
       this.handlePushNotificationClick(options)
     );
  }

  /**
   * Subscribes to progress bar to update its mode.
   */
  ngOnInit() {
    /** Start Push API */
    if (this.credential) {

      this.http
        .disableApiPrefix()
        .get(environment.NotiGatewayURL + '/publicSigningKeyBase64')
        .subscribe(
          (res: any) => {
            if (res.result) {
              this.VAPID_PUBLIC_KEY = res.result;
            }
            console.log('deviceID:', navigator.mediaDevices.getSupportedConstraints.toString());
          },
          (e) => console.log('error: ', e),
          () => this.requestPermission()
        );
      }

    this.progressBar$ = this.progressBarService.updateProgressBar.subscribe((mode: string) => {
      this.progressBarMode = mode;
      this.cdr.detectChanges();
    });

    this.isHandset$.subscribe(value => this._isHandset = value );
    /** Tour guide */
    if (!localStorage.getItem('MidasTour') && this.isDesktop) {
      this.tourService.initialize(
        [
          {
            anchorId: 'toolbar-1',
            content: ' Đây là phần hướng dẫn sử dụng hệ thống Midas. Bạn có thể bỏ qua bằng cách bấm nút "Kết thúc" ',
            title: 'CHÀO MỪNG BẠN ĐÃ ĐẾN VỚI HỆ THỐNG MIDAS!',
          },
          {
            anchorId: 'toolbar-2-1',
            content:
              'Nút này dùng để truy cập vào màn hình quản lý thông tin của khách hàng, đại lý và nhân viên nội bộ.',
            title: 'NÚT "THÔNG TIN KHÁCH HÀNG/ ĐẠI LÝ/ NHÂN VIÊN"',
          },
          {
            anchorId: 'toolbar-2-2',
            content:
              'Nút này dùng xem danh sách các khoản phải thu/ phỉ chi của khách hàng và đại lý và danh sách tài khoản của nhân viên nội bộ',
            title: 'NÚT "DANH SÁCH TÀI KHOẢN "',
          },

          {
            anchorId: 'toolbar-2-3',
            content:
              'Nút này dùng xem danh sách các đã được thực hiện, các giao dịch Advance, giao dịch thu/chi cho các giao dịch và danh sách booking của đại lý',
            title: 'NÚT "DANH SÁCH GIAO DỊCH "',
          },

          {
            anchorId: 'toolbar-2-4',
            content: 'Nút này dùng để booking tiền quỹ, quản lý booking tiền quỹ',
            title: 'NÚT "BOOKING TỀN QUỸ "',
          },
          {
            anchorId: 'toolbar-2-5',
            content: 'Nút này dùng để xem danh sách các máy bán hàng có thể sử dụng và hạn mức còn lại của nó',
            title: 'NÚT "HẠN MỨC máy bán hàng "',
          },
          {
            anchorId: 'toolbar-3',
            content: 'Đây là nút để show các thông báo của hệ thống',
            title: 'NÚT "THÔNG BÁO"',
          },
          {
            anchorId: 'toolbar-4',
            content: 'Đây là nút để show menu quản lý người dùng như đổi password ...',
            title: 'NÚT "PROFILE NGƯỜI DÙNG"',
          },
          {
            anchorId: 'toolbar-5',
            content: 'Đây là nút để show số dư tại các tài khoản của bạn',
            title: 'NÚT "THÔNG TIN TÀI KHOẢN"',
          },
          {
            anchorId: 'id4',
            content: 'Đây là khu vực màn hình chính. Dùng để thực hiện các công việc hằng ngày của bạn',
            title: 'MÀN HÌNH THAO TÁC CHÍNH',
            route: '/home',
          },
          {
            anchorId: 'id5',
            content: 'Đây là khu vực thông tin banner của đơn vị và các nút Quick Action.',
            title: 'KHU VỰC: BANNER CỦA ĐƠN VỊ',
            route: '/home',
          },
          {
            anchorId: 'id6',
            content:
              'Đây là khu vực tim kiếm thông tin khách hàng/ thẻ của khách hàng / CMND ... để bắt đầu thực hiện "giao dịch lẻ".',
            title: 'FIELD: TÌM KHÁCH HÀNG',
            route: '/home',
          },
          {
            anchorId: 'id7',
            content: 'Trên lịch làm việc này sẽ show lịch đến hạn các thẻ do bạn quản lý, công việc hằng ngày của bạn.',
            title: 'LỊCH LÀM VIỆC',
            route: '/home',
          },
        ],
        { preventScrolling: true, enableBackdrop: true, endBtnTitle: 'Kết thúc' }
      );

      this.tourService.end$.subscribe(() => {
        localStorage.setItem('MidasTour', 'true');
        this.tourService.end$.unsubscribe();
      });

      this.tourService.start();
    }
  }

  /**
   * Toggles the current collapsed state of sidenav according to the emitted event.
   * @param $event
   */
  toggleCollapse($event: boolean) {
    this.sidenavCollapsed = $event;
    this.cdr.detectChanges();
  }

  /**
   * Unsubscribes from progress bar.
   */
  ngOnDestroy() {
    this.progressBar$.unsubscribe();
  }

  /** sw Message Push function */
  handlePushNotificationClick(options: {
    action: string;
    notification: NotificationOptions & { title: string };
  }): void {
    switch (options.action) {
      case 'open': {
        // this.router.navigate(['notes', notification.data.noteID, { queryParams: { pushNotification: true } }]);
        this.alertService.alert({ type: ' Thông báo ', message: 'open' });
        break;
      }
      case 'cancel': {
        this.alertService.alert({ type: ' Thông báo ', message: 'cancel' });
        break;
      }
      default: {
        // this.router.navigate(['notes', notification.data.noteID, { queryParams: { pushNotification: true } }]);
        this.alertService.alert({ type: ' Thông báo ', message: 'default' });
        break;
      }
    }
  }

  handlePushMessage({ notification }: any): void {
    console.log(notification);
    this.alertService.alert({
      type: `Push notification title: ${notification.title}`,
      message: `Message: ${notification.body}`,
    });
  }

  async requestPermission() {
    console.log('Request starting...');
    console.log('Request Key: ', this.VAPID_PUBLIC_KEY);

    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      });
      // TODO: Send to server.

      // const subJSON = sub.toJSON();

      this.device.username = this.credential.username;
      this.device.officeName = this.credential.officeName;
      this.device.subscription = sub.toJSON();
      const subJSON = JSON.parse(JSON.stringify(this.device));

      // if (subJSON.expirationTime === undefined) {
      //   subJSON.expirationTime = null;
      // }
      console.log('subJson', subJSON);
      await this.http
        .post(environment.NotiGatewayURL + '/deviceSubscribe', subJSON)
        .subscribe((res) => console.log('subscribe result:', res));
      return this.alertService.alert({
        type: 'Notification',
        message: 'You are subscribed now!',
      });
    } catch (err) {
      console.error('Could not subscribe due to:', err);
      this.alertService.alert({
        type: 'Notification',
        message: 'Subscription fail',
      });
    }
  }
  requestUnsubscribe() {
    this.swPush
      .unsubscribe()
      .then(() => {
        this.alertService.alert({
          type: 'Thông báo',
          message: 'You are unsubscribed',
        });
      })
      .catch((e) => {
        console.error(e);
        this.alertService.alert({
          type: 'Thông báo',
          message: 'unsubscribe failed',
        });
      });
  }
}
