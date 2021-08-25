import { filter, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from 'app/clients/clients.service';
import { AlertService } from 'app/core/alert/alert.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { MidasClientService } from 'app/midas-client/midas-client.service';
import { TerminalsService } from 'app/terminals/terminals.service';
import { TransactionService } from 'app/transactions/transaction.service';
import { MatPaginator } from '@angular/material/paginator';
import { merge } from 'rxjs';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

export interface Element {
  transferDate: Date;
  customerName: string;
  cardNumber: string;
  senderStaff: string;
  shipper: string;
  receiverStaff: string;
  note: string;
}

@Component({
  selector: 'midas-export-transfer',
  templateUrl: './export-transfer.component.html',
  styleUrls: ['./export-transfer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '100px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ExportTransferComponent implements OnInit {
  displayedColumns: string[] = [
    'transferDate',
    'customerName',
    'cardNumber',
    'senderStaff',
    'shipper',
    'receiverStaff',
    'note',
  ];
  dataSource: any[] = [];
  dataTemp: any[] = [];
  // dataSource = new MatTableDataSource<Element>();
  // dataSource = new MatTableDataSource();
  shipperFilter = new FormControl('');
  deliverFilter = new FormControl('');
  staffFilter = new FormControl('');

  currentUser: any;
  isRequiredTraceBatchNo = true;
  product: any;
  isLoading: Boolean = false;
  shipper: any;
  senderStaffName: any;
  receiverStaffName: any;
  transferRefNo: any;
  officeId: any;
  today = new Date();
  currentNav!: any;
  expandedElement!: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private transactionServices: TransactionService,
    private midasClientService: MidasClientService,
    private clientService: ClientsService,
    private datePipe: DatePipe,
    private terminalsService: TerminalsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentUser = this.authenticationService.getCredentials();
    const { permissions } = this.currentUser;
    const permit_manager = permissions.includes('POS_UPDATE');
    if (permit_manager) {
      this.isRequiredTraceBatchNo = false;
    }
    // TODO: look like this is an unused variable.
    this.currentNav = this.router.getCurrentNavigation()?.extras.state;
    this.officeId = this.currentUser.officeId;
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.shipper = this.route.snapshot.queryParams['shipper'];
    this.senderStaffName = this.route.snapshot.queryParams['senderStaffName'];
    this.receiverStaffName = this.route.snapshot.queryParams['receiverStaffName'];
    this.transferRefNo = this.route.snapshot.queryParams['transferRefNo'];
    // let str = this.route.snapshot.queryParams['dataSource'];

    this.transactionServices.getDetailByTransferRefNo(this.transferRefNo, this.officeId).subscribe((data) => {
      this.dataSource = data.result.listDetailRequest;
      console.log('this.dataSource: ', this.dataSource);
    });

    // this.dataTemp = JSON.parse(str);
    // console.log("this.dataTemp.length: ", this.dataTemp.length);
    // for (let index = 0; index < this.dataTemp.length; index++) {
    //   this.dataSource.push(this.getTableData(this.dataTemp[index]));
    // }
  }

  getTableData(dataTemp: Element) {
    return {
      transferDate: dataTemp.transferDate,
      customerName: dataTemp.customerName,
      cardNumber: dataTemp.cardNumber,
      senderStaff: '..................',
      shipper: '..................',
      receiverStaff: '..................',
      note: '..................',
    };
  }

  // public openPDF():void {
  //   let DATA = this.htmlData.nativeElement;
  //   let doc = new jsPDF('p','pt', 'a4');
  //   doc.html(DATA.innerHTML,15,15);
  //   doc.output('dataurlnewwindow');
  // }

  openPdf() {
    this.transactionServices.exportCardTransferRequest(this.transferRefNo, this.officeId).subscribe((data) => {
      console.log('Export PDF statusCode: ', data.statusCode);
    });
    const elementData = document.getElementById('contentToConvert');
    if (elementData) {
      html2canvas(elementData).then((canvas) => {
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf('p', 'mm', 'a4');
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('newPDF.pdf');
      });
    }
  }
}
