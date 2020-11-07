/** Angular Imports */
import { Component } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';


/** Custome service */
import {I18nService} from '../../core/i18n/i18n.service'

/**
 * Search Tool Component
 */
@Component({
  selector: 'mifosx-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SearchToolComponent {

  /** Query Form Control */
  query = new FormControl('');
  /** Resource Form Control */
  resource = new FormControl('');

  /** Sets the initial visibility of search input as hidden. Visible if true. */
  searchVisible = false;
  /** Resource Options */
  resourceOptions: any[] = [
    {
      name: this.i18nService.getTranslate('Toolbar_Component.lblAll'),
      value: 'clients,clientIdentifiers,groups,savings,shares,loans'
    },
    {
      name: this.i18nService.getTranslate('Toolbar_Component.lblClient'),
      value: 'clients,clientIdentifiers'
    },
    {
      name: this.i18nService.getTranslate('Toolbar_Component.lblGroup'),
      value: 'groups'
    },
    {
      name: this.i18nService.getTranslate('Toolbar_Component.lblSaving'),
      value: 'savings'
    },
    {
      name: this.i18nService.getTranslate('Toolbar_Component.lblShare'),
      value: 'shares'
    },
    {
      name: this.i18nService.getTranslate('Toolbar_Component.lblLoan'),
      value: 'loans'
    },
  ];

  /**
   * @param {Router} router Router
   */
  constructor(private router: Router,
              private i18nService:I18nService) {
    this.resource.patchValue('clients,clientIdentifiers,groups,savings,shares,loans');
  }

  /**
   * Toggles the visibility of search input with fadeInOut animation.
   */
  toggleSearchVisibility() {
    this.searchVisible = !this.searchVisible;
  }

  /**
   * Searches server for query and resource.
   */
  search() {
    const queryParams: any = {
      query: this.query.value,
      resource: this.resource.value
    };
    this.router.navigate(['/search'], { queryParams: queryParams });
  }

}
