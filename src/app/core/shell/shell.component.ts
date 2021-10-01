/** Angular Imports */
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

/** rxjs Imports */
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";

/** Custom Services */
import { ProgressBarService } from "../progress-bar/progress-bar.service";
import { TourService } from "ngx-tour-md-menu";
import { DeviceDetectorService } from "ngx-device-detector";

/**
 * Shell component.
 */
@Component({
  selector: "midas-shell",
  templateUrl: "./shell.component.html",
  styleUrls: ["./shell.component.scss"],
})
export class ShellComponent implements OnInit, OnDestroy {
  isDesktop: Boolean;
  /** Subscription to breakpoint observer for handset. */
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));
  /** Sets the initial state of sidenav as collapsed. Not collapsed if false. */
  sidenavCollapsed = true;
  /** Progress bar mode. */
  progressBarMode: string;
  /** Subscription to progress bar. */
  progressBar$: Subscription;

  /**
   * @param {BreakpointObserver} breakpointObserver Breakpoint Observer to detect screen size.
   * @param {ProgressBarService} progressBarService Progress Bar Service.
   * @param {ChangeDetectorRef} cdr Change Detector Ref.
   */
  constructor(
    private breakpointObserver: BreakpointObserver,
    private progressBarService: ProgressBarService,
    private cdr: ChangeDetectorRef,
    private tourService: TourService,
    private detectDevice: DeviceDetectorService
  ) {
    this.isDesktop = this.detectDevice.isDesktop();
  }

  /**
   * Subscribes to progress bar to update its mode.
   */
  ngOnInit() {
    this.progressBar$ = this.progressBarService.updateProgressBar.subscribe((mode: string) => {
      this.progressBarMode = mode;
      this.cdr.detectChanges();
    });
    /**Tour guide */
    if (!localStorage.getItem("MidasTour") && this.isDesktop) {
      this.tourService.initialize(
        [
          {
            anchorId: "toolbar-1",
            content: ' Đây là phần hướng dẫn sử dụng hệ thống Midas. Bạn có thể bỏ qua bằng cách bấm nút "Kết thúc" ',
            title: "CHÀO MỪNG BẠN ĐÃ ĐẾN VỚI HỆ THỐNG MIDAS!",
          },
          {
            anchorId: "toolbar-2-1",
            content:
              "Nút này dùng để truy cập vào màn hình quản lý thông tin của khách hàng, đại lý và nhân viên nội bộ.",
            title: 'NÚT "THÔNG TIN KHÁCH HÀNG/ ĐẠI LÝ/ NHÂN VIÊN"',
          },
          {
            anchorId: "toolbar-2-2",
            content:
              "Nút này dùng xem danh sách các khoản phải thu/ phỉ chi của khách hàng và đại lý và danh sách tài khoản của nhân viên nội bộ",
            title: 'NÚT "DANH SÁCH TÀI KHOẢN "',
          },

          {
            anchorId: "toolbar-2-3",
            content:
              "Nút này dùng xem danh sách các đã được thực hiện, các giao dịch Advance, giao dịch thu/chi cho các giao dịch và danh sách booking của đại lý",
            title: 'NÚT "DANH SÁCH GIAO DỊCH "',
          },

          {
            anchorId: "toolbar-2-4",
            content: "Nút này dùng để booking tiền quỹ, quản lý booking tiền quỹ",
            title: 'NÚT "BOOKING TỀN QUỸ "',
          },
          {
            anchorId: "toolbar-2-5",
            content: "Nút này dùng để xem danh sách các máy bán hàng có thể sử dụng và hạn mức còn lại của nó",
            title: 'NÚT "HẠN MỨC máy bán hàng "',
          },
          {
            anchorId: "toolbar-3",
            content: "Đây là nút để show các thông báo của hệ thống",
            title: 'NÚT "THÔNG BÁO"',
          },
          {
            anchorId: "toolbar-4",
            content: "Đây là nút để show menu quản lý người dùng như đổi password ...",
            title: 'NÚT "PROFILE NGƯỜI DÙNG"',
          },
          {
            anchorId: "toolbar-5",
            content: "Đây là nút để show số dư tại các tài khoản của bạn",
            title: 'NÚT "THÔNG TIN TÀI KHOẢN"',
          },
          {
            anchorId: "id4",
            content: "Đây là khu vực màn hình chính. Dùng để thực hiện các công việc hằng ngày của bạn",
            title: "MÀN HÌNH THAO TÁC CHÍNH",
            route: "/home",
          },
          {
            anchorId: "id5",
            content: "Đây là khu vực thông tin banner của đơn vị và các nút Quick Action.",
            title: "KHU VỰC: BANNER CỦA ĐƠN VỊ",
            route: "/home",
          },
          {
            anchorId: "id6",
            content:
              'Đây là khu vực tim kiếm thông tin khách hàng/ thẻ của khách hàng / CMND ... để bắt đầu thực hiện "giao dịch lẻ".',
            title: "FIELD: TÌM KHÁCH HÀNG",
            route: "/home",
          },
          {
            anchorId: "id7",
            content: "Trên lịch làm việc này sẽ show lịch đến hạn các thẻ do bạn quản lý, công việc hằng ngày của bạn.",
            title: "LỊCH LÀM VIỆC",
            route: "/home",
          },
        ],
        { preventScrolling: true, enableBackdrop: true, endBtnTitle: "Kết thúc" }
      );

      this.tourService.end$.subscribe((p) => {
        localStorage.setItem("MidasTour", "true");
        this.tourService.end$.unsubscribe();
      });

      this.tourService.start();
    }
  }

  /**
   * Toggles the current collapsed state of sidenav according to the emitted event.
   * @param {boolean} event denotes state of sidenav
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
}
