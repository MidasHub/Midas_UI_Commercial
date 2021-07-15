// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.


import env from './.env';
import te from './checkurl';
// baseApiUrl: 'https://uat.tekcompay.com:9443',
export const environment = {
  production: false,
  isNewBillPos: true,
  isCommercial:false, //Phiên bản cung cấp cho khách hàng Commercial thì set biến này thành true
  version: env?.midas_version + '-dev',
  fineractPlatformTenantId: te.coreT,  // For connecting to server running elsewhere update the tenant identifier
  baseApiUrl: JSON.parse(sessionStorage.getItem('midasServerURL')) || te.defaultbaseURL,
  allowServerSwitch: env?.allow_switching_backend_instance,
  apiProvider: te.apiProvider,
  apiVersion: te.apiVersion,
  serverUrl: '',
  GatewayApiUrl: JSON.parse(sessionStorage.getItem('midasBillposServerURL')) || te.defaultbillposURL,
  GatewayApiUrlPrefix: '/loyalty-api',
  GatewayServerUrl: '',
  GatewayTenantId: te.billposT,
  NotiGatewayURL: te.defaultNotiURL,
  NotiGatewayPrefix: '/notification',
  oauth: {
    enabled: false,  // For connecting to Midas using OAuth2 Authentication change the value to true
    serverUrl: '',
    clientID: 'community-app',
    clientSecrect: '123',
  },
  defaultLanguage: 'vi-VN',
  supportedLanguages: [
    'en-US',
    'vi-VN'
  ],
  languagesName: {
    en: 'English',
    vi: 'Vietnamese',
  }
  ,
  firebase: {
    apiKey: "AIzaSyAtCSdklLZJKt7t2sjd4edRbofqZL7-UCw",
    authDomain: "kiotthe-307407.firebaseapp.com",
    projectId: "kiotthe-307407",
    databaseURL:"https://kiotthe-307407-default-rtdb.firebaseio.com/",
    storageBucket: "kiotthe-307407.appspot.com",
    messagingSenderId: "83286799966",
    appId: "1:83286799966:web:b46ce89fcbbdf4c0f2e6cf",
    measurementId: "G-866JPR188B"
  }
};

// Server URL
environment.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}${environment.apiVersion}`;
environment.oauth.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}`;
environment.GatewayServerUrl = `${environment.GatewayApiUrl}`;
environment.NotiGatewayURL = `${environment.NotiGatewayURL}${environment.NotiGatewayPrefix}`

