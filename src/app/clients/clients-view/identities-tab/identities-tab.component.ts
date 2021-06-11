/** Angular Imports */
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

/** Custom Models */
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { SelectBase } from 'app/shared/form-dialog/formfield/model/select-base';

/** Custom Components */
import { UploadDocumentDialogComponent } from '../custom-dialogs/upload-document-dialog/upload-document-dialog.component';
import { DeleteDialogComponent } from '../../../shared/delete-dialog/delete-dialog.component';
import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';
import { AddIdentitiesComponent } from './add-identities/add-identities.component';
/** Custom Services */
import { ClientsService } from '../../clients.service';
import { TransactionService } from '../../../transactions/transaction.service';
import { AlertService } from 'app/core/alert/alert.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AddIdentitiesExtraInfoComponent } from './dialog-add-identities-extra-info/add-identities-extra-info.component';
import { BanksService } from '../../../banks/banks.service';

import {animate, state, style, transition, trigger} from '@angular/animations';
import { Logger } from "app/core/logger/logger.service";
import { ConfirmDialogComponent } from "app/transactions/dialog/confirm-dialog/confirm-dialog.component";
const log = new Logger("-IDENTIFIER TAB-");

/**
 * Identities Tab Component
 */
@Component({
  selector: 'mifosx-identities-tab',
  templateUrl: './identities-tab.component.html',
  styleUrls: ['./identities-tab.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '100px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class IdentitiesTabComponent {
  isLoading = false;
  isShow = false;
  searchKey: string;
  expandedElement: any;
  /** Client Identities */
  clientIdentities: any = [];
  clientIdentitiesOther: any = [];
  /** Client Identifier Template */
  clientIdentifierTemplate: any;
  /** Client Id */
  clientId: string;
  images: any[] = [];
  /** Identities Columns */
  // identitiesColumns: string[] = ['id', 'documentKey', 'description', 'type', 'documents', 'status', 'actions'];
  identitiesColumns: string[] = [ 'documentKey', 'description',   'status', 'actions'];
  identitiesOtherColumns: string[] = [ 'documentKey', 'description', 'type', 'documents', 'status'];

  /** Identifiers Table */
  @ViewChild('identifiersTable', { static: true }) identifiersTable: MatTable<Element>;
  @ViewChild('identifiersTableOther', { static: true }) identifiersTableOther: MatTable<Element>;

  // @ViewChild('')
  /**
   * @param {ActivatedRoute} route Activated Route
   * @param {MatDialog} dialog Mat Dialog
   * @param {ClientsService} clientService Clients Service
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private clientService: ClientsService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private bankService: BanksService
  ) {
    this.clientId = this.route.parent.snapshot.paramMap.get('clientId');
    this.route.data.subscribe((data: { clientIdentities: any; clientIdentifierTemplate: any }) => {
      this.clientIdentifierTemplate = data.clientIdentifierTemplate;
      data.clientIdentities.forEach((element: any) => {
        if (element.documentType.id >= 38 && element.documentType.id <= 57) {
          this.clientIdentities.push(element);
        } else {
          this.clientIdentitiesOther.push(element);
          if (element.documentType.name === 'CMND') {
            this.images.push(element);
          }
        }
      });
    });
  }

  /**
   * Download Client Document
   * @param {string} parentEntityId Parent Entity Id
   * @param {string} documentId Document ID
   */
  download(parentEntityId: string, documentId: string) {
    this.clientService.downloadClientIdentificationDocument(parentEntityId, documentId).subscribe((res) => {
      const url = window.URL.createObjectURL(res);
      window.open(url);
    });
  }

  routeToMakeTransaction(identifierId: string, type: string, cardNumber: string) {
    this.transactionService.checkValidRetailCashTransaction(this.clientId).subscribe((res: any) => {
      if (res.result.message) {
        this.alertService.alert({
          message: res.result.message,
          msgClass: 'cssWarning',
          hPosition: 'right',
          vPosition: 'bottom',
        });
      }

      if (res.result.isValid) {
        this.transactionService.checkExtraCardInfo(this.clientId, identifierId).subscribe((resExtraCardCheck: any) => {
          const checkResult = resExtraCardCheck.result;

          if (checkResult.isHaveExtraCardInfo) {
            const dateExpired = new Date(checkResult.cardExtraInfoEntity.expiredDate);
            const yExpired = dateExpired.getFullYear();
            const mExpired = dateExpired.getMonth();

            const dateSystem = new Date();
            const ySystem = dateSystem.getFullYear();
            const mSystem = dateSystem.getMonth();

            // let isValidCard = false;

            if (yExpired > ySystem) {
              // isValidCard = true;
            } else {
              if (yExpired === ySystem) {
                if (mExpired > mSystem) {
                  if (mExpired === mSystem + 1) {
                    this.alertService.alert({
                      message:
                        'CHÚ Ý: Thẻ sẽ hết hạn vào tháng sau, đây là lần cuối cùng được thực hiện giao dịch trên thẻ này',
                      msgClass: 'cssWarning',
                      hPosition: 'right',
                      vPosition: 'bottom',
                    });
                  }
                }
                if (mExpired === mSystem) {
                  this.alertService.alert({
                    message: 'CẢNH BÁO: Thẻ sẽ hết hạn trong tháng này, cân nhắc khi thực hiện giao dịch trên thẻ này',
                    msgClass: 'cssDanger',
                    hPosition: 'center',
                    vPosition: 'bottom',
                  });
                }
                if (mExpired < mSystem) {
                  this.alertService.alert({
                    message: 'CẢNH BÁO: Thẻ đã hết hạn, không được thực hiện giao dịch trên thẻ này',
                    msgClass: 'cssDanger',
                    hPosition: 'center',
                    vPosition: 'top',
                  });
                }
              }
            }

            let validRollTerm = true;
            if (type !== 'cash') {
              this.transactionService
                .checkValidCreateRollTermTransaction(identifierId)
                .subscribe((resRollTermCheck: any) => {
                  validRollTerm = resRollTermCheck.result.isValid;

                  if (validRollTerm) {
                    this.router.navigate(['/transaction/create'], {
                      queryParams: {
                        clientId: this.clientId,
                        identifierId: identifierId,
                        type: type,
                      },
                    });
                  } else {
                    this.alertService.alert({
                      message: `CẢNH BÁO: Đã tồn tại khoản Advance với thẻ ${cardNumber} \n vui lòng tất toán trước khi thực hiện khởi tạo khoản Advance mới !`,
                      msgClass: 'cssDanger',
                      hPosition: 'center',
                      vPosition: 'top',
                    });
                  }
                });
            } else {
              this.router.navigate(['/transaction/create'], {
                queryParams: {
                  clientId: this.clientId,
                  identifierId: identifierId,
                  type: type,
                },
              });
            }
          } else {
            this.addIdentifierExtraInfo(identifierId, cardNumber);
          }
        });
      }
    });
  }

  /**
   * Add Client Identifier
   */
  addIdentifier(addOther: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'Thêm Thẻ | CMND/CCCD | TK bank',
      addOther: addOther,
      clientIdentifierTemplate: this.clientIdentifierTemplate,
    };

    dialogConfig.minWidth = '33rem';
    // init data for opening
    const addIdentifierDialogRef = this.dialog.open(AddIdentitiesComponent, dialogConfig);

    // Call API after close dialog box
    addIdentifierDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        let { description } = response.data.value;
        const {
          documentCardBank,
          documentCardType,
          documentKey,
          documentTypeId,
          dueDay,
          expiredDate,
          status,
          limitCard,
          classCard,
        } = response.data.value;
        const documentTypes = response.documentTypes;
        const document = documentTypes.find((v: any) => v.id === documentTypeId);
        if (document && Number(document.id) >= 38 && Number(document.id) <= 57) {
          if (!response.existBin) {
          }
          description = `${documentCardBank}-${documentCardType}-${description}`;
        }
        this.clientService
          .addClientIdentifier(this.clientId, {
            documentKey,
            documentTypeId,
            status,
            description,
          })
          .subscribe((res: any) => {
            const call_return = () => {
              if (addOther) {
                this.clientIdentitiesOther.push({
                  id: res.resourceId,
                  description: response.data.value.description,
                  documentType: this.clientIdentifierTemplate.allowedDocumentTypes.filter(
                    (doc: any) => doc.id === response.data.value.documentTypeId
                  )[0],
                  documentKey: response.data.value.documentKey,
                  documents: [],
                  clientId: this.clientId,
                  status:
                    response.data.value.status === 'Active'
                      ? 'clientIdentifierStatusType.active'
                      : 'clientIdentifierStatusType.inactive',
                });
                this.identifiersTableOther.renderRows();
              } else {
                this.clientIdentities.push({
                  id: res.resourceId,
                  description: `${response.data.value.documentCardBank}-${response.data.value.documentCardType}-${response.data.value.description}`,
                  documentType: this.clientIdentifierTemplate.allowedDocumentTypes.filter(
                    (doc: any) => doc.id === response.data.value.documentTypeId
                  )[0],
                  documentKey: `${response.data.value.documentKey.substring(0, 6)}-X-
                    ${response.data.value.documentKey.substring(
                      response.data.value.documentKey.length - 4,
                      response.data.value.documentKey.length
                    )}`,
                  // documents: [],
                  clientId: this.clientId,
                  status:
                    response.data.value.status === 'Active'
                      ? 'clientIdentifierStatusType.active'
                      : 'clientIdentifierStatusType.inactive',
                });
                this.identifiersTable.renderRows();
              }

              const message = `Thực hiện thành công!`;
              this.alertService.alert({ message: message, msgClass: 'cssInfo' });
            };

            if (document && Number(document.id) >= 38 && Number(document.id) <= 57) {
              this.bankService
                .storeExtraCardInfo({
                  userId: this.clientId,
                  userIdentifyId: res.resourceId,
                  dueDay: dueDay,
                  expireDate: expiredDate,
                  limitCard: limitCard,
                  classCard: classCard,
                })
                .subscribe((res2: any) => {
                  return call_return();
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
  deleteIdentifier(clientId: string, identifierId: string, index: number, addOther: boolean) {
    const deleteIdentifierDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `identifier id:${identifierId}` },
    });
    deleteIdentifierDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.clientService.deleteClientIdentifier(clientId, identifierId).subscribe((res) => {
          if (addOther) {
            this.clientIdentitiesOther.splice(index, 1);

            this.identifiersTableOther.renderRows();
          } else {
            this.clientIdentities.splice(index, 1);
            this.identifiersTable.renderRows();
          }
        });
      }
    });
  }

  /**
   * Upload Document
   * @param {number} index Index
   * @param {string} identifierId Identifier Id
   */
  uploadDocument(index: number, identifierId: string, addOther: boolean) {
    const uploadDocumentDialogRef = this.dialog.open(UploadDocumentDialogComponent, {
      data: { documentIdentifier: true },
    });
    uploadDocumentDialogRef.afterClosed().subscribe((dialogResponse: any) => {
      if (dialogResponse) {
        const formData: FormData = new FormData();
        formData.append('name', dialogResponse.fileName);
        formData.append('file', dialogResponse.file);
        this.clientService.uploadClientIdentifierDocument(identifierId, formData).subscribe((res: any) => {
          if (addOther) {
            this.clientIdentitiesOther[index].documents.push({
              id: res.resourceId,
              parentEntityType: 'client_identifiers',
              parentEntityId: identifierId,
              name: dialogResponse.fileName,
              fileName: dialogResponse.file.name,
            });
            this.identifiersTableOther.renderRows();
          } else {
            this.clientIdentities[index].documents.push({
              id: res.resourceId,
              parentEntityType: 'client_identifiers',
              parentEntityId: identifierId,
              name: dialogResponse.fileName,
              fileName: dialogResponse.file.name,
            });
            this.identifiersTable.renderRows();
          }
        });
      }
    });
  }

  /**
   * Add Client Identifier
   */
  addIdentifierExtraInfo(userIdentifyId: string, cardNumber: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'Thông tin bổ sung cho thẻ',
      clientIdentifierTemplate: this.clientIdentifierTemplate,
    };
    dialogConfig.minWidth = 400;
    const addIdentifierDialogRef = this.dialog.open(AddIdentitiesExtraInfoComponent, dialogConfig);
    addIdentifierDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const { dueDay, expiredDate, limitCard, classCard } = response.data.value;

        this.bankService
          .storeExtraCardInfo({
            userId: this.clientId,
            userIdentifyId: userIdentifyId,
            dueDay: dueDay,
            expireDate: expiredDate,
            limitCard: limitCard,
            classCard: classCard,
          })
          .subscribe((res2: any) => {});
      }
    });
  }

  updateCardInfo(cardExtraInfoEntity: any) {
    this.isLoading = true;
    this.transactionService.updateCardInfo(cardExtraInfoEntity).subscribe((result) => {
      this.isLoading = false;
      const message = `Cập nhật thành công cho thẻ: ${cardExtraInfoEntity.refid} `;
      this.alertService.alert({ message: message, msgClass: 'cssInfo' });
    });
  }

  addEditExtraInfo(
    clientId: string,
    identifierId: string,
    cardNumber: string,
    index: number,
    addOther: boolean = false
  ) {
    log.debug('cardInfo: ', clientId, identifierId, cardNumber, index, addOther);
    // Jean : đang sửa tới đây
    this.transactionService.checkExtraCardInfo(this.clientId, identifierId).subscribe((resExtraCardCheck: any) => {
      const checkResult = resExtraCardCheck.result;

      if (checkResult.isHaveExtraCardInfo) {
        const dateExpired = new Date(checkResult.cardExtraInfoEntity.expiredDate);
        const yExpired = dateExpired.getFullYear();
        const mExpired = dateExpired.getMonth();

        const dateSystem = new Date();
        const ySystem = dateSystem.getFullYear();
        const mSystem = dateSystem.getMonth();
        const dialogConfig = new MatDialogConfig();

        /** Dialog box setup */
        dialogConfig.data = {
          title: 'Thông tin bổ sung cho thẻ',
          clientIdentifierTemplate: this.clientIdentifierTemplate,
          cardInfo: checkResult,
        };
        dialogConfig.minWidth = 400;

        if (yExpired > ySystem) {
          const showIdentifierDialogRef = this.dialog.open(AddIdentitiesExtraInfoComponent, dialogConfig);
          showIdentifierDialogRef.afterClosed().subscribe((response: any) => {
            if (response) {
              const { dueDay, expiredDate, limitCard, classCard } = response.data.value;
              checkResult.cardExtraInfoEntity.limit = limitCard;
              checkResult.cardExtraInfoEntity.classCard = classCard;
              checkResult.cardExtraInfoEntity.expiredDateString = expiredDate;
              checkResult.cardExtraInfoEntity.dueDay = dueDay;

              this.updateCardInfo(checkResult.cardExtraInfoEntity);
            }
          });
        } else {
          if (yExpired === ySystem) {
            if (mExpired > mSystem) {
              if (mExpired === mSystem + 1) {
                this.alertService.alert({
                  message:
                    'CHÚ Ý: Thẻ sẽ hết hạn vào tháng sau, đây là lần cuối cùng được thực hiện giao dịch trên thẻ này',
                  msgClass: 'cssWarning',
                  hPosition: 'right',
                  vPosition: 'bottom',
                });
              }
            }
            if (mExpired === mSystem) {
              this.alertService.alert({
                message: 'CẢNH BÁO: Thẻ sẽ hết hạn trong tháng này, cân nhắc khi thực hiện giao dịch trên thẻ này',
                msgClass: 'cssDanger',
                hPosition: 'center',
                vPosition: 'bottom',
              });
            }
            if (mExpired < mSystem) {
              this.alertService.alert({
                message: 'CẢNH BÁO: Thẻ đã hết hạn, không được thực hiện giao dịch trên thẻ này',
                msgClass: 'cssDanger',
                hPosition: 'center',
                vPosition: 'top',
              });
            }
          }
        }
      } else {
        this.addIdentifierExtraInfo(identifierId, cardNumber);
      }
    });
  }

  onToggleCardStatus(e: any, identifyId: string) {
    // this.clientService.updateStatusIdentify(identifyId, e.checked);
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Xác nhận ${e.checked ? 'giữ thẻ' : 'bỏ giữ thẻ'}`,
        title: "Trạng thái giữ thẻ",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.clientService.updateStatusIdentify(identifyId, e.checked).subscribe((res: any) => {
          if (res.result.Row_affected === 1) {
            this.alertService.alert({ message: "Thực hiện thành công", msgClass: "cssInfo" });
          }
        });
      } else {
        location.reload()
       }
    });
  }
}
