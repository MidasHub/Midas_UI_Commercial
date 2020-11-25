import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddFeeDialogComponent} from '../../dialog/add-fee-dialog/add-fee-dialog.component';
import {AddRowCreateBatchTransactionComponent} from '../../dialog/add-row-create-batch-transaction/add-row-create-batch-transaction.component';
import {CreateCardBatchTransactionComponent} from '../../dialog/create-card-batch-transaction/create-card-batch-transaction.component';
import {TransactionService} from '../../transaction.service';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {AlertService} from '../../../core/alert/alert.service';
import {AuthenticationService} from '../../../core/authentication/authentication.service';
import {GroupsService} from '../../../groups/groups.service';

@Component({
  selector: 'midas-create-batch-transaction',
  templateUrl: './create-batch-transaction.component.html',
  styleUrls: ['./create-batch-transaction.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '100px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateBatchTransactionComponent implements OnInit {
  dataSource: any[] = [];
  formFilter: FormGroup;
  displayedColumns: any[] = ['clientName', 'productId', 'rate',
    'amount', 'terminalId', 'requestAmount', 'amountTransaction',
    'fee', 'CM', 'batchNo', 'tid', 'terminalAmount', 'actions'
  ];
  expandedElement: any;
  accountFilter: any[] = [];
  accountsShow: any[] = [];
  members: any[] = [];
  group: any;
  defaultData: any = {
    clientId: '',
    clientName: '',
    groupId: '',
    officeId: '', // webStorage.get('sessionData').officeId,
    fromClientId: '', // webStorage.get('sessionData').userId,
    parentOfficeId: 0,
    toClientId: '', // id
    toAccountId: 0,
    customerName: '', // name
    // identitydocuments: [],
    identitydocumentsId: '', // identifierId
    documentId: '', // documentId
    amount: 0,
    terminalAmount: 0,
    amountTransaction: 0,
    requestAmount: 0,
    rate: '', // scope.getFeeByCardAndType(identifierId, 'CA01'),
    fee: 0,
    productId: 'CA01',
    batchTxnName: '', // scope.batchTxnName,
    bookingTxnDailyId: '', // scope.bookingId,
    // <!-- add fee real paid -->

    feeCP: 0,
    feePNL: 0,
    minRate: 0,
    maxRate: 0,
    cogsRate: 0,
    pnlRate: 0,
    terminalList: [],
    terminalId: null,
    tid: null,
    mid: null,
    batchNo: null,
    refNo: null,
    appCode: null,
    bills: null,
    bookingId: null,
    campaignId: null,
    transactionId: null,
    transactionRefNo: null,
    saveFlag: 0,
    ext5: null,
  };
  currentUser: any;
  feeGroup: any;

  constructor(private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private transactionServices: TransactionService,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private groupServices: GroupsService
  ) {

    this.formFilter = this.formBuilder.group({
      'member': ['']
    });
    // getTransactionGroupFee
    this.route.data.subscribe((data: any) => {
      this.group = data.membersInGroup?.result?.listMemberGroup;
    });
  }

  getFee(panNumber: string, productId: string): number {
    if (!this.feeGroup) {
      return 2.0;
    }
    const card = this.feeGroup.find((v: any) => String(panNumber).startsWith(v.cardBeginDigit));
    if (card) {
      switch (productId) {
        case 'CA01':
          return card?.minValue;
        case 'AL01':
          return card?.maxValue;
        default:
          return 2.0;
      }
    }
    return 2.0;
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    this.transactionServices.getMembersAvailableGroup(this.group.id).subscribe(data => {
      this.members = data?.result?.listMemberGroupWithIdentifier;
    });
    this.transactionServices.getTransactionGroupFee(this.group.id).subscribe(data => {
      this.feeGroup = data?.result.listFeeGroup;
    });
    this.groupServices.getGroupData(this.group.id).subscribe(data => {
      console.log(data);
    });
    this.defaultData.groupId = this.group.id;
    this.defaultData.fromClientId = this.currentUser.userId;
    this.defaultData.officeId = this.currentUser.officeId;
    // this.transactionServices.getMembersInGroup()
    // this.formFilter.get('member').valueChanges.subscribe(result => {
    //   console.log(result);
    // });
  }

  addRow() {
    const member = this.formFilter.get('member').value;
    if (!member) {
      return this.formFilter.markAllAsTouched();
    }
    console.log({member});
    // this.checkValidTransaction(member.clientId);
    const resultCard = this.checkCard(member.clientId, member.documentId);
    console.log(resultCard);
    if (resultCard) {
      const batchTransaction = {
        ...this.defaultData,
        identitydocumentsId: member.identifierId,
        customerName: member.fullName,
        clientId: member.clientId,
        toClientId: member.clientId,
        clientName: member.fullName,
        documentId: member.documentId,
        rate: this.getFee(member.identifierId, 'CA01')
      };
      this.dataSource = [...this.dataSource, batchTransaction];
      console.log(this.dataSource);
    }
  }

  checkCard(userId: string, userIdentifyId: string): any {
    return this.transactionServices.checkExtraCardInfo(userId, userIdentifyId).subscribe(result => {
      if (result?.result && result?.result?.isHaveExtraCardInfo) {
        let {expiredDate} = result?.result?.cardExtraInfoEntity;
        expiredDate = new Date(expiredDate);
        const now = new Date();
        if (expiredDate.getFullYear() > now.getFullYear()) {

        } else {
          if (expiredDate.getFullYear() === now.getFullYear()) {
            if (expiredDate.getMonth() > now.getMonth()) {
              if (expiredDate.getMonth() === now.getMonth() + 1) {
                this.alertService.alert({
                  message: 'CHÚ Ý: Thẻ sẽ hết hạn vào tháng sau, đây là lần cuối cùng được thực hiện giao dịch trên thẻ này',
                  msgClass: 'cssWarning'
                });
              }
            }
            if (expiredDate.getMonth() === now.getMonth()) {
              this.alertService.alert({
                message: 'CẢNH BÁO: Thẻ sẽ hết hạn trong tháng này, cân nhắc khi thực hiện giao dịch trên thẻ này',
                msgClass: 'cssWarning'
              });
            }
            if (expiredDate.getMonth() < now.getMonth()) {
              this.alertService.alert({
                message: 'CẢNH BÁO: Thẻ đã hết hạn, không được thực hiện giao dịch trên thẻ này',
                msgClass: 'cssWarning'
              });
            }
          }
        }
        return result?.result;
      }
      return false;
    });
  }

  checkValidTransaction(clientId: string) {
    return this.transactionServices.checkValidTransactionBtach(clientId).subscribe(result => {
      console.log(result);
    });
  }

  sortData(sort: any) {
    this.accountFilter = this.accountFilter.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const key = sort.active;
      return this.compare(a[key], b[key], isAsc);
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // addRow() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = {};
  //   // dialogConfig.minWidth = 400;
  //   const dialog = this.dialog.open(AddRowCreateBatchTransactionComponent, dialogConfig);
  //   dialog.afterClosed().subscribe(data => {
  //     if (data && data.status) {
  //     }
  //   });
  // }

  addCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(CreateCardBatchTransactionComponent, dialogConfig);
    dialog.afterClosed().subscribe(data => {
      if (data && data.status) {
      }
    });
  }
}
