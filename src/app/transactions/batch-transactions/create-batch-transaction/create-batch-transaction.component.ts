import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {AddInformationCardBatchComponent} from '../../dialog/add-information-card-batch/add-information-card-batch.component';
import {AddIdentitiesExtraInfoComponent} from '../../../clients/clients-view/identities-tab/add-identities-extra-info/add-identities-extra-info.component';
import {ClientsService} from '../../../clients/clients.service';
import {debounce, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {Subject, timer} from 'rxjs';
import {ConfirmDialogComponent} from '../../dialog/coifrm-dialog/confirm-dialog.component';

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
  terminals: any[] = [];
  batchProducts: any[] = [{
    label: 'RTM',
    value: 'CA01'
  },
    {
      label: 'ĐHT',
      value: 'RTM'
    }];
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
    CM: false
  };
  currentUser: any;
  feeGroup: any;
  batchTxnName: any;
  bookingTxnDailyId: any;
  private destroy$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private transactionServices: TransactionService,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private groupServices: GroupsService,
              private clientsServices: ClientsService,
  ) {
    // @ts-ignore
    const {value} = this.route.queryParams;
    if (value) {
      const {batchTxnName, bookingTxnDailyId} = value;
      if (batchTxnName) {
        this.batchTxnName = batchTxnName;
        this.defaultData.batchTxnName = batchTxnName;
      }
      if (bookingTxnDailyId) {
        this.bookingTxnDailyId = bookingTxnDailyId;
        this.defaultData.bookingTxnDailyId = bookingTxnDailyId;
      }
    }
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

  generaForm(data: any) {
    const keys = Object.keys(data);
    const formData = {};
    for (const key of keys) {
      formData[key] = [data[key]];
    }
    const from = this.formBuilder.group(formData);
    from.get('CM').valueChanges.subscribe(value => {
      console.log(value);
      const terminalId = from.get('terminalId').value;
      if (!terminalId || terminalId === '--') {
        from.get('CM').setValue(false);
        return this.alertService.alert({
          message: 'Vui lòng chọn máy POS trước khi thưc hiện',
          msgClass: 'cssWarning'
        });
      }
    });
    // @ts-ignore
    from.data = {
      terminals: []
    };
    from.get('amount').valueChanges.pipe(
      debounce(() => timer(1000)),
      distinctUntilChanged(
        null,
        (event: any) => {
          return event;
        }
      ),
      takeUntil(this.destroy$),
    ).subscribe(value => {
      console.log(value);
      if (value && value > 0) {
        this.transactionServices.getListTerminalAvailable(value).subscribe(result => {
          // @ts-ignore
          from?.data.terminals = result?.result?.listTerminal;
          from.get('terminalId').setValidators([Validators.required]);
        });
      }
    });
    return from;
  }


  async addRow() {
    const member = this.formFilter.get('member').value;
    if (!member) {
      return this.formFilter.markAllAsTouched();
    }
    const checkValidTransaction1 = await this.checkValidTransaction(member.clientId);
    if (!checkValidTransaction1?.result?.isValid) {
      return this.alertService.alert({
        message: checkValidTransaction1?.result?.message,
        msgClass: 'cssWarning'
      });
    }
    const resultCard = await this.checkCard(member.clientId, member.documentId);
    if (resultCard) {
      this.clientsServices.getClientById(member.clientId).subscribe(result => {
        if (result) {
          const batchTransaction = {
            ...this.defaultData,
            identitydocumentsId: member.identifierId,
            customerName: member.fullName,
            clientId: member.clientId,
            toClientId: member.clientId,
            clientName: member.fullName,
            documentId: member.documentId,
            toAccountId: result?.result?.clientInfo?.savingsAccountId,
            rate: this.getFee(member.identifierId, 'CA01')
          };
          this.dataSource = [...this.dataSource, this.generaForm(batchTransaction)];
          console.log(this.dataSource);
        }
      });
    } else {
      this.addCardInformation(member);
    }
  }

  onSave(form: any) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Bạn chắc chắn muốn lưu giao dịch',
        title: 'Hoàn thành giao dịch'
      },
    });
    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.transactionServices.onSaveTransactionBatch(form.value).subscribe(result => {
          console.log(result);
          return this.alertService.alert({
            message: 'Giao dịch thành công',
            msgClass: 'cssSuccess'
          });
        });
      }
    });
  }

  checkCard(userId: string, userIdentifyId: string): Promise<any> {
    return new Promise<any>(async resolve => {
      await this.transactionServices.checkExtraCardInfo(userId, userIdentifyId).subscribe(result => {
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
          return resolve(result?.result);
        }
        return resolve(false);
      });
    });
  }

  checkValidTransaction(clientId: string): Promise<any> {
    return new Promise<any>(async resolve => {
      this.transactionServices.checkValidTransactionBtach(clientId).subscribe(result => {
        return resolve(result);
      });
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

  addCardInformation(member: any) {
    this.clientsServices.getClientIdentifierTemplate(member.clientId).subscribe(result => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        clientIdentifierTemplate: result
      };
      // dialogConfig.minWidth = 400;
      const dialog = this.dialog.open(AddIdentitiesExtraInfoComponent, dialogConfig);
      dialog.afterClosed().subscribe(data => {
        if (data && data.status) {
        }
      });
    });
  }

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
