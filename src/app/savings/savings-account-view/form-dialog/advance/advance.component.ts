import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ClientsService} from '../../../../clients/clients.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {map, startWith, switchMap, take, takeUntil} from 'rxjs/operators';
import {MatSelect} from '@angular/material/select';
import {ClientsDataSource} from '../../../../clients/clients.datasource';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent implements OnInit {
  currentUser: any;

  constructor(private serviceClient: ClientsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {
    this.currentUser = data.currentUser;
    console.log(this.currentUser)
  }

  typeAdvanceCashes: any[] = [{
    id: '19',
    value: 'Ứng tiền phí'
  },
    {
      id: '3',
      value: 'Thu hộ'
    },
    {
      id: '37',
      value: 'Chi hộ'
    }];
  form: FormGroup;
  clients: any;
  filteredClient: any[];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'clientAdvanceCash': [''],
      'typeAdvanceCash': [''],
      'amountAdvance': [''],
      'noteAdvance': ['']
    });
    this.serviceClient.getClients('', '', 0, -1).subscribe((cl: any) => {
      this.clients = cl.pageItems?.filter((v: any) => v?.accountNo?.startsWith('C') && v?.staffId ===  this.currentUser?.staffId );
      this.filteredClient = this.filterClient(null).slice(0, 30);
      this.client.valueChanges.subscribe(value => {
        this.filteredClient = this.filterClient(value).slice(0, 30);
      });
    });
  }

  get client() {
    return this.form.get('clientAdvanceCash');
  }

  displayFn(client?: any): string | undefined {
    return client ? client.displayName : undefined;
  }

  private filterClient(value: string | any) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.displayName.toLowerCase();
      return this.clients.filter((client: any) => client.displayName.toLowerCase().includes(filterValue));
    } else {
      return this.clients;
    }
  }
}
