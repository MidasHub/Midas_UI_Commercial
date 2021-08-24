import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from '../core/alert/alert.service';

/** Logger */
import { Logger } from '../core/logger/logger.service';
const log = new Logger('Firebase Message');


@Injectable({
  providedIn: 'root'
})
export class FireBaseMessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging,
    private alertService: AlertService) {
    this.angularFireMessaging.messages.subscribe(
      (_messaging: any) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    );
  }


  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token: any) => {
        // log.info(token);
        if (localStorage.getItem('MidasFirebase')) {
          localStorage.removeItem('MidasFirebase');
        }
        localStorage.setItem('MidasFirebase', token);

      },
      (err: any) => {
        log.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload: any) => {
        log.debug('new message received. ', payload);
        this.alertService.alert({ message: '[Firebase-Notification]: \n' + payload.notification.title + ': ' + payload.notification.body, msgClass: 'cssInfo' });
        this.currentMessage.next(payload);
      });
  }
}
