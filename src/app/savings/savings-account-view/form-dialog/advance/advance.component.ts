import { Component, Inject, OnInit } from '@angular/core';
import { ClientsService } from '../../../../clients/clients.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsService } from 'app/groups/groups.service';
import { SavingsService } from 'app/savings/savings.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BanksService } from 'app/banks/banks.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss'],
})
export class AdvanceComponent implements OnInit {
  currentUser: any;
  disable = false;
  savingsAccountData: any;
  isLoading = false;
  form!: FormGroup;
  clients: any;
  filteredClient!: any[];
  staffs: any;
  offices: any;

  typeEntityAdvanceCashes: any[] = [
    {
      id: 'C',
      value: 'Khách hàng',
    },
    {
      id: 'G',
      value: 'Đại lý',
    },
  ];

  typeAdvanceCashes: any[] = [
    {
      id: '19',
      value: 'Ứng tiền phí',
    },
    {
      id: '62',
      value: 'Thu hộ',
    },
    {
      id: '-62',
      value: 'Chi hộ',
    },
  ];

  constructor(
    private serviceClient: ClientsService,
    private groupService: GroupsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private bankService: BanksService
  ) {
    this.currentUser = data.currentUser;
    this.disable = data.disableUser;
    this.savingsAccountData = data.savingsAccountData;
    if (this.disable) {
      this.form.get('clientAdvanceCash')?.setValue(data.savingsAccountData.clientName);
    }
  }

  ngOnInit(): void {
    this.bankService.getListOfficeCommon().subscribe((offices: any) => {
      this.offices = offices.result.listOffice;
    });

    this.form = this.formBuilder.group({
      entityAdvanceCash: ['', Validators.required],
      clientAdvanceCash: ['', Validators.required],
      typeAdvanceCash: ['', Validators.required],
      amountAdvance: ['', Validators.required],
      noteAdvance: [''],
    });

    this.form.get('entityAdvanceCash')?.valueChanges.subscribe((entityValue) => {
      if (entityValue === 'C') {
        this.form.addControl('staff', new FormControl(this.currentUser.staffId));
        this.form.addControl('office', new FormControl(this.currentUser.officeId));

        this.form.get('staff')?.valueChanges.subscribe((value) => {
          this.getClientAgencyFilter(value);
        });

        this.form.get('office')?.valueChanges.subscribe((value) => {
          this.serviceClient.getStaffsByOffice(value).subscribe((result) => {
            this.staffs = result.result.listStaff;
          });
        });
        this.serviceClient.getStaffsByOffice(this.currentUser.officeId).subscribe((result) => {
          this.staffs = result.result.listStaff;
        });
      } else {
        this.form.removeControl('staff');
        this.form.removeControl('office');
      }

      this.getClientAgencyFilter(this.currentUser.staffId);
    });
  }

  get client() {
    return this.disable
      ? this.clients?.find((v: any) => v.id === this.savingsAccountData.clientId)
      : this.form.get('clientAdvanceCash');
  }

  getClientAgencyFilter(staffId: string) {
    const entityType = this.form.get('entityAdvanceCash')?.value;
    this.clients = [];
    this.filteredClient = [];
    this.isLoading = true;
    if (entityType === 'C') {
      let sqlSearch = ` c.staff_id = ${staffId} `;
      if (!staffId) {
        sqlSearch = '';
      }
      this.serviceClient.getClientsByStaff('', '', 0, -1, sqlSearch).subscribe((cl: any) => {
        this.clients = cl.pageItems?.filter((v: any) => v?.accountNo?.startsWith('C'));
        this.filteredClient = this.filterClient(null).slice(0, 30);
        this.isLoading = false;
      });
    } else {
      const filterGroupsBy = [
        {
          type: 'name',
          value: '',
        },
      ];
      this.groupService.getGroups(filterGroupsBy, '', '', 0, -1).subscribe((gr: any) => {
        this.clients = gr.pageItems;
        this.filteredClient = this.filterClient(null).slice(0, 30);
        this.isLoading = false;
      });
    }

    this.client.valueChanges.subscribe((value: any) => {
      this.filteredClient = this.filterClient(value).slice(0, 30);
    });
  }

  displayClientWithExternalId(client?: any): string | undefined {
    let result = client.displayName;
    if (client.externalId) {
      result = `${result} - IDs:${client.externalId} `;
    }

    if (client.mobileNo) {
      result = `${result} - SĐT:${client.mobileNo} `;
    }
    return result;
  }

  displayFn(client?: any): string | undefined {
    return this.disable ? client : client.displayName ? client.displayName : client.name;
  }

  /* Filter chỗ này hơi rối, anhjean đã điều chỉnh */
  private filterClient(value: string|null) {
    // let filterValue = '';
    if (this.form.get('entityAdvanceCash')?.value === 'C') {
      if (value) {
        // filterValue = typeof value === 'string' ? value.toLowerCase().trim() : '';
        // return this.clients.filter((client: any) => client.displayName.toLowerCase().trim().includes(filterValue));
        return this.clients.filter((client: any) => client.displayName.toLowerCase().trim().includes(value.toLowerCase().trim()));
      } else {
        return this.clients;
      }
    } else {
      if (value) {
        // filterValue = typeof value === 'string' ? value.toLowerCase().trim() : '';
        // return this.clients.filter((client: any) => client.name.toLowerCase().trim().includes(filterValue));
        return this.clients.filter((client: any) => client.name.toLowerCase().trim().includes(value.toLowerCase().trim()));
      } else {
        return this.clients;
      }
    }
  }
}
