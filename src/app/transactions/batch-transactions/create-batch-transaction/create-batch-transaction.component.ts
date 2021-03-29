import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
// import { AddFeeDialogComponent } from "../../dialog/add-fee-dialog/add-fee-dialog.component";
// import { AddRowCreateBatchTransactionComponent } from "../../dialog/add-row-create-batch-transaction/add-row-create-batch-transaction.component";
import { CreateCardBatchTransactionComponent } from "../../dialog/create-card-batch-transaction/create-card-batch-transaction.component";
import { TransactionService } from "../../transaction.service";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { AlertService } from "../../../core/alert/alert.service";
import { AuthenticationService } from "../../../core/authentication/authentication.service";
import { GroupsService } from "../../../groups/groups.service";
// import { AddInformationCardBatchComponent } from "../../dialog/add-information-card-batch/add-information-card-batch.component";
import { AddIdentitiesExtraInfoComponent } from "../../../clients/clients-view/identities-tab/dialog-add-identities-extra-info/add-identities-extra-info.component";
import { ClientsService } from "../../../clients/clients.service";
import { debounce, distinctUntilChanged, map, startWith, takeUntil } from "rxjs/operators";
import { Observable, Subject, timer } from "rxjs";
import { ConfirmDialogComponent } from "../../dialog/coifrm-dialog/confirm-dialog.component";
import { MakeFeeOnAdvanceComponent } from "../../dialog/make-fee-on-advance/make-fee-on-advance.component";
import { BanksService } from "../../../banks/banks.service";
import { ValidCheckTransactionHistoryDialogComponent } from "app/transactions/dialog/valid-check-transaction-history/valid-check-transaction-history-dialog.component";

import {Logger} from "../../../core/logger/logger.service";
const log = new Logger('Batch Txn');
@Component({
  selector: "midas-create-batch-transaction",
  templateUrl: "./create-batch-transaction.component.html",
  styleUrls: ["./create-batch-transaction.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "100px" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class CreateBatchTransactionComponent implements OnInit {
  dataSource: any[] = [];
  formFilter = new FormControl("");
  displayedColumns: any[] = [
    "clientName",
    "productId",
    "rate",
    "amount",
    "terminalId",
    "invoiceAmount",
    "fee",
    "batchNo",
    "tid",
    "terminalAmount",
    "actions",
  ];
  terminals: any[] = [];
  batchProducts: any[] = [
    {
      label: "RTM",
      value: "CA01",
    },
    {
      label: "ĐHT",
      value: "AL02",
    },
  ];
  totalAmount = 0;
  totalRequest = 0;
  totalFee = 0;
  totalAmountTransaction = 0;
  totalTerminalAmount = 0;
  expandedElement: any;
  accountFilter: any[] = [];
  accountsShow: any[] = [];
  members: any[] = [];
  group: any;
  defaultData: any = {
    clientId: "",
    clientName: "",
    groupId: "",
    officeId: "", // webStorage.get('sessionData').officeId,
    fromClientId: "", // webStorage.get('sessionData').userId,
    parentOfficeId: 0,
    toClientId: "", // id
    toAccountId: 0,
    customerName: "", // name
    // identitydocuments: [],
    identitydocumentsId: "", // identifierId
    documentId: "", // documentId
    amount: 0,
    terminalAmount: 0,
    invoiceAmount: 0,
    requestAmount: 0,
    rate: "", // scope.getFeeByCardAndType(identifierId, 'CA01'),
    fee: 0,
    productId: "CA01",
    batchTxnName: "", // scope.batchTxnName,
    bookingTxnDailyId: "", // scope.bookingId,
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
    bookingId: 0,
    campaignId: 0,
    isUseCampaign: false,
    transactionId: 0,
    transactionRefNo: 0,
    saveFlag: 0,
    ext5: null,
    // CM: false
  };
  currentUser: any;
  feeGroup: any;
  batchTxnName: any;
  isLoading: Boolean = false;
  bookingTxnDailyId: any;
  private destroy$ = new Subject<void>();
  filteredOptions: Observable<any[]>;

  private _filter(value: string): string[] {
    const filterValue = String(value).toUpperCase().replace(/\s+/g, "");
    return this.members.filter((option: any) => {
      return (
        option.fullName.toUpperCase().replace(/\s+/g, "").includes(filterValue) ||
        option.cardNumber.toUpperCase().replace(/\s+/g, "").includes(filterValue)
      );
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private transactionServices: TransactionService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private groupServices: GroupsService,
    private clientsServices: ClientsService,
    private bankServices: BanksService,
    private router: Router
  ) {
    this.currentUser = this.authenticationService.getCredentials();
    if (!this.authenticationService.checkAppModuleSetting("billModule")) {
      this.displayedColumns.splice(this.displayedColumns.indexOf("invoiceAmount"), 1);
    }
  }

  displayClient(client: any): string | undefined {
    return client
      ? `${client.cardNumber.slice(0, 6)} X ${client.cardNumber.slice(
          client.cardNumber.length - 5,
          client.cardNumber.length
        )} - ${client.fullName}`
      : undefined;
  }

  getLabelProduct(productId: string) {
    return this.batchProducts.find((v) => v.value === productId)?.label;
  }

  exportTransactions() {
    return this.transactionServices.exportTransactionBatch(this.batchTxnName);
  }

  resetAutoComplete() {
    this.formFilter.setValue("");
    this.filteredOptions = this.formFilter.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filter(value))
    );
  }

  getData(reset?: boolean) {
    this.isLoading = true;
    this.transactionServices.getMembersAvailableGroup(this.group.id).subscribe((data) => {
      this.isLoading = false;
      this.members = data?.result?.listMemberGroupWithIdentifier;
      if (reset) {
        this.route.queryParams.subscribe(({ batchTxnName, bookingTxnDailyId }: any) => {
          if (bookingTxnDailyId) {
            this.bookingTxnDailyId = bookingTxnDailyId;
            this.defaultData.bookingTxnDailyId = bookingTxnDailyId;
          }

          if (batchTxnName) {
            this.batchTxnName = batchTxnName;
            this.defaultData.batchTxnName = batchTxnName;
            this.isLoading = true;
            this.transactionServices.getListTransExistingOfBatch(batchTxnName).subscribe((result) => {
              this.isLoading = false;
              this.dataSource = [];
              result?.result?.listBatchTransaction?.forEach((v: any) => {
                const member = this.members.find((f) => String(f.clientId) === String(v.custId));
                const batchTransaction = {
                  index: `${String(new Date().getMilliseconds())}___${this.dataSource.length}`,
                  ...this.defaultData,
                  ...v,
                  identitydocumentsId: `${member.cardNumber.slice(0, 6)}-XXX-XXX-${member.cardNumber.slice(
                    member.cardNumber.length - 4,
                    member.cardNumber.length
                  )} `,
                  customerName: member.fullName,
                  clientId: member.clientId,
                  toClientId: member.clientId,
                  clientName: member.fullName,
                  documentId: member.documentId,
                  tid: v.traceNo,
                  fee: v.feeAmount,
                  requestAmount: v.reqAmount,
                  invoiceAmount: v.invoiceAmount,
                  rate: v.feePercentage,
                  saved: true,
                };
                this.dataSource = [...this.dataSource, this.generaForm(batchTransaction, member)];
              });
              this.onChangeTotal();
            });
          }
        });
      }
    });
  }

  init() {
    // getTransactionGroupFee
    this.route.data.subscribe(({ groupId }: any) => {
      // @ts-ignore
      this.transactionServices.getMembersInGroup(groupId).subscribe((res) => {
        this.group = res?.result?.listMemberGroup;
        this.defaultData.groupId = this.group.id;
        this.defaultData.fromClientId = this.currentUser.userId;
        this.defaultData.officeId = this.currentUser.officeId;
        this.getData(true);
        this.transactionServices.getTransactionGroupFee(this.group.id).subscribe((data) => {
          this.feeGroup = data?.result.listFeeGroup;
        });
      });
    });
  }

  getFee(panNumber: string, productId: string): number {
    if (!this.feeGroup) {
      return 2.0;
    }
    const card = this.feeGroup.find((v: any) => String(panNumber).startsWith(v.cardBeginDigit));
    if (card) {
      switch (productId) {
        case "CA01":
          return card?.minValue;
        case "AL01":
          return card?.maxValue;
        case "AL02":
          return card?.maxValue;  
        default:
          return 2.0;
      }
    }
    return 2.0;
  }

  clearRequestAmount() {
    this.dataSource.forEach((element) => {
      if (element?.get("requestAmount").value == 0) {
        element?.get("requestAmount").setValue(undefined);
      }
    });
  }

  onChangeTotal() {
    this.totalAmount = this.dataSource.reduce((total: any, num: any) => {
      return total + Math.round(num?.get("requestAmount").value);
    }, 0);
    // this.totalAmountTransaction = this.dataSource.reduce((total: any, num: any) => {
    //     return total + Math.round(num?.get('amountTransaction').value);
    // }, 0);
    this.totalTerminalAmount = this.dataSource.reduce((total: any, num: any) => {
      return total + Math.round(num?.get("terminalAmount").value);
    }, 0);
    this.totalFee = this.dataSource.reduce((total: any, num: any) => {
      return total + Math.round(num?.get("fee").value);
    }, 0);
    this.totalRequest = this.dataSource.reduce((total: any, num: any) => {
      return total + Math.round(num?.get("invoiceAmount").value);
    }, 0);
  }

  ngOnInit(): void {
    this.init();

    this.filteredOptions = this.formFilter.valueChanges.pipe(
      startWith(""),
      map((value: any) => this._filter(value))
    );
  }

  generaForm(data: any, member: any) {
    const keys = Object.keys(data);
    const formData = {};
    for (const key of keys) {
      formData[key] = [data[key]];
    }
    const form = this.formBuilder.group(formData);
    // form.get('CM').valueChanges.subscribe(value => {
    //   const terminalId = form.get('terminalId').value;
    //   if (!terminalId || terminalId === '--') {
    //     form.get('CM').setValue(false);
    //     return this.alertService.alert({
    //       message: 'Vui lòng chọn máy POS trước khi thưc hiện',
    //       msgClass: 'cssWarning'
    //     });
    //   }
    // });
    // @ts-ignore
    form.data = {
      terminals: [],
      binCodeInfo: {},
      feeTerminalDto: {},
      member: member,
    };

    form
      .get("requestAmount")
      .valueChanges.pipe(
        debounce(() => timer(1000)),
        distinctUntilChanged(null, (event: any) => {
          return event;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        if (value && value > 0) {
          this.transactionServices.getListTerminalAvailable(value).subscribe((result) => {
            // @ts-ignore
            form?.data.terminals = result?.result?.listTerminal;
            form.get("terminalId").setValidators([Validators.required]);
          });
        }
      });
    form.valueChanges.subscribe((e) => {
      this.onChangeTotal();
    });
    form
      .get("rate")
      .valueChanges.pipe(
        debounce(() => timer(1000)),
        distinctUntilChanged(null, (event: any) => {
          return event;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        let rate = value;
        // @ts-ignore
        const { minRate, maxRate, cogsRate } = form?.data?.feeTerminalDto;
        if (rate < minRate || rate > maxRate) {
          form.get("rate").setValue(maxRate);
          rate = maxRate;
          // @ts-ignore
          form.get("pnlRate").setValue(Number(maxRate - cogsRate).toFixed(2));
          this.alertService.alert({
            message: "Tỉ lệ phí không được thấp hơn " + minRate + " và cao hơn " + maxRate,
            msgClass: "cssWarning",
          });
        } else {
          // @ts-ignore
          form.get("pnlRate").setValue(Number(rate - cogsRate).toFixed(2));
        }
        const terminalAmount = form.get("terminalAmount").value;
        form.get("fee").setValue(Number(terminalAmount * (rate / 100)).toFixed(0));
      });
    this.bankServices?.getInfoBinCode(member.cardNumber.slice(0, 6)).subscribe((result) => {
      if (result) {
        // @ts-ignore
        form.data.binCodeInfo = result;
      }
    });
    form.get("productId").valueChanges.subscribe((result) => {
      const cardNumber = form.get("identitydocumentsId").value;
      let newRate = this.getFee(cardNumber, result);
      form.get("rate").setValue(newRate);
    });
    form.get("terminalId").valueChanges.subscribe((terminalId) => {
      if (terminalId) {
        // @ts-ignore
        if (!form.data.binCodeInfo) {
          this.bankServices?.getInfoBinCode(member.cardNumber.slice(0, 6)).subscribe((binCodeInfo) => {
            if (binCodeInfo) {
              // @ts-ignore
              form.data.binCodeInfo = binCodeInfo;
              this.getFeeByTerminalAction(form, terminalId);
            }
          });
        } else {
          this.getFeeByTerminalAction(form, terminalId);
        }
      }

      const amount = form.get("requestAmount").value;
      const rate = form.get("rate").value;
      // @ts-ignore
      // tslint:disable-next-line:no-shadowed-variable
      const { documentId } = form.data.member;
      if (amount && rate !== 0 && terminalId) {
        let cardNumber = `${member.cardNumber.slice(0, 6)}-X-${member.cardNumber.slice(member.cardNumber.length - 4, member.cardNumber.length)} `;
        // @ts-ignore
        if (!form.data.binCodeInfo) {
          this.bankServices?.getInfoBinCode(member.cardNumber.slice(0, 6)).subscribe((binCodeInfo) => {
            if (binCodeInfo) {
              // @ts-ignore
              form.data.binCodeInfo = binCodeInfo;
              this.mappingInvoiceWithTransactionAction(form, cardNumber, documentId, amount, terminalId);
            }
          });
        } else {
          this.mappingInvoiceWithTransactionAction(form, cardNumber, documentId, amount, terminalId);
        }
      }
    });
    form.get("terminalAmount").valueChanges.subscribe((result) => {
      const rate = form.get("rate").value;
      const cogsRate = form.get("cogsRate").value;
      const fee = Number(result * (rate / 100)).toFixed(0);
      form.get("fee").setValue(fee);
      const feeCP = Number(result * (cogsRate / 100)).toFixed(0);
      form.get("feeCP").setValue(feeCP);
      // @ts-ignore
      form.get("feePNL").setValue(Number(fee - feeCP).toFixed(0));
    });
    return form;
  }

  formatLong(value: any) {
    return Number(String(value).replace(/[^0-9]+/g, ""));
  }

  formatCurrency(value: string) {
    value = String(value);
    const neg = value.startsWith("-");
    value = value.replace(/[-\D]/g, "");
    value = value.replace(/(\d{3})$/, ",$1");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    value = value !== "" ? "" + value : "";
    if (neg) {
      value = "-".concat(value);
    }

    return value;
  }

  mappingInvoiceWithTransactionAction(form: any, documentKey: string, documentId: string, amount: number, result: any) {
    // @ts-ignore
    this.transactionServices
      .mappingInvoiceWithTransaction(form.data.binCodeInfo.cardType, documentKey, documentId, amount, result)
      .subscribe((result2) => {

        if (result2.status != 200) {
          if (result2.status == 401) {
            if (result2.error == "Unauthorize with Midas") {
              this.alertService.alert({
                message: "Phiên làm việc hết hạn vui lòng đăng nhập lại để tiếp tục",
                msgClass: "cssDanger",
                hPosition: "center",
              });
            }
          }

          if (result2.statusCode == 666) {
            if (typeof result2.error !== "undefined" && result2.error !== "") {
              this.alertService.alert({
                message: `Chú Ý: Giao dịch không vượt hạn mức : ${this.formatCurrency(result2.error)} VNĐ`,
                msgClass: "cssDanger",
                hPosition: "center",
              });
            }
          } else {
            this.alertService.alert({
              message: `Lỗi xảy ra : Vui lòng liên hệ ITSupport. ERROR: ${result2}`,
              msgClass: "cssDanger",
              hPosition: "center",
            });
          }
          return;
        }
        if (typeof result2.result.caution != "undefined" && result2.result.caution != "NaN") {
          this.showHistoryTransaction(result2.result.caution, result2.result.listTransaction);

          // this.alertService.alert({ message: data.result.caution, msgClass: "cssDanger", hPosition: "center" });
        }
        const value = result2?.result.amountTransaction;
        // form.get('amountTransaction').setValue(value);
        form.get("invoiceAmount").setValue(value);

        form.get("terminalAmount").setValue(value);
        // @ts-ignore
        form.get("bills").setValue(result2.result.listInvoice);
      });
  }

  showHistoryTransaction(message: string , listTransaction: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      listTransaction: listTransaction,
      message: message
    };
    dialogConfig.minWidth = 400;
    dialogConfig.maxWidth = 800;
    this.dialog.open(ValidCheckTransactionHistoryDialogComponent, dialogConfig);
  }


  getFeeByTerminalAction(form: any, terminalId: string) {
    // @ts-ignore
    this.transactionServices.getFeeByTerminal(form.data.binCodeInfo.cardType, terminalId).subscribe((result1) => {
      // @ts-ignore
      form.data.feeTerminalDto = result1?.result?.feeTerminalDto;
      const { minRate, maxRate, cogsRate } = result1?.result?.feeTerminalDto;
      form.get("cogsRate").setValue(cogsRate);
      // @ts-ignore
      form.data.feeTerminalDto = {
        minRate,
        maxRate,
        cogsRate,
      };
      // tslint:disable-next-line:no-shadowed-variable
      let rate = form.get("rate").value;
      if (rate < minRate || rate > maxRate) {
        form.get("rate").setValue(maxRate);
        rate = maxRate;
        // @ts-ignore
        form.get("pnlRate").setValue(Number(maxRate - cogsRate).toFixed(2));
        this.alertService.alert({
          message: "Tỉ lệ phí không được thấp hơn " + minRate + " và cao hơn " + maxRate,
          msgClass: "cssWarning",
        });
      } else {
        // @ts-ignore
        form.get("pnlRate").setValue(Number(rate - cogsRate).toFixed(2));
      }
      const terminalAmount = form.get("terminalAmount").value;
      form.get("fee").setValue(Number(terminalAmount * (rate / 100)).toFixed(0));
    });
  }

  async addRow() {
    const member = this.formFilter.value;
    if (!member) {
      return this.formFilter.markAllAsTouched();
    }
    const checkValidTransaction1 = await this.checkValidTransaction(member.clientId);
    if (!checkValidTransaction1?.result?.isValid) {
      return this.alertService.alert({
        message: checkValidTransaction1?.result?.message,
        msgClass: "cssWarning",
      });
    }
    const resultCard = await this.checkCard(member.clientId, member.documentId);
    if (resultCard) {
      this.clientsServices.getClientById(member.clientId).subscribe((result) => {
        if (result) {
          if (this.batchTxnName) {
            this.defaultData.batchTxnName = this.batchTxnName;
          }
          const batchTransaction = {
            index: `${String(new Date().getMilliseconds())}___${this.dataSource.length}`,
            ...this.defaultData,
            identitydocumentsId: `${member.cardNumber.slice(0, 6)}-XXX-XXX-${member.cardNumber.slice(
              member.cardNumber.length - 4,
              member.cardNumber.length
            )} `,
            customerName: member.fullName,
            clientId: member.clientId,
            toClientId: member.clientId,
            clientName: member.fullName,
            documentId: member.documentId,
            toAccountId: result?.result?.clientInfo?.savingsAccountId,
            rate: this.getFee(member.cardNumber.slice(0, 6), "CA01"),
          };
          this.dataSource = [ this.generaForm(batchTransaction, member), ...this.dataSource];
        }
      });
    } else {
      this.addCardInformation(member);
    }
  }

  deleteRow(form: any) {
    this.dataSource = this.dataSource.filter((v) => v.get("index").value !== form.get("index").value);
  }

  makeFeeOnAdvance() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      batchTxnName: this.batchTxnName,
    };
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(MakeFeeOnAdvanceComponent, dialogConfig);
    dialog.afterClosed().subscribe((data) => {
      if (data && data.status) {
      }
    });
  }

  onSave(form: any) {
    if (form.invalid || !form.get("terminalId").value) {
      return this.alertService.alert({
        message: "Vui lòng điền đầy đủ thông tin",
        msgClass: "cssDanger",
      });
    }
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Bạn chắc chắn muốn lưu giao dịch",
        title: "Hoàn thành giao dịch",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        const formData = { ...form.data.member, ...form.value };
        delete formData.index;
        this.transactionServices.onSaveTransactionBatch(formData).subscribe((result) => {
          if (result?.status === "200") {
            this.batchTxnName = result?.result?.batchTxnName;

            const queryParams = { batchTxnName: this.batchTxnName };
            this.router.navigate([], {
              queryParams: queryParams,
              queryParamsHandling: "merge", // remove to replace all query params by provided
            });
            this.updateData(form, result?.result?.transactionId);
            return this.alertService.alert({
              message: "Giao dịch thành công",
              msgClass: "cssSuccess",
            });
          }
          return this.alertService.alert({
            message: result?.error,
            msgClass: "cssDanger",
          });
        });
      }
    });
  }

  updateData(form: any, transactionId: any) {
    this.transactionServices.getTransactionDetail(transactionId).subscribe((result) => {
      const v = result?.result?.detailTransactionDto;
      const member = form.data.member;
      const index = form.get("index").value;
      if (this.batchTxnName) {
        this.defaultData.batchTxnName = this.batchTxnName;
      }
      const batchTransaction = {
        index: index,
        ...this.defaultData,
        ...v,
        identitydocumentsId: `${member.cardNumber.slice(0, 6)}-XXX-XXX-${member.cardNumber.slice(
          member.cardNumber.length - 4,
          member.cardNumber.length
        )} `,
        customerName: member.fullName,
        clientId: member.clientId,
        toClientId: member.clientId,
        clientName: member.fullName,
        documentId: member.documentId,
        terminalId: v.terminalName,
        tid: v.traceNo,
        fee: v.feeAmount,
        requestAmount: v.requestAmount,
        invoiceAmount: v.invoiceAmount,
        rate: v.feeRate,
        saved: true,
      };
      const form_new = this.generaForm(batchTransaction, member);
      const newDataSo = this.dataSource.slice();
      const indesx = newDataSo.findIndex((j: any) => j.get("index").value === form.get("index").value);
      newDataSo[indesx] = form_new;
      this.dataSource = newDataSo;
    });
  }

  checkCard(userId: string, userIdentifyId: string): Promise<any> {
    return new Promise<any>(async (resolve) => {
      await this.transactionServices.checkExtraCardInfo(userId, userIdentifyId).subscribe((result) => {
        if (result?.result && result?.result?.isHaveExtraCardInfo) {
          let { expiredDate } = result?.result?.cardExtraInfoEntity;
          expiredDate = new Date(expiredDate);
          const now = new Date();
          if (expiredDate.getFullYear() > now.getFullYear()) {
          } else {
            if (expiredDate.getFullYear() === now.getFullYear()) {
              if (expiredDate.getMonth() > now.getMonth()) {
                if (expiredDate.getMonth() === now.getMonth() + 1) {
                  this.alertService.alert({
                    message:
                      "CHÚ Ý: Thẻ sẽ hết hạn vào tháng sau, đây là lần cuối cùng được thực hiện giao dịch trên thẻ này",
                    msgClass: "cssWarning",
                  });
                }
              }
              if (expiredDate.getMonth() === now.getMonth()) {
                this.alertService.alert({
                  message: "CẢNH BÁO: Thẻ sẽ hết hạn trong tháng này, cân nhắc khi thực hiện giao dịch trên thẻ này",
                  msgClass: "cssWarning",
                });
              }
              if (expiredDate.getMonth() < now.getMonth()) {
                this.alertService.alert({
                  message: "CẢNH BÁO: Thẻ đã hết hạn, không được thực hiện giao dịch trên thẻ này",
                  msgClass: "cssWarning",
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
    return new Promise<any>(async (resolve) => {
      this.transactionServices.checkValidTransactionBtach(clientId).subscribe((result) => {
        return resolve(result);
      });
    });
  }

  sortData(sort: any) {
    this.accountFilter = this.accountFilter.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const key = sort.active;
      return this.compare(a[key], b[key], isAsc);
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  addCardInformation(member: any) {
    this.clientsServices.getClientIdentifierTemplate(member.clientId).subscribe((result) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        clientIdentifierTemplate: result,
      };
      // dialogConfig.minWidth = 400;
      const dialog = this.dialog.open(AddIdentitiesExtraInfoComponent, dialogConfig);
      dialog.afterClosed().subscribe((response) => {
        if (response.data) {
          const { dueDay, expiredDate, limitCard, classCard } = response.data.value;

            this.bankServices
              .storeExtraCardInfo({
                userId: member.clientId,
                userIdentifyId: member.documentId,
                dueDay: dueDay,
                expireDate: expiredDate,
                limitCard: limitCard,
                classCard: classCard
              })
              .subscribe((res2: any) => {
              });

        }
      });
    });
  }

  addCard() {
    console.log("member", this.members);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      members: this.members,
      group: this.group,
    };
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(CreateCardBatchTransactionComponent, dialogConfig);
    dialog.afterClosed().subscribe((data) => {
      this.getData(false);
    });
  }
}
