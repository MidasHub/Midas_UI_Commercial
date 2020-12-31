import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/** Routing Imports */
import {Route} from '../core/route/route.service';

/** Translation Imports */
import {extract} from '../core/i18n/i18n.service';
import {CardBankViewComponent} from './card-bank-view/card-bank-view.component';
import {BanksComponent} from './banks/banks.component';

const routes: Routes = [
  Route.withShell([
    {
      path: 'banks',
      // data: {title: extract('Bank'), breadcrumb: 'Bank'},
      children: [
        {
          path: '',
          data: {title: extract('Banks'), breadcrumb: 'Banks'},
          component: BanksComponent
        }
      ]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CardBankViewComponent
  ]
})
export class BanksRoutingModule {
}
