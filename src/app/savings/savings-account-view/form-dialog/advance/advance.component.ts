import {Component, Inject, OnInit} from '@angular/core';
import {ClientsService} from '../../../../clients/clients.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent implements OnInit {
  currentUser: any;
  disable = false;
  savingsAccountData: any;

  constructor(private serviceClient: ClientsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      'clientAdvanceCash': [''],
      'typeAdvanceCash': [''],
      'amountAdvance': [''],
      'noteAdvance': ['']
    });
    this.currentUser = data.currentUser;
    this.disable = data.disableUser;
    this.savingsAccountData = data.savingsAccountData;
    console.log(this.savingsAccountData);
    if (this.disable) {
      console.log(data.savingsAccountData.clientName);
      this.form.get('clientAdvanceCash').setValue(data.savingsAccountData.clientName);
    }
    this.serviceClient.getClients('', '', 0, -1).subscribe((cl: any) => {
      this.clients = cl.pageItems?.filter((v: any) => v?.accountNo?.startsWith('C') && v?.staffId === this.currentUser?.staffId);
      this.filteredClient = this.filterClient(null).slice(0, 30);
      if (!this.disable) {
        this.client.valueChanges.subscribe((value: any) => {
          this.filteredClient = this.filterClient(value).slice(0, 30);
        });
      }
    });
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

  }

  get client() {
    return this.disable ? this.clients?.find((v: any) => v.id === this.savingsAccountData.clientId) : this.form.get('clientAdvanceCash');
  }

  displayFn(client?: any): string | undefined {
    return this.disable ? client : client.displayName;
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
