
console.log('subdomain',window.location.hostname.split(".")[0]);
const subdomain = window.location.hostname.split(".")[0];
let tenant= 'default';
let billpostenant = 'default'
let defaultbaseURL =  'https://uat.tekcompay.com:8443'
let defaultbillposURL = 'https://uat.tekcompay.com:8287'
let apiProvider ='/midas/api'
let apiVersion = '/v1'


if (subdomain === 'staging-hn') {
  tenant = 'hanoi'
  billpostenant = 'hanoi'
}

if (subdomain === 'hanoi') {
  tenant = 'hanoigolive'
  billpostenant = 'hanoi'
  defaultbaseURL = 'https://app2.midascore.net:8443'
  defaultbillposURL= 'https://app1.midascore.net:8088'
  apiProvider ='/fineract-provider/api'

}

export default {
    coreT: tenant,
    billposT: billpostenant,
    defaultbaseURL: defaultbaseURL,
    defaultbillposURL:defaultbillposURL,
    apiProvider:apiProvider,
    apiVersion:apiVersion

}
