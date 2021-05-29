const subdomain = window.location.hostname.split(".")[0];

let tenant = "default";
let billpostenant = "default";
let ictenant = "default";
let defaultIcURL = "https://ic.kiotthe.com";

// prod TEKCOMPAY, HDCREDIT
let defaultbaseURL = "https://midas.kiotthe.com";
let defaultbillposURL = "https://midas.kiotthe.com";

let apiProvider = "/midas/api";
const apiVersion = "/v1";

let defaultNotificationURL = "https://staging.kiotthe.com";
let documentURL = "https://document.kiotthe.com";
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
