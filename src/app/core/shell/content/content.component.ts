/** Angular Imports */
import { Component, Input, OnInit } from '@angular/core';

/**
 * Content component.
 */
@Component({
  selector: 'midas-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @Input() isDesktop: boolean;
  constructor() { }

  ngOnInit() {
    console.log('content:', this.isDesktop);
  }

}
