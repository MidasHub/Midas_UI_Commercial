/** Angular Imports */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Not Found Component
import {NotFoundComponent} from './not-found/not-found.component';

/**
 * Fallback to this route when no prior route is matched.
 */
const routes: Routes = [
  {
    path: '**',
    component: NotFoundComponent
  }
];

/**
 * App Routing Module.
 *
 * Configures the fallback route.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })], // Jean: add useHash, scrollPositionRestoration: 'enabled'

  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
