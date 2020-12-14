
console.log('subdomain',window.location.hostname.split(".")[0]);
const subdomain = window.location.hostname.split(".")[0];
let tenant= 'jean';
let billpostenant = 'jean'
if (subdomain !== 'staging-hn') {
  tenant = 'hanoi'
  billpostenant = 'hanoi'
}

export default {
    coreT: tenant,
    billposT: billpostenant

}
