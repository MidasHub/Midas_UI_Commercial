
console.log('subdomain',window.location.hostname.split(".")[0]);
const subdomain = window.location.hostname.split(".")[0];
let tenant= 'jean';
let billpostenant = 'jean'
let defaultbaseURL = 'https://staging.midascore.net'
let defaultbillposURL ='https://staging.midascore.net'
let apiProvider ='/midas/api'
let apiVersion = '/v1'


if (subdomain === 'staging-hn') {
  tenant = 'hanoi';
  billpostenant = 'hanoi';
}

if (subdomain === 'hanoi') {
  tenant = 'hanoi';
  billpostenant = 'hanoi';
  defaultbaseURL = 'https://app2.midascore.net:8443';
  defaultbillposURL = 'https://app1.midascore.net:8088';
  apiProvider = '/fineract-provider/api';

}

export default {
  coreT: tenant,
  billposT: billpostenant,
  defaultbaseURL: defaultbaseURL,
  defaultbillposURL: defaultbillposURL,
  apiProvider: apiProvider,
  apiVersion: apiVersion

};
