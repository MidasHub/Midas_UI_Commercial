import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

/** Custom Services */
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'midas-billpos-selector',
  templateUrl: './billpos-selector.component.html',
  styleUrls: ['./billpos-selector.component.scss']
})
export class BillposSelectorComponent implements OnInit {
  /** Billpos Settings. */
  billposServers: string[];

  /** Billpos Setting */
  serverBillposSelector =  new FormControl('');

  

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.billposServers = this.settingsService.serversBillpos;
    this.serverBillposSelector.patchValue(this.settingsService.serverBillpos);
    this.buildDependencies();
  }
  /**
   * Subscribe to value changes.
   */
  buildDependencies() {
    this.serverBillposSelector.valueChanges.subscribe((url: string) => {
      this.settingsService.setBillposServer(url);
      window.location.reload(); // refreshes the environment.ts.
    });
  }

}
