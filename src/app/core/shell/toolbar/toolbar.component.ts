/** Angular Imports */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { AuthenticationService } from '../../authentication/authentication.service';

/** Device detect */

import { DeviceDetectorService } from 'ngx-device-detector'
import {environment} from 'environments/environment'
import { split } from 'lodash';

/**
 * Toolbar component.
 */
@Component({
  selector: 'midas-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  /** Subscription to breakpoint observer for handset. */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  /** Sets the initial state of sidenav as collapsed. Not collapsed if false. */
  sidenavCollapsed = true;
  currentUser: any = {};
  userFullname:string;

  isDesktop: boolean;
  isCommercial:boolean = environment.isCommercial;

  /** Instance of sidenav. */
  @Input() sidenav: MatSidenav;
  /** Sidenav collapse event. */
  @Output() collapse = new EventEmitter<boolean>();

  /**
   * @param {BreakpointObserver} breakpointObserver Breakpoint observer to detect screen size.
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication service.
   */
  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private detectDevice: DeviceDetectorService) {
    this.isDesktop = this.detectDevice.isDesktop()
  }

  /**
   * Subscribes to breakpoint for handset.
   */
  ngOnInit() {
    this.currentUser = this.authenticationService.getCredentials();
    this.userFullname = split(this.currentUser.staffDisplayName,',')[1].trim();
    this.toggleSidenavCollapse(false);
    this.sidenav.toggle(false);

    //
    // this.isHandset$.subscribe(isHandset => {
    //   if (isHandset && this.sidenavCollapsed) {
    //     this.toggleSidenavCollapse(false);
    //   }
    // });
    
  }

  /**
   * Toggles the current state of sidenav.
   */
  toggleSidenav() {
    this.sidenav.toggle();
  }

  /**
   * Toggles the current collapsed state of sidenav.
   */
  toggleSidenavCollapse(sidenavCollapsed?: boolean) {
    this.sidenavCollapsed = sidenavCollapsed || !this.sidenavCollapsed;
    this.collapse.emit(this.sidenavCollapsed);
  }

  /**
   * Logs out the authenticated user and redirects to login page.
   */
  logout() {
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  /**
   * Opens Midas JIRA Wiki page.
   */
  help() {
    window.open('https://drive.google.com/drive/folders/1-J4JQyaaxBz2QSfZMzC4bPrPwWlksFWw?usp=sharing', '_blank');
  }

  daily(){
    alert("Tính năng này đang được phát triển !")
  }

}
