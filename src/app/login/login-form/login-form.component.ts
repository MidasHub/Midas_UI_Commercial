/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'

/** rxjs Imports */
import { finalize } from 'rxjs/operators';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { split } from 'lodash';
import {environment} from '../../../environments/environment';

import { Logger } from '../../core/logger/logger.service';
const log = new Logger('Login Page')
/**
 * Login form component.
 */
@Component({
  selector: 'mifosx-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  /** Login form group. */
  loginForm: FormGroup;
  /** Password input field type. */
  passwordInputType: string;
  /** True if loading. */
  loading = false;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {AuthenticationService} authenticationService Authentication Service.
   */
  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private http:HttpClient  ) { }

  /**
   * Creates login form.
   *
   * Initializes password input field type.
   */
  ngOnInit() {
    this.createLoginForm();
    this.passwordInputType = 'password';
  }

  //** Register Firebase to Noti Server */
  sendFireBaseKeyToServer() {
    if (localStorage.getItem('MidasFirebase') && sessionStorage.getItem('midasCredentials')) {

      let currentuser = JSON.parse(sessionStorage.getItem('midasCredentials'));
      const body = {
        officeID: currentuser.officeId,
        staffAppID: currentuser.staffId,
        staffUserID: currentuser.userId,
        staffUsername: currentuser.username,
        staffName: split(currentuser.staffDisplayName, ",")[1].trim(),
        staffCode: split(currentuser.staffDisplayName, ",")[0].trim(),
        fbToken: localStorage.getItem('MidasFirebase'),
        userAgent: navigator.userAgent
      };
      const httpOptions = {
        responseType: "blob" as "json",
        headers: new HttpHeaders({
          "corehost": environment.serverUrl,
        }),
      };
      log.debug(body);
      return this.http.post(environment.NotiGatewayURL + `/users/subscribe`, body,httpOptions).subscribe(e => log.debug(e));
    }
  }

  /**
   * Authenticates the user if the credentials are valid.
   */
  login() {
    this.loading = true;
    this.loginForm.disable();
    this.authenticationService.login(this.loginForm.value)
      .pipe(finalize(() => {
        this.loginForm.reset();
        this.loginForm.markAsPristine();
        // Angular Material Bug: Validation errors won't get removed on reset.
        this.loginForm.enable();
        this.loading = false;
      })).subscribe(() => {
        this.sendFireBaseKeyToServer();
      });
  }

  /**
   * TODO: Decision to be taken on providing this feature.
   */
  forgotPassword() {
    alert('Forgot Password feature currently unavailable.')
  }

  /**
   * Creates login form.
   */
  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'remember': false
    });
  }


}
