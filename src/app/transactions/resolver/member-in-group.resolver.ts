/** Angular Imports */
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';

/** rxjs Imports */
import {Observable} from 'rxjs';

/** Custom Services */
import {TransactionService} from '../transaction.service';

@Injectable()
export class MemberInGroupResolver implements Resolve<Object> {

  constructor(private transactionServices: TransactionService) {
  }

  resolve(route: ActivatedRouteSnapshot): any {
    const groupId = route.paramMap.get('groupId');
    return groupId; // this.transactionServices.getMembersInGroup(groupId);
  }

}
