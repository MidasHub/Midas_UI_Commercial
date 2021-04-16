const subdomain = window.location.hostname.split(".")[0];

// let tenant = 'tiktik';
// let billpostenant = 'tiktik';
// let defaultbaseURL = 'https://midas.kiotthe.com';
// let defaultbillposURL = 'https://midas.kiotthe.com';

let tenant = "default";
let billpostenant = "default";
let defaultbaseURL = "https://training.kiotthe.com";
let defaultbillposURL = "https://training.kiotthe.com";

// let tenant = 'hdcredit';
// let billpostenant = 'hdcredit';
// let defaultbaseURL = 'https://hdcredit.kiotthe.com';
// let defaultbillposURL = 'https://hdcredit.kiotthe.com';

// let tenant = "staging";
// let billpostenant = "staging";
// let defaultbaseURL = "https://staging.kiotthe.com";
// let defaultbillposURL = "https://staging.kiotthe.com";
// let defaultNotificationURL="https://staging.kiotthe.com"

let ictenant = "default";
let defaultIcURL = "https://ic.kiotthe.com";
// let defaultIcURL = "http://localhost:8088";
defaultbillposURL = "http://119.82.141.26:8088";
let apiProvider = "/midas/api";
const apiVersion = "/v1";

// if (subdomain === "doitac1" || subdomain === "localhost") {
//   defaultbaseURL = `https://staging.kiotthe.com`;
// }

// if (subdomain === "doitac2") {
//   defaultbaseURL = `https://training.kiotthe.com`;
// }

// if (subdomain === 'hanoi') {
//   tenant = 'hanoigolive';
//   billpostenant = 'hanoi';
//   defaultbaseURL = 'https://app2.midascore.net:8443';
//   defaultbillposURL = 'https://app1.midascore.net:8088';
//   apiProvider = '/fineract-provider/api';

// }

let defaultNotificationURL = "https://staging.kiotthe.com";

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
};
