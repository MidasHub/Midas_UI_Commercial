import { TranslateService } from '@ngx-translate/core';


export class Mytool{
    constructor(private translate: TranslateService) { }
    getTranslate(field:any):string{
        let lbl='';
        this.translate.get('Client_Component.ClientStepper.AddressStep.buttonAdd').subscribe((res: string) => {
          console.log('title', res);
          lbl = res
        })
        return lbl
      }
}