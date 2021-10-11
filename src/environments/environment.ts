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
  isCommercial: false, // Phiên bản cung cấp cho khách hàng Commercial thì set biến này thành true
  version: env?.midas_version + '-dev',
  fineractPlatformTenantId: te.coreT,  // For connecting to server running elsewhere update the tenant identifier
  baseApiUrl: sessionStorage.getItem('midasServerURL') || te.defaultbaseURL,
  allowServerSwitch: env?.allow_switching_backend_instance,
  apiProvider: te.apiProvider,
  apiVersion: te.apiVersion,
  serverUrl: '',
  GatewayApiUrl: sessionStorage.getItem('midasBillposServerURL') || te.defaultbillposURL,
  GatewayApiUrlPrefix: '/billpos',
  GatewayServerUrl: '',
  GatewayTenantId: te.billposT,
  IcGatewayApiUrl: te.icBaseUrl,
  IcGatewayApiUrlPrefix: '/ic-app',
  IcGatewayTenantId: te.icT,
  NotiGatewayURL: 'https://pwa.jl-family.com',
  NotiGatewayPrefix: '/notification',
  ICDocumentURL: te.documentURL,
  remotePdbUrl: 'https://admin:Anhnh7383@couchdb.kiotthe.app/',
  oauth: {
    enabled: false,  // For connecting to Midas using OAuth2 Authentication change the value to true
    clientID: 'community-app',
    clientSecrect: '123',
    serverUrl: ''
  },
  defaultLanguage: 'vi-VN',
  supportedLanguages: [
    'en-US',
    'vi-VN'
  ],
  languagesName: {
    en: 'English',
    vi: 'Vietnamese',
  },
  applyLuhnAlgorithm: true
};

// Server URL
environment.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}${environment.apiVersion}`;
environment.oauth.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}`;
environment.GatewayServerUrl = `${environment.GatewayApiUrl}`;
environment.NotiGatewayURL = `${environment.NotiGatewayURL}${environment.NotiGatewayPrefix}`;

