// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// `.env.ts` is generated by the `npm run env` command
import env from './.env';

export const environment = {
  production: false,
  version: env.npm_package_version + '-dev',
  fineractPlatformTenantId: 'default',  // For connecting to server running elsewhere update the tenant identifier
  //baseApiUrl: 'https://app2.midascore.net:8443',  // For connecting to server running elsewhere update the base API URL
  baseApiUrl: 'https://uat.tekcompay.com:9443',
  //baseApiUrl: 'https://119.82.135.172:8443',
  GatewayApiUrl: 'http://localhost:8286',
  GatewayApiUrlPrefix: '/billPos',
  apiProvider: '/fineract-provider/api',
  apiVersion: '/v1',
  serverUrl: '',
  gatewayServerUrl: '',
  oauth: {
    enabled: false,  // For connecting to Midas using OAuth2 Authentication change the value to true
    serverUrl: ''
  },
  defaultLanguage: 'vi-VN',
  supportedLanguages: [
    'en-US',
    'vi-VN'
  ],
  languagesName:{
   en:"English",
   vi:"Vietnamese",
  }
};

// Server URL
environment.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}${environment.apiVersion}`;
environment.oauth.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}`;
environment.gatewayServerUrl = `${environment.GatewayApiUrl}`;
