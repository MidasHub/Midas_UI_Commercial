import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'midas-customerbanner',
  templateUrl: './customerbanner.component.html',
  styleUrls: ['./customerbanner.component.scss']
})
export class CustomerbannerComponent implements OnInit {
  @Input() childBannerData: any; // decorate the property with @Input()

  constructor() { }

  ngOnInit(): void {
    console.log('--------', this.childBannerData)
  }

}
