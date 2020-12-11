
console.log('subdomain',window.location.hostname.split(".")[0]);
const subdomain = window.location.hostname.split(".")[0];
let tenant= 'default';
let billpostenant = 'midas'
if (subdomain === 'staging-hn') {
  tenant = 'hanoi'
  billpostenant = 'midas'
}
if (subdomain === 'staging-hcm') {
  tenant = 'jean'
  billpostenant = 'midas'
}

export default {
    coreT: tenant,
    billposT: billpostenant

}