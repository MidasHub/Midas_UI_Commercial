/** Angular Imports */
import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { BanksService } from "app/banks/banks.service";

/** Custom Services */
import { Logger } from "../logger/logger.service";
import { AuthenticationService } from "./authentication.service";

/** Initialize logger */
const log = new Logger("AuthenticationGuard");

/**
 * Route access authorization.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  /**
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication Service.
   */
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private bankService: BanksService
  ) {}

  /**
   * Ensures route access is authorized only when user is authenticated, otherwise redirects to login.
   *
   * @returns {boolean} True if user is authenticated.
   */
  canActivate(): boolean {
    if (this.authenticationService.isAuthenticated()) {
      let currentUser = this.authenticationService.getCredentials();
      if (["18", "22", "23", "25"].includes(String(currentUser.officeId))) {
        window.location.replace('https://hd.kiotthe.com/');

      }

      this.authenticationService.checkAppModuleSetting(null);
      // load card and bank data
      this.bankService.bankCardDataInit();
      return true;
    }

    log.debug("User not authenticated, redirecting to login...");
    this.authenticationService.logout();
    this.router.navigate(["/login"], { replaceUrl: true });
    return false;
  }
}
