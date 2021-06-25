/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
 
/** Custom Dialogs */
import { UnassignStaffDialogComponent } from './custom-dialogs/unassign-staff-dialog/unassign-staff-dialog.component';
import { UploadSignatureDialogComponent } from './custom-dialogs/upload-signature-dialog/upload-signature-dialog.component';
import { ViewSignatureDialogComponent } from './custom-dialogs/view-signature-dialog/view-signature-dialog.component';
import { DeleteSignatureDialogComponent } from './custom-dialogs/delete-signature-dialog/delete-signature-dialog.component';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { UploadImageDialogComponent } from './custom-dialogs/upload-image-dialog/upload-image-dialog.component';
import { CaptureImageDialogComponent } from './custom-dialogs/capture-image-dialog/capture-image-dialog.component';
/** Custom Services */
import { ClientsService } from '../clients.service';
import { TransactionHistoryDialogComponent } from 'app/transactions/rollTerm-schedule-transaction/dialog/transaction-history/transaction-history-dialog.component';
import template_hdctv from "./template-contract/atom_hdctv";
import template_hddvtv from "./template-contract/atom_hddvtv";
import * as moment from 'moment';
@Component({
  selector: 'mifosx-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.scss']
})
export class ClientsViewComponent implements OnInit {

  clientViewData: any;
  clientDatatables: any;
  clientImage: any;
  clientTemplateData: any;
  showViewClient: boolean = false;
  typeViewClient: string;
  isInterchangeClient: boolean = false

  constructor(private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog) {
    this.route.data.subscribe((data: {
      clientViewData: any,
      clientTemplateData: any,
      clientDatatables: any
    }) => {
      this.clientViewData = data.clientViewData.result.clientInfo;
      // this.clientViewData = data.clientViewData;
      this.clientDatatables = data.clientDatatables ? data.clientDatatables : {};
      this.clientTemplateData = data.clientTemplateData ? data.clientTemplateData : {};
    });
  }

  ngOnInit() {
    this.route.queryParamMap
      .subscribe((params) => {
        this.typeViewClient = params.get("typeViewClient");
        // this.showViewClient = (this.typeViewClient == 'transaction');
        if (params.get("clientType") == 'ic') {
          this.isInterchangeClient = true
        }
      });
    this.clientsService.getClientProfileImage(this.clientViewData.id).subscribe(
      (base64Image: any) => {
        this.clientImage = this._sanitizer.bypassSecurityTrustResourceUrl(base64Image);
      }, (error: any) => { }
    );


  }
  showHistoryTransaction(clientId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      clientId: clientId,
    };
    dialogConfig.minWidth = 800;
    this.dialog.open(TransactionHistoryDialogComponent, dialogConfig);
  }
  /**
   * Performs action button/option action.
   * @param {string} name action name.
   */
  doAction(name: string) {
    switch (name) {
      case 'Assign Staff':
      case 'Close':
      case 'Survey':
      case 'Reject':
      case 'Activate':
      case 'Withdraw':
      case 'Update Default Savings':
      case 'Transfer Client':
      case 'Undo Transfer':
      case 'Accept Transfer':
      case 'Reject Transfer':
      case 'Reactivate':
      case 'Undo Rejection':
      case 'Add Charge':
      case 'Create Self Service User':
      case 'Client Screen Reports':
        this.router.navigate([`actions/${name}`], { relativeTo: this.route });
        break;
      case 'Unassign Staff':
        this.unassignStaff();
        break;
      case 'Delete':
        this.deleteClient();
        break;
      case 'View Signature':
        this.viewSignature();
        break;
      case 'Upload Signature':
        this.uploadSignature();
        break;
      case 'Delete Signature':
        this.deleteSignature();
        break;
      case 'Capture Image':
        this.captureProfileImage();
        break;
      case 'Upload Image':
        this.uploadProfileImage();
        break;
      case 'Delete Image':
        this.deleteProfileImage();
        break;
      case 'Create Standing Instructions':
        const createStandingInstructionsQueryParams: any = { officeId: this.clientViewData.officeId, accountType: 'fromsavings' };
        this.router.navigate(['standing-instructions/create-standing-instructions'], { relativeTo: this.route, queryParams: createStandingInstructionsQueryParams });
        break;
      case 'View Standing Instructions':
        const viewStandingInstructionsQueryParams: any = { officeId: this.clientViewData.officeId, accountType: 'fromsavings' };
        this.router.navigate(['standing-instructions/list-standing-instructions'], { relativeTo: this.route, queryParams: viewStandingInstructionsQueryParams });
        break;
      case 'exportContract':
        this.exportContract();
        break;  
        
    }
  }

  private printComponent() {
     
    //const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    const WindowPrt = this.popupwindow('','',1024, 900);
    
    

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = String(today.getFullYear());
    var CMND = '';
    var EMAIL = '';
    if(this.clientViewData.externalId){
      CMND = this.clientViewData.externalId;
    }
    if(this.clientViewData.emailAddress){
      EMAIL = this.clientViewData.emailAddress;
    }
    
    var html = template_hddvtv.replace('[DATE]', dd).replace('[MONTH]', mm).replace('[YEAR]', yyyy)
              .replace('[DISPLAYNAME]',this.clientViewData.displayName).replace('[CMND]', CMND )
              .replace('[EMAIL]',EMAIL).replace('[PHONE]',this.clientViewData.mobileNo); 

    WindowPrt.document.write(html);
    //WindowPrt.document.close();
    //WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  private popupwindow(url:string, title:string, w:number, h:number) {
    var y = window.outerHeight / 2 + window.screenY - ( h / 2)
    var x = window.outerWidth / 2 + window.screenX - ( w / 2)
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
  } 


  private exportContract() {
      
    // console.log (template_hdctv);
    // const doc = new jsPDF();
    // doc.html(template_hdctv,{
    //   callback: function (doc) {
    //     doc.save();
    //   },
    //   x: 10,
    //   y: 10
    // });
    //doc.save('tableToPdf.pdf');
 
    //const d = new Printd()
    //d.print( template_hdctv)
    
  }

  /**
   * Refetches data for the component
   * TODO: Replace by a custom reload component instead of hard-coded back-routing.
   */
  reload() {
    // const url: string = this.router.url;
    this.router.navigateByUrl(`/`, { skipLocationChange: true })
      .then(() =>  {
        // this.router.navigate([url]);
        this.router.navigate([`/clients/${this.clientViewData.id}/identities`], {queryParams: {typeViewClient: this.typeViewClient}})
      });
  }

  /**
   * Deletes the client
   */
  private deleteClient() {
    const deleteClientDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `client with id: ${this.clientViewData.id}` }
    });
    deleteClientDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.clientsService.deleteClient(this.clientViewData.id).subscribe(() => {
          this.router.navigate(['/clients'], { relativeTo: this.route });
        });
      }
    });
  }

  /**
   * Unassign's the client's staff.
   */
  private unassignStaff() {

    const unAssignStaffDialogRef = this.dialog.open(UnassignStaffDialogComponent);
    unAssignStaffDialogRef.afterClosed().subscribe((response: { confirm: any }) => {
      if (response.confirm) {
        this.clientsService.executeClientCommand(this.clientViewData.id, 'unassignStaff', { staffId: this.clientViewData.staffId })
          .subscribe(() => {
            this.reload();
          });
      }
    });
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

  /**
   * Captures clients profile image.
   */
  private captureProfileImage() {
    const captureImageDialogRef = this.dialog.open(CaptureImageDialogComponent);
    captureImageDialogRef.afterClosed().subscribe((imageURL: string) => {
      if (imageURL) {
        this.clientsService.uploadCapturedClientProfileImage(this.clientViewData.id, imageURL)
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

  /**
   * Uploads the clients image.
   */
  private uploadProfileImage() {
    const uploadImageDialogRef = this.dialog.open(UploadImageDialogComponent);
    uploadImageDialogRef.afterClosed().subscribe((image: File) => {
      if (image) {
        this.clientsService.uploadClientProfileImage(this.clientViewData.id, image)
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

  /**
   * Deletes the client image.
   */
  private deleteProfileImage() {
    const deleteClientImageDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `the profile image of ${this.clientViewData.displayName}` }
    });
    deleteClientImageDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.clientsService.deleteClientProfileImage(this.clientViewData.id)
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

}
