/** Angular Imports */
import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatTable} from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

/** Custom Models */
import {FormfieldBase} from 'app/shared/form-dialog/formfield/model/formfield-base';
import {InputBase} from 'app/shared/form-dialog/formfield/model/input-base';
import {SelectBase} from 'app/shared/form-dialog/formfield/model/select-base';

/** Custom Components */
import {UploadDocumentDialogComponent} from '../custom-dialogs/upload-document-dialog/upload-document-dialog.component';
import {DeleteDialogComponent} from '../../../shared/delete-dialog/delete-dialog.component';
import {FormDialogComponent} from 'app/shared/form-dialog/form-dialog.component';
import {AddIdentitiesComponent} from './add-identities/add-identities.component';
/** Custom Services */
import {ClientsService} from '../../clients.service';
import {BankService} from '../../../services/bank.service';

/**
 * Identities Tab Component
 */
@Component({
  selector: 'mifosx-identities-tab',
  templateUrl: './identities-tab.component.html',
  styleUrls: ['./identities-tab.component.scss']
})
export class IdentitiesTabComponent {

  /** Client Identities */
  clientIdentities: any;
  /** Client Identifier Template */
  clientIdentifierTemplate: any;
  /** Client Id */
  clientId: string;
  /** Identities Columns */
  identitiesColumns: string[] = ['id', 'description', 'type', 'documents', 'status', 'actions'];

  /** Identifiers Table */
  @ViewChild('identifiersTable', {static: true}) identifiersTable: MatTable<Element>;

  // @ViewChild('')
  /**
   * @param {ActivatedRoute} route Activated Route
   * @param {MatDialog} dialog Mat Dialog
   * @param {ClientsService} clientService Clients Service
   */
  constructor(private route: ActivatedRoute,
              public dialog: MatDialog,
              private clientService: ClientsService,
              private bankService: BankService,) {
    this.clientId = this.route.parent.snapshot.paramMap.get('clientId');
    this.route.data.subscribe((data: { clientIdentities: any, clientIdentifierTemplate: any }) => {
      this.clientIdentities = data.clientIdentities;
      this.clientIdentifierTemplate = data.clientIdentifierTemplate;
    });
  }

  /**
   * Download Client Document
   * @param {string} parentEntityId Parent Entity Id
   * @param {string} documentId Document ID
   */
  download(parentEntityId: string, documentId: string) {
    this.clientService.downloadClientIdentificationDocument(parentEntityId, documentId).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      window.open(url);
    });
  }

  /**
   * Add Client Identifier
   */
  addIdentifier() {
    // const formfields: FormfieldBase[] = [
    //   new SelectBase({
    //     controlName: 'documentTypeId',
    //     label: 'Document Type',
    //     value: '',
    //     options: {label: 'name', value: 'id', data: this.clientIdentifierTemplate.allowedDocumentTypes},
    //     required: true,
    //     order: 1
    //   }),
    //   new InputBase({
    //     controlName: 'documentCardBank',
    //     label: 'Chọn bank account',
    //     value: '',
    //     type: 'text',
    //     order: 2
    //   }),
    //   new SelectBase({
    //     controlName: 'status',
    //     label: 'Status',
    //     value: '2',
    //     options: {label: 'value', value: 'value', data: [{value: 'Active'}, {value: 'Inactive'}]},
    //     required: true,
    //     order: 3
    //   }),
    //   new InputBase({
    //     controlName: 'documentKey',
    //     label: 'Unique Id',
    //     value: '',
    //     type: 'text',
    //     required: true,
    //     order: 4
    //   }),
    //   new InputBase({
    //     controlName: 'description',
    //     label: 'Description',
    //     value: '',
    //     type: 'text',
    //     order: 5
    //   })
    // ];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'Add Client Identifier',
      clientIdentifierTemplate: this.clientIdentifierTemplate
    };
    dialogConfig.minWidth = 400;
    const addIdentifierDialogRef = this.dialog.open(AddIdentitiesComponent, dialogConfig);
    addIdentifierDialogRef.afterClosed().subscribe((response: any) => {
      console.log(response);
      if (response.data) {
        let {description} = response.data.value;
        const {documentCardBank, documentCardType, documentKey, documentTypeId, dueDay, expiredDate, status} = response.data.value;
        const documentTypes = response.documentTypes;
        const document = documentTypes.find((v: any) => v.id === documentTypeId);
        if (document && ((document.name.indexOf('CC') !== -1 && document.name !== 'CCCD') || document.name === 'Credit Card')) {
          if (!response.existBin) {
            // this.bankService.storeInfoBinCode({
            //   cardType: documentCardType,
            //   bankCode: documentCardBank,
            //   binCode: documentKey
            // });
          }
          description = `${documentCardBank}-${documentCardType}-${description}`;
        }
        this.clientService.addClientIdentifier(this.clientId, {
          documentKey,
          documentTypeId,
          status,
          description
        }).subscribe((res: any) => {
          const call_return = () => {
            this.clientIdentities.push({
              id: res.resourceId,
              description: response.data.value.description,
              documentType: this.clientIdentifierTemplate.allowedDocumentTypes.filter((doc: any) => (doc.id === response.data.value.documentTypeId))[0],
              documentKey: response.data.value.documentKey,
              documents: [],
              clientId: this.clientId,
              status: (response.data.value.status === 'Active' ? 'clientIdentifierStatusType.active' : 'clientIdentifierStatusType.inactive')
            });
            this.identifiersTable.renderRows();
          };
          if (document && ((document.name.indexOf('CC') !== -1 && document.name !== 'CCCD') || document.name === 'Credit Card')) {
            this.clientService.getClientData(this.clientId).subscribe((client: any) => {
              this.bankService.storeExtraCardInfo({
                'userId': this.clientId,
                'userIdentifyId': res.resourceId,
                'clientName': client.displayName,
                'cardNumber': `${documentKey.slice(0, 6)}-XXX-XXX-${documentKey.slice(12, 16)}`,
                'mobileNo': client.mobileNo,
                'dueDay': dueDay,
                'expireDate': expiredDate,
              }).subscribe((res2: any) => {
                return call_return();
              });
            });
          } else {
            return call_return();
          }
        });
      }
    });
  }

  /**
   * Delete Client Identifier
   * @param {string} clientId Client Id
   * @param {string} identifierId Identifier Id
   * @param {number} index Index
   */
  deleteIdentifier(clientId: string, identifierId: string, index: number) {
    const deleteIdentifierDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {deleteContext: `identifier id:${identifierId}`}
    });
    deleteIdentifierDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.clientService.deleteClientIdentifier(clientId, identifierId).subscribe(res => {
          this.clientIdentities.splice(index, 1);
          this.identifiersTable.renderRows();
        });
      }
    });
  }

  /**
   * Upload Document
   * @param {number} index Index
   * @param {string} identifierId Identifier Id
   */
  uploadDocument(index: number, identifierId: string) {
    const uploadDocumentDialogRef = this.dialog.open(UploadDocumentDialogComponent, {
      data: {documentIdentifier: true}
    });
    uploadDocumentDialogRef.afterClosed().subscribe((dialogResponse: any) => {
      if (dialogResponse) {
        const formData: FormData = new FormData;
        formData.append('name', dialogResponse.fileName);
        formData.append('file', dialogResponse.file);
        this.clientService.uploadClientIdentifierDocument(identifierId, formData).subscribe((res: any) => {
          this.clientIdentities[index].documents.push({
            id: res.resourceId,
            parentEntityType: 'client_identifiers',
            parentEntityId: identifierId,
            name: dialogResponse.fileName,
            fileName: dialogResponse.file.name
          });
          this.identifiersTable.renderRows();
        });
      }
    });
  }

}
