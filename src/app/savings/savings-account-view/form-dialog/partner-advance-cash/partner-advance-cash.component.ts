import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SavingsService} from '../../../savings.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'midas-partner-advance-cash',
  templateUrl: './partner-advance-cash.component.html',
  styleUrls: ['./partner-advance-cash.component.scss']
})
export class PartnerAdvanceCashComponent implements OnInit {
  form: FormGroup;
  advanceCashPaymentTypes: any[] = [
    {
      'id': '18',
      'name': 'Ứng tiền'
    },
    {
      'id': '26',
      'name': 'Hoàn tiền'
    },
    {
      'id': '27',
      'name': 'Điều chuyển nội bộ'
    },
    {
      'id': '28',
      'name': 'Điều chỉnh bút toán'
    }
  ];
  partnerAdvanceCashes: any[];
  filteredPartner: any[];
  partnerOfficeAdvanceCashes: any[];
  partnerClientVaultAdvanceCashes: any[];

  constructor(private savingService: SavingsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder
  ) {
  }

  get partner() {
    return this.form.get('partnerAdvanceCash');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'partnerPaymentType': [''],
      'partnerAdvanceCash': [''],
      'amountPartnerAdvance': [''],
      'notePartnerAdvance': ['']
    });
    this.form.get('partnerPaymentType').valueChanges.subscribe(value => {
      if (value === '27') {
        this.form.addControl('partnerOfficeAdvanceCash', new FormControl('', [Validators.required]));
        this.form.addControl('partnerClientVaultAdvanceCash', new FormControl('', [Validators.required]));
        this.form.get('partnerOfficeAdvanceCash').valueChanges.subscribe(value1 => {
          this.savingService.getListSavingAdvanceCashFromPartner(value1).subscribe(resulte => {
            this.partnerClientVaultAdvanceCashes = resulte?.result?.listClientSavingVault;
          });
        });
      } else {
        this.form.removeControl('partnerClientVaultAdvanceCash');
        this.form.removeControl('partnerOfficeAdvanceCash');
      }
    });
    this.savingService.getListPartner().subscribe((result: any) => {
      this.partnerAdvanceCashes = result?.result?.listPartner;
      this.filteredPartner = this.filterPartner(null).slice(0, 30);
      this.partner.valueChanges.subscribe(value => {
        this.filteredPartner = this.filterPartner(value).slice(0, 30);
      });
    });
    this.savingService.getListOfficeCommon().subscribe(result => {
      this.partnerOfficeAdvanceCashes = result?.result?.listOffice;
    });

  }

  displayFn(client?: any): string | undefined {
    return client ? client.desc : undefined;
  }

  private filterPartner(value: string | any) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.desc.toLowerCase();
      return this.partnerAdvanceCashes.filter((partner: any) => partner.desc.toLowerCase().includes(filterValue));
    } else {
      return this.partnerAdvanceCashes;
    }
  }
}
