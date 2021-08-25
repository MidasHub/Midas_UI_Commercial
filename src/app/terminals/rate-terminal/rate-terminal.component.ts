import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TerminalsService } from '../terminals.service';

@Component({
  templateUrl: './rate-terminal.component.html',
  styleUrls: ['./rate-terminal.component.scss']
})
export class RateTerminalComponent implements OnInit {
  dataSource: any[] = [];
  terminalId: any;
  displayedColumns: any[] = ['transferId', 'cardType', 'rate'];
  expandedElement: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private terminalsService: TerminalsService,
    private dialogRef: MatDialogRef<RateTerminalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.terminalId = this.data.terminalId;
    this.getTerminalRate(this.terminalId);
  }

  getTerminalRate(terminalId: any) {
    this.terminalsService.getTerminalRate(terminalId).subscribe((data: any) => {
      this.dataSource = data.result.rateDefaultEntity;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openDialog(a: any) {
// TODO: Không biết sao lại cần gọi hàm này trong html mà trong file ts ko định nghĩa
  }

}
