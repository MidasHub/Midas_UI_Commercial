import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ClientsService} from '../../../clients/clients.service';
import {TransactionService} from '../../transaction.service';
import {BankService} from '../../../services/bank.service';

@Component({
  selector: 'midas-create-card-batch-transaction',
  templateUrl: './create-card-batch-transaction.component.html',
  styleUrls: ['./create-card-batch-transaction.component.scss']
})
export class CreateCardBatchTransactionComponent implements OnInit {
  formDialog: FormGroup;
  clients: any[] = [];
  banks: any[] = [];
  typeCards: any[] = [];
  documents: any[] = [];
  existBin: any;

  constructor(public dialogRef: MatDialogRef<CreateCardBatchTransactionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private transactionService: TransactionService,
              private bankService: BankService) {
    console.log({data: this.data});
    this.formDialog = this.formBuilder.group({
      'memberAddIdentifier': [''],
      'documentClientIdentifierType': [''],
      'documentClientIdentifierDescription': [''],
      'documentClientIdentifierKey': [''],
      'documentCardBankClientIdentifierKey': [''],
      'documentCardTypeClientIdentifierKey': ['']
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
    this.formDialog.get('documentClientIdentifierKey').valueChanges.subscribe((value: any) => {
      if (value.length === 16) {
        const typeDocument = this.formDialog.get('documentClientIdentifierType').value;
        const type = this.documents.find(v => v.id === typeDocument);
        if (type && Number(type.id) >= 38 && Number(type.id) <= 57) {
          this.bankService.getInfoBinCode(value).subscribe((res: any) => {
            console.log(res);
            if (res.status === '200') {
              if (res?.result?.existBin) {
                const {bankCode, cardType} = res?.result?.bankBinCode;
                this.existBin = res?.result?.existBin;
                this.formDialog.get('documentCardBankClientIdentifierKey').setValue(bankCode);
                this.formDialog.get('documentCardTypeClientIdentifierKey').setValue(cardType);
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

  }

}
