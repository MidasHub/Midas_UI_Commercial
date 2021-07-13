const subdomain = window.location.hostname.split('.')[0];

const tenant = 'demo';
const billpostenant = 'default';
const ictenant = 'default';
// let defaultIcURL = "http://localhost:8088";
const defaultIcURL = 'https://icdev.kiotthe.com';

const defaultbaseURL = 'https://icdev.kiotthe.com';
// let defaultbillposURL = "http://localhost:8088";
const defaultbillposURL = 'https://icdev.kiotthe.com';

const apiProvider = '/midas/api';
const apiVersion = '/v1';

const defaultNotificationURL = 'https://staging.kiotthe.com';
const documentURL = 'http://119.82.135.181:8001';
export default {
  coreT: tenant,
  billposT: billpostenant,
  defaultbaseURL: defaultbaseURL,
  defaultbillposURL: defaultbillposURL,
  icT: ictenant,
  icBaseUrl: defaultIcURL,
  defaultNotiURL: defaultNotificationURL,
  apiProvider: apiProvider,
  apiVersion: apiVersion,
  documentURL: documentURL,
};
