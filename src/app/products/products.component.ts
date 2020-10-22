/** Angular Imports */
import { Component, OnInit } from '@angular/core';

/* import translate service */
import { TranslateService } from '@ngx-translate/core';

/**
 * Products component.
 */
@Component({
  selector: 'mifosx-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private translate:TranslateService) { }

  ngOnInit() {
  }

}
