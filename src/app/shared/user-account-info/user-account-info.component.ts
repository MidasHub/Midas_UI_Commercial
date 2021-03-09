/** Angular Imports */
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

/** RxJS Imports */
import { forkJoin } from 'rxjs';

/** Custom Services */
import { NotificationsService } from 'app/notifications/notifications.service';
import { MidasClientService } from 'app/midas-client/midas-client.service';

/**
 * Notifications Tray Component
 */
@Component({
  selector: 'midas-user-account-info',
  templateUrl: './user-account-info.component.html',
  styleUrls: ['./user-account-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserAccountInfoComponent implements OnInit, OnDestroy {

  /** Read Notifications */
  readNotifications: any[] = [];
  /** Displayed Read Notifications */
  displayedReadNotifications: any[] = [];
  /** Unread Notifications */
  unreadNotifications: any[] = [];
  /** Timer to refetch notifications every 60 seconds */
  timer: any;
  listSaving: [];
  totalBalance: number;
  private credentialsStorageKey = 'midasCredentials';
  private storage: any;

  /**
   * @param {NotificationsService} notificationsService Notifications Service
   */
  constructor(public midasClientService: MidasClientService) {
    this.listSaving = [];
    this.totalBalance = 0;
    this.midasClientService.getInfoSavingAccountByUserId()
    .subscribe((response: any) => {

      this.listSaving = response.result.listSaving ;
      this.totalBalance = response.result.totalBalance ;

    });
  }

  ngOnInit() {
    setTimeout(() => { this.fetchSavingAccountOfUser(); }, 60000);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  /**
   * Restructures displayed read notifications vis-a-vis unread notifications.
   */
  setTotalBalance() {
    const length = this.unreadNotifications.length;
    this.displayedReadNotifications = length < 9 ? this.readNotifications.slice(0, 9 - length) : [];
  }

  /**
   * Recursively fetch unread notifications.
   */
  fetchSavingAccountOfUser() {
    this.midasClientService.getInfoSavingAccountByUserId()
    .subscribe((response: any) => {

      this.listSaving = response.result.listSavingAccount ;
      this.totalBalance = response.result.totalBalance ;

    });

    this.timer = setTimeout(() => { this.fetchSavingAccountOfUser(); }, 60000);
  }

  /**
   * Update read/unread notifications.
   */
  menuClosed() {
    // Update the server for read notifications.
    // this.notificationsService.updateNotifications().subscribe(() => {});
    // Update locally for read notifications.
    this.readNotifications = this.unreadNotifications.concat(this.readNotifications);
    this.unreadNotifications = [];
    this.setTotalBalance();
  }



}
