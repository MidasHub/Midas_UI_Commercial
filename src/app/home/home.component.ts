/** Angular Imports */
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


/** Custom Imports. */
import { activities } from './activities';

/** Custom Services */
import { AuthenticationService } from '../core/authentication/authentication.service';
import { bannerData, ChildBannerData } from './banner_data';
import { TourService } from 'ngx-tour-md-menu';
/** Device detector */
import { DeviceDetectorService, OrientationType, DeviceType } from 'ngx-device-detector';

import * as ScreenEnum from '../core/constants/screen_constant';
import { split } from 'lodash';
/**
 * Home component.
 */
@Component({
  selector: 'midas-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  /** Activity Form. */
  activityForm: any;
  /** Search Text. */
  searchText: FormControl = new FormControl();
  /** Filtered Activities. */
  filteredActivities: Observable<any[]>;
  /** All User Activities. */
  allActivities: any[] = activities;
  //** Data for banner  */
  showBanner: boolean = false
  title: string;
  childBannerData = new ChildBannerData()

  /** Screem size check */
  screenSize: any;
  isDesktop: boolean;

  /**
   * @param {AuthenticationService} authenticationService Authentication Service.
   * @param {FormBuilder} formBuilder Form Builder.
   */




  constructor(private authenticationService: AuthenticationService,
    private detectDevice: DeviceDetectorService,
    private tourService: TourService) {
    this.isDesktop = this.detectDevice.isDesktop();
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event:any) {
  //   this.screenSize = window.innerWidth;


  //   console.log('Screen Size:', this.screenSize)
  //   console.log('Screen Orientation:', window.screen.orientation)


  // };

  /**
   * Sets the username of the authenticated user.
   * Set Form.
   */
  ngOnInit() {
    const credentials = this.authenticationService.getCredentials();

    this.childBannerData.userName = split("credentials.staffDisplayName",',')[1]?.trim();
    console.log(split("credentials.staffDisplayName",',')[1]?.trim());

    bannerData.some(d => {
      if (d.office === credentials.officeId) {
        this.showBanner = true;
        this.childBannerData.title = d.title;
      }
    })
    this.setFilteredActivities();
    this.screenSize = window.innerWidth
    // console.log('Screen size: ', this.screenSize)


  }

  /**
   * Sets filtered activities for autocomplete.
   */
  setFilteredActivities() {
    this.filteredActivities = this.searchText.valueChanges
      .pipe(
        map((activity: any) => typeof activity === 'string' ? activity : activity.activity),
        map((activityName: string) => activityName ? this.filterActivity(activityName) : this.allActivities));
  }

  /**
   * Filters activities.
   * @param activityName Activity name to filter activity by.
   * @returns {any} Filtered activities.
   */
  private filterActivity(activityName: string): any {
    const filterValue = activityName.toLowerCase();
    return this.allActivities.filter(activity => activity.activity.toLowerCase().indexOf(filterValue) === 0);
  }


}
