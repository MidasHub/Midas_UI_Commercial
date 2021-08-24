import {Component, OnInit} from '@angular/core';
import {AlertService} from 'app/core/alert/alert.service';
import {I18nService} from 'app/core/i18n/i18n.service';

@Component({
  selector: 'midas-ondue-card',
  templateUrl: './ondue-card.component.html',
  styleUrls: ['./ondue-card.component.scss']
})
export class OndueCardComponent implements OnInit {

  constructor(
    private alertService: AlertService,
    private i18n: I18nService) {
  }

  ngOnInit(): void {
  }

  onClickAlert() {
    this.alertService.alert({message: 'Tính năng này đang phát triển, Vui lòng thử lại sau !', msgClass: 'cssInfo'});
  }
}
