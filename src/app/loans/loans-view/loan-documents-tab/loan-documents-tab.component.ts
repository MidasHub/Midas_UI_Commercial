/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

/** Custom Services */
import { environment } from 'environments/environment';
import { LoansService } from 'app/loans/loans.service';

/** Dialog Components */
import { LoanAccountLoadDocumentsDialogComponent } from 'app/loans/custom-dialog/loan-account-load-documents-dialog/loan-account-load-documents-dialog.component';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';

/**
 * Overdue charges tab component
 */
@Component({
  selector: 'mifosx-loan-documents-tab',
  templateUrl: './loan-documents-tab.component.html',
  styleUrls: ['./loan-documents-tab.component.scss']
})
export class LoanDocumentsTabComponent implements OnInit {
  @ViewChild('documentsTable') documentsTable: MatTable<Element>;

  /** Stores the resolved loan documents data */
  loanDocuments: any;
  /** Stores the resolved loan details data */
  loanDetailsData: any;
  /** Status of the loan account */
  status: any;
  /** Choice */
  choice: boolean;

  /** Columns to be displayed in loan documents table. */
  displayedColumns: string[] = ['name', 'description', 'filename', 'actions'];
  /** Data source for loan documents table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for codes table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for codes table. */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Retrieves the loans data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute,
    private loansService: LoansService,
    public dialog: MatDialog) {
    this.route.data.subscribe((data: { loanDocuments: any }) => {
      //this.getLoanDocumentsData(data.loanDocuments);
      this.loanDocuments = data.loanDocuments;
    });
    this.route.parent.data.subscribe((data: { loanDetailsData: any }) => {
      this.loanDetailsData = data.loanDetailsData;
    });
  }

  ngOnInit() {
    this.status = this.loanDetailsData.status.value;
    if (this.status === 'Submitted and pending approval' || this.status === 'Active' || this.status === 'Approved') {
      this.choice = true;
    }
    this.dataSource = new MatTableDataSource(this.loanDocuments);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getLoanDocumentsData(data: any) {
    data.forEach((ele: any) => {
      let loandocs = {};
      loandocs = environment.serverUrl + '/loans/' + ele.parentEntityId + '/documents/' + ele.id + '/attachment?tenantIdentifier=' + window.localStorage.getItem("Fineract-Platform-TenantId");
      ele.docUrl = loandocs;
      if (ele.fileName) {
        if (ele.fileName.toLowerCase().indexOf('.jpg') !== -1 || ele.fileName.toLowerCase().indexOf('.jpeg') !== -1 || ele.fileName.toLowerCase().indexOf('.png') !== -1) {
          ele.fileIsImage = true;
        }
      }
      if (ele.type) {
        if (ele.type.toLowerCase().indexOf('image') !== -1) {
          ele.fileIsImage = true;
        }
      }
    });
    this.loanDocuments = data;
  }
 
  uploadDocument() {
    const uploadDocumentDialogRef = this.dialog.open(LoanAccountLoadDocumentsDialogComponent);
    uploadDocumentDialogRef.afterClosed().subscribe((dialogResponse: any) => {
      console.log("dialogResponse",dialogResponse);
      if (dialogResponse) { 
        const formData: FormData = new FormData();
        formData.append("name", dialogResponse.fileName);
        formData.append("description", dialogResponse.description);
        formData.append("file", dialogResponse.file);
        this.loansService.uploadLoanDocument_(this.loanDetailsData.id, formData).subscribe((res: any) => {
            this.loanDocuments.push({
              id: res.resourceId,
              parentEntityType: 'loans',
              parentEntityId: this.loanDetailsData.id,
              name: dialogResponse.fileName,
              fileName: dialogResponse.file.name,
              description: dialogResponse.description,
              size:0,
              type:''
            });
            this.dataSource = this.loanDocuments;
        });
      }
    });
  }
   
  download(parentEntityId: string, documentId: string) {
    this.loansService.downloadLoanDocument(parentEntityId, documentId).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      window.open(url);
    });
  }

  deleteDocument(documentId: any, index: any) {
    const deleteDocumentDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `document id:${documentId}` }
    });
    deleteDocumentDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.loansService.deleteLoanDocument(this.loanDetailsData.id, documentId).subscribe((res: any) => {
          this.loanDocuments.splice(index, 1);
          this.documentsTable.renderRows();
        });
      }
    });
  }

}
