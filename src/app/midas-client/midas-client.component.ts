/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteSignatureDialogComponent } from 'app/clients/clients-view/custom-dialogs/delete-signature-dialog/delete-signature-dialog.component';
import { UploadSignatureDialogComponent } from 'app/clients/clients-view/custom-dialogs/upload-signature-dialog/upload-signature-dialog.component';
import { ViewSignatureDialogComponent } from 'app/clients/clients-view/custom-dialogs/view-signature-dialog/view-signature-dialog.component';
import { ClientsService } from 'app/clients/clients.service';

/**
 * midas-client Component.
 */
@Component({
  selector: 'mifosx-midas-client',
  templateUrl: './midas-client.component.html',
  styleUrls: ['./midas-client.component.scss']
})
export class MidasClientComponent implements OnInit {
  /** midas-client Data */
  clientViewData: any;
  clientIdentifierViewData: any;
  clientIdentifierTemplateData: any;
  profileData: any;
  dataSource: any[];
  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    public dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private router: Router,
    ) {
    this.route.data.subscribe((data: {
      midasClientViewResolver: any,
      midasClientIdentifierViewData: any,
      midasClientIdentifierTemplateData: any,

    }) => {
      this.clientViewData = data.midasClientViewResolver;
      this.clientIdentifierViewData = data.midasClientIdentifierViewData;
      this.clientIdentifierTemplateData = data.midasClientIdentifierTemplateData;

 });
  }

  ngOnInit() {

  }
  /**
   * Shows client signature in a dialog
   */
  private viewSignature() {
    this.clientsService.getClientDocuments(this.clientViewData.id).subscribe((documents: any) => {
      const viewSignatureDialogRef = this.dialog.open(ViewSignatureDialogComponent, {
        data: {
          documents: documents,
          id: this.clientViewData.id
        }
      });
      viewSignatureDialogRef.afterClosed().subscribe((response: any) => {
        if (response.upload) {
          this.uploadSignature();
        } else if (response.delete) {
          this.deleteSignature();
        }
      });
    });
  }

  reload() {
    const url: string = this.router.url;
    this.router.navigateByUrl(`/clients`, {skipLocationChange: true})
      .then(() => this.router.navigate([url]));
  }

  /**
   * Uploads client signature
   */
  private uploadSignature() {
    const uploadSignatureDialogRef = this.dialog.open(UploadSignatureDialogComponent);
    uploadSignatureDialogRef.afterClosed().subscribe((signature: File) => {
      if (signature) {
        this.clientsService.uploadClientSignatureImage(this.clientViewData.id, signature)
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

  /**
   * Deletes client signature
   */
  private deleteSignature() {
    this.clientsService.getClientDocuments(this.clientViewData.id).subscribe((documents: any) => {
      const deleteSignatureDialogRef = this.dialog.open(DeleteSignatureDialogComponent, {
        data: documents
      });
      deleteSignatureDialogRef.afterClosed().subscribe((response: any) => {
        if (response.delete) {
          this.clientsService.deleteClientDocument(this.clientViewData.id, response.id)
            .subscribe(() => {
              this.reload();
            });
        } else if (response.upload) {
          this.uploadSignature();
        }
      });
    });
  }



}
