import {Component, Inject, OnInit} from '@angular/core';
import {ClientsService} from '../../../../clients/clients.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ReplaySubject} from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent implements OnInit {
  constructor(private serviceClient: ClientsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {
  }

  clients: any;
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
  public clientCtrl: FormControl = new FormControl();
  public clientFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'clientAdvanceCash': [''],
      'typeAdvanceCash': [''],
      'amountAdvance': [''],
      'noteAdvance': ['']
    });
    this.serviceClient.getClients('', '', 0, 20).subscribe((da: any) => {
      console.log(da);
      this.clients = da.pageItems;
    });
  }

  protected filterClients() {
    if (!this.clients) {
      return;
    }
    // get the search keyword
    let search = this.clientFilterCtrl.value;
    console.log({search})
    if (!search) {
      this.filteredBanks.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.clients.filter((cl: any) => cl.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
