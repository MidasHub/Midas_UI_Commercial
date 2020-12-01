import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ClientsService} from '../../../clients/clients.service';
import {TransactionService} from '../../transaction.service';
import {BankService} from '../../../services/bank.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AlertService} from '../../../core/alert/alert.service';

@Component({
  selector: 'midas-create-card-batch-transaction',
  templateUrl: './create-card-batch-transaction.component.html',
  styleUrls: ['./create-card-batch-transaction.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateCardBatchTransactionComponent implements OnInit {
  formDialog: FormGroup;
  clients: any[] = [];
  banks: any[] = [];
  typeCards: any[] = [];
  documents: any[] = [];
  existBin: any;
  documentAlreadyExits: any[] = [];
  newDocuments: any[] = [];
  displayedColumns: any[] = ['documentTypeId', 'documentKey', 'description'];
  expandedElement: any;

  getData() {
    return [...this.newDocuments, ...this.documentAlreadyExits];
  }

  constructor(public dialogRef: MatDialogRef<CreateCardBatchTransactionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private transactionService: TransactionService,
              private bankService: BankService,
              private alterService: AlertService) {
    console.log({data: this.data});
    this.formDialog = this.formBuilder.group({
      'clientId': [''],
      'documentTypeId': [''],
      'description': [''],
      'documentKey': [''],
      'bank': [''],
      'cardType': ['']
    });
    this.formDialog.get('clientId').valueChanges.subscribe(value => {
      this.transactionService.getIdentifierTypeCC(value).subscribe(result => {
        this.documentAlreadyExits = result?.result?.listIdentifier?.filter((v: any) => Number(v.documentType.id) >= 38 && Number(v.documentType.id) <= 57).map((v: any) => {
          return {
            documentTypeId: v.documentType?.id,
            documentKey: v.documentKey,
            description: v.description,
            exit: true
          };
        });
      });
    });
    this.transactionService.getDocumentTemplate().subscribe(result => {
      console.log(result);
      this.documents = result?.result?.documentTemplate?.allowedDocumentTypes?.filter((type: any) => Number(type.id) >= 38 && Number(type.id) <= 57);
    });
    this.bankService.getListBank().subscribe(result => {
      this.banks = result?.result?.listBank;
    });
    this.bankService.getListCardType().subscribe(result => {
      this.typeCards = result?.result?.listCardType;
    });
    this.formDialog.get('documentKey').valueChanges.subscribe((value: any) => {
      if (value && value?.length === 16) {
        const typeDocument = this.formDialog.get('documentTypeId').value;
        const type = this.documents.find(v => v.id === typeDocument);
        if (type && Number(type.id) >= 38 && Number(type.id) <= 57) {
          this.bankService.getInfoBinCode(value).subscribe((res: any) => {
            console.log(res);
            if (res.status === '200') {
              if (res?.result?.existBin) {
                const {bankCode, cardType} = res?.result?.bankBinCode;
                this.existBin = res?.result?.existBin;
                this.formDialog.get('bank').setValue(bankCode);
                this.formDialog.get('cardType').setValue(cardType);
              } else {
                this.existBin = false;
                alert('Đầu thẻ chưa tồn tại trong hệ thống, vui lòng chọn ngân hàng bên cạnh!');
              }
            }
          });
        }
      }

    });
    const {members} = data;
    this.clients = members;
  }

  ngOnInit(): void {
  }

  submitForm() {
    const list = JSON.stringify(this.newDocuments);
    this.transactionService.addIdentifierBatch(this.formDialog.get('clientId').value, list).subscribe(result => {
      console.log(result);
      if (Number(result?.status) === 200) {
        this.alterService.alert({message: 'Thêm thẻ thành công', msgClass: 'cssSuccess'});
        return this.dialogRef.close({status: true});
      } else {
        return this.alterService.alert({message: result?.result?.message?.errors[0]?.developerMessage, msgClass: 'cssWarning'});
      }
    });
  }

  addRow() {
    const form = this.formDialog.value;
    if (this.formDialog.invalid) {
      return this.formDialog.markAllAsTouched();
    }
    const bank = this.banks.find((v: any) => v.bankCode === form.bank);
    const typeCard = this.typeCards.find((v: any) => v.code === form.cardType);
    this.newDocuments = [{
      documentTypeId: form.documentTypeId,
      documentKey: form.documentKey,
      description: `${bank.bankName} - ${typeCard.description} - ${form.description || ''}`,
    }, ...this.newDocuments];
    this.formDialog.get('documentTypeId').setValue('');
    this.formDialog.get('documentKey').setValue('');
    this.formDialog.get('description').setValue('');
    this.formDialog.get('bank').setValue('');
    this.formDialog.get('cardType').setValue('');
  }

  getTypeDocument(id: number) {
    return this.documents.find((v: any) => v.id === id)?.name;
  }
}
