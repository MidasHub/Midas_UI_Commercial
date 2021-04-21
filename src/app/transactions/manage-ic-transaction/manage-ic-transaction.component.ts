import { Component, OnInit, ViewChild } from "@angular/core";
import { TransactionDatasource } from "../transaction.datasource";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TransactionService } from "../transaction.service";
import { MatPaginator } from "@angular/material/paginator";
import { DatePipe } from "@angular/common";
import { SettingsService } from "../../settings/settings.service";
import { AuthenticationService } from "../../core/authentication/authentication.service";
import { MatSort } from "@angular/material/sort";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { SavingsService } from "../../savings/savings.service";
import { SystemService } from "../../system/system.service";
import { CentersService } from "../../centers/centers.service";
import { AlertService } from "../../core/alert/alert.service";
import { MatDialog } from "@angular/material/dialog";
import { UploadDocumentDialogComponent } from "../../clients/clients-view/custom-dialogs/upload-document-dialog/upload-document-dialog.component";
import { ConfirmDialogComponent } from "../dialog/coifrm-dialog/confirm-dialog.component";
import { UploadBillComponent } from "../dialog/upload-bill/upload-bill.component";
import { ClientsService } from "../../clients/clients.service";
import { FormfieldBase } from "../../shared/form-dialog/formfield/model/formfield-base";
import { SelectBase } from "../../shared/form-dialog/formfield/model/select-base";
import { FormDialogComponent } from "../../shared/form-dialog/form-dialog.component";
import { InputBase } from "../../shared/form-dialog/formfield/model/input-base";
import { TerminalsService } from "app/terminals/terminals.service";
import { BanksService } from "app/banks/banks.service";

@Component({
  selector: "midas-manage-ic-transaction",
  templateUrl: "./manage-ic-transaction.component.html",
  styleUrls: ["./manage-ic-transaction.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class ManageIcTransactionComponent implements OnInit {
  expandedElement: any;
  displayedColumns: string[] = [
    // "productId",
    "txnDate",
    "terminalName",
    "panHolderName",
    // "panBank",
    "terminalAmount",
    "traceNo",
    "batchNo",
    "terminalAmount_feeAmount",
  ]; // pnlAmount
  formDate: FormGroup;
  formFilter: FormGroup;
  formFilterPartner: FormGroup;
  dataSource: any[];
  isLoading: boolean = false;
  transactionsData: any[] = [];
  currentUser: any;
  transactionType: any[] = [
    {
      label: "Tất cả",
      shortName: "Tất cả",
      value: "",
    },
    {
      label: "Giao dịch RTM",
      shortName: "RTM",
      value: "CA01",
    },
    {
      label: "Giao dịch ĐHT lẻ",
      shortName: "ĐHT lẻ",
      value: "AL01",
    },
    {
      label: "Giao dịch ĐHT sỉ",
      shortName: "ĐHT sỉ",
      value: "AL02",
    },
    {
      label: "Giao dịch test thẻ",
      shortName: "TEST",
      value: "TEST",
    },
    {
      label: "Giao dịch lô lẻ",
      shortName: "lô lẻ",
      value: "CA02",
    },
  ];
  statusOption: any[] = [
    {
      label: "Tất cả",
      value: "",
    },
    {
      label: "Thành công",
      value: "C",
    },
    {
      label: "Chờ đợi",
      value: "P",
    },
    {
      label: "Hủy",
      value: "V",
    },
  ];
  partners: any[];
  staffs: any[];
  offices: any[];
  terminals: any;
  totalTerminalAmount = 0;
  totalFeeAmount = 0;
  totalCogsAmount = 0;
  totalPnlAmount = 0;
  panelOpenState = true;
  filterData: any[];
  banks: any[];
  partnersMapping: any[];
  today = new Date();
  commonCardBanks: any[] = this.bankService.documentCardBanks;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private savingsService: SavingsService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private terminalsService: TerminalsService,
    private bankService: BanksService,

  ) {
    this.banks =  this.commonCardBanks;
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
    });
    this.partnersMapping = [];
    this.partnersMapping.push(
      { code: "", desc: "Tekcompay" },
      // { code: "", desc: "Tất cả" }
      );
    this.currentUser = this.authenticationService.getCredentials();
    const { permissions } = this.currentUser;
    const permit_userTeller = permissions.includes("POS_UPDATE");
    // if (permit_userTeller) {
    //   this.displayedColumns.push("pnlAmount");
    //   this.displayedColumns.push("actions");
    // } else {
    //   this.displayedColumns.push("actions");
    // }
    this.formFilterPartner = this.formBuilder.group({

      partnerCode: [""],
      terminalId: [""],
      traceNo: [""],
      batchNo: [""],
      terminalAmount: [""],
      bankCode: [""],
    });

    this.formFilter = this.formBuilder.group({
      productId: [""],
      status: [""],
      partnerCode: [""],
      officeId: [""],
      panHolderName: [""],
      terminalId: [""],
      traceNo: [""],
      batchNo: [""],
      terminalAmount: [""],
      userId: [""],
      trnRefNo: [""],
      RetailsChoose: [true],
      wholesaleChoose: [true],
      agencyName: [""],
    });
    this.formFilter.get("officeId").valueChanges.subscribe((value) => {
      this.clientsService.getListUserTeller(value).subscribe((result: any) => {
        this.staffs = result?.result?.listStaff.filter((staff:any) => staff.displayName.startsWith("R"));
        this.staffs.unshift({
          id: "",
          displayName: "Tất cả",
        });
      });
    });
    this.formFilterPartner.valueChanges.subscribe((value) => {

      this.filterTransaction();
    });

    this.formFilterPartner.get('bankCode').valueChanges.subscribe((value) => {
      this.terminalsService.getTerminalsByAccountBankId(value).subscribe((partner) => {

        this.terminals = partner?.result?.listTerminal;
        // @ts-ignore
        this.terminals?.unshift({ terminalId: "", terminalName: "Chọn máy Pos" });
      });
    });

  }

displayTerminalName(terminalId: string){
  const terminalInfo =  this.terminals?.filter((terminal: any) => terminal.terminalId == terminalId);
  return terminalInfo ? terminalInfo[0]?.terminalName : terminalId;
}

  ngOnInit(): void {
    this.dataSource = this.transactionsData;
    this.terminalsService.getPartnersTerminalTemplate().subscribe((partner) => {
      this.partners = partner?.result?.partners;
      this.terminals = partner?.result?.listTerminal;
      // @ts-ignore
      this.partners?.unshift({ code: "", desc: "Tất cả" });
      this.terminals?.unshift({ terminalId: "", terminalName: "Chọn máy Pos" });
    });

    this.clientsService.getListUserTeller(this.currentUser.officeId).subscribe((result: any) => {
      this.staffs = result?.result?.listStaff.filter((staff:any) => staff.displayName.startsWith("R"));
      this.staffs.unshift({
        id: "",
        displayName: "Tất cả",
      });
    });

    this.savingsService.getListOfficeCommon().subscribe((offices: any) => {
      this.offices = offices?.result?.listOffice;
      this.offices?.unshift({ officeId: "", name: "Tất cả" });
      const officeId = this.currentUser.officeId;
      this.currentUser = this.authenticationService.getCredentials();
      const { permissions } = this.currentUser;
      const permit_Head = permissions.includes("ALL_FUNCTIONS");
      if (!permit_Head) {
        this.formFilter.get("officeId").setValue(officeId);
      }
    });
    this.getTransaction();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.filterTransaction()))
      .subscribe();
  }

  getTransaction() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((fromDate - toDate) / oneDay));
    if (diffDays > 31) {
      const message = `Chỉ cho phép xem giao dịch trong vòng 1 tháng (không lớn hơn 31 ngày)`;
      this.alertService.alert({
        msgClass: "cssWarning",
        message: message,
      });
      return;
    }

    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.dataSource = [];
    this.isLoading = true;
    let terminalId = this.formFilterPartner.get("terminalId").value;
    if (window.localStorage.getItem("Gateway-TenantId") == 'st99'){
      terminalId = terminalId.replace("MIDAS", "");
      this.transactionService.getTransactionIc({ fromDate, toDate, terminalId }).subscribe((result) => {
        this.isLoading = false;
        const listPosTransaction = result?.result?.listPosTransaction
        this.transactionsData = listPosTransaction.map((v: any) => {
          return {
            ...v,
            // terminalAmount_feeAmount: Number(v.feePercentage),
          };
        });

        this.filterTransaction();
      });
    } else  {
      this.transactionService.getTransaction({ fromDate, toDate }).subscribe((result) => {
        this.isLoading = false;
        this.transactionsData = result?.result?.listPosTransaction.map((v: any) => {
          return {
            ...v,
            // terminalAmount_feeAmount: Number(v.feePercentage),
          };
        });
        this.filterTransaction();
      });
    }

  }

  checkB(type: string) {
    return type.startsWith("B");
  }

  filterTransaction() {
    const limit = this.paginator.pageSize;
    const offset = this.paginator.pageIndex * limit;
    const form = this.formFilter.value;
    const wholesaleChoose = form.wholesaleChoose;
    const RetailsChoose = form.RetailsChoose;
    const keys = Object.keys(form);

     this.filterData = this.transactionsData?.filter((v) => {
    //   for (const key of keys) {
    //     if (["wholesaleChoose", "RetailsChoose"].indexOf(key) === -1) {
    //       if (form[key]) {
    //         if (!v[key]) {
    //           return false;
    //         }
    //         if (!String(v[key]).toUpperCase().includes(String(form[key]).toUpperCase())) {
    //           return false;
    //         }
    //       }
    //     }
    //   }
    //   const check_wholesaleChoose = wholesaleChoose ? v.type.startsWith("B") : false;
    //   const check_RetailsChoose = RetailsChoose ? v.type === "cash" || v.type === "rollTerm" : false;
    //   if (!check_wholesaleChoose && !check_RetailsChoose) {
    //     return false;
    //   }
       return true;
    });
    this.totalTerminalAmount = this.filterData?.reduce((total: any, num: any) => {
      return total + Math.round(num?.terminalAmount);
    }, 0);
    this.totalFeeAmount = this.filterData?.reduce((total: any, num: any) => {
      return total + Math.round(num?.feeAmount);
    }, 0);
    this.totalCogsAmount = this.filterData?.reduce((total: any, num: any) => {
      return total + Math.round(num?.cogsAmount);
    }, 0);
    this.totalPnlAmount = this.filterData?.reduce((total: any, num: any) => {
      return total + Math.round(num?.pnlAmount);
    }, 0);
    this.dataSource = this.filterData?.slice(offset, offset + limit);
  }

  get fromDateAndToDate() {
    const fromDate = this.formDate.get("fromDate").value;
    const toDate = this.formDate.get("toDate").value;
    if (fromDate && toDate) {
      return true;
    }
    return false;
  }

  displayProductId(type: string) {
    return this.transactionType.find((v) => v.value === type)?.shortName || "N/A";
  }

  menuOpened() {
    console.log("menuOpened");
  }

  menuClosed() {
    console.log("menuClosed");
  }

  downloadVoucher(transactionId: string) {
    this.transactionService.downloadVoucher(transactionId);
  }

  downloadBill(clientId: string, documentId: string) {
    this.transactionService.downloadBill(clientId, documentId);
  }

  revertTransaction(transactionId: string) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Bạn chắc chắn muốn hủy giao dịch " + transactionId,
        title: "Hủy giao dịch",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.transactionService.revertTransaction(transactionId).subscribe((result) => {
          if (result.status === "200") {
            this.getTransaction();
            const message = "Hủy giao dịch " + transactionId + " thành công";
            this.alertService.alert({
              msgClass: "cssInfo",
              message: message,
            });
            this.getTransaction();
          }
        });
      }
    });
  }

  displayStatus(status: string) {
    switch (status) {
      case "C":
        return "Thành công";
      case "P":
        return "Chờ đợi";
      case "V":
        return "Hủy";
      default:
        return "";
    }
  }

  undoRevertTransaction(transactionId: string) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Bạn chắc chắn muốn hoàn tác giao dịch " + transactionId,
        title: "Hoàn tác giao dịch",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.transactionService.undoRevertTransaction(transactionId).subscribe((result) => {
          if (result.status === "200") {
            const message = "Hoàn tác giao dịch " + transactionId + " thành công";
            this.alertService.alert({
              msgClass: "cssInfo",
              message: message,
            });
            this.getTransaction();
          }
        });
      }
    });
  }

  uploadBill(custId: string, trnRefNo: string) {
    const dialog = this.dialog.open(UploadBillComponent, {});
    dialog.afterClosed().subscribe((data) => {
      const { file } = data;
      const formData: FormData = new FormData();
      formData.append("name", file.name);
      formData.append("file", file);
      formData.append("fileName", file.name);
      if (data) {
        this.clientsService.uploadClientDocumenttenantIdentifier(custId, formData).subscribe((result) => {
          if (result.resourceId) {
            const message = "Tải lên bill giao dịch " + trnRefNo + " thành công";
            this.alertService.alert({
              msgClass: "cssInfo",
              message: message,
            });
          }
        });
      }
    });
  }

  addPosInformation(trnRefNo: string, batchNo: string, traceNo: string) {
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: "traceNo",
        label: "Trace No",
        value: traceNo,
        type: "text",
        required: true,
      }),
      new InputBase({
        controlName: "batchNo",
        label: "Batch No",
        value: batchNo,
        type: "text",
        required: true,
      }),
    ];
    const data = {
      title: "Thêm thông tin máy POS",
      layout: { addButtonText: "Xác nhận" },
      formfields: formfields,
    };
    const dialog = this.dialog.open(FormDialogComponent, { data });
    dialog.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const value = response.data.value;
        this.transactionService.uploadBosInformation(trnRefNo, value).subscribe((reslut) => {});
      }
    });
  }

  exportTransaction() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    const form = this.formFilter.value;
    let query = `fromDate=${fromDate}&toDate=${toDate}&officeName=${form.officeId || "ALL"}`;
    const keys = Object.keys(form);
    for (const key of keys) {
      if (key === "userId") {
        if (form[key]) {
          query = query + "&createdByFilter=" + form[key];
        } else {
          query = query + "&createdByFilter=ALL";
        }
      } else {
        if (key !== "officeId") {
          const value =
            ["productId", "status", "partnerCode", "officeName"].indexOf(key) === -1
              ? form[key]
              : form[key] === "" || !form[key]
              ? "ALL"
              : form[key];
          query = query + "&" + key + "=" + value;
        }
      }
    }

    this.transactionService.exportTransaction(query);
  }

  exportTransactionForPartner() {
    const dateFormat = this.settingsService.dateFormat;
    let fromDate = this.formDate.get("fromDate").value;
    let toDate = this.formDate.get("toDate").value;
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }

    const form = this.formFilter.value;
    let query = `fromDate=${fromDate}&toDate=${toDate}&officeName=${form.officeId || "ALL"}`;
    const keys = Object.keys(form);
    for (const key of keys) {
      if (key === "staffId") {
        if (form[key]) {
          query = query + "&createdByFilter=" + form[key];
        } else {
          query = query + "&createdByFilter=ALL";
        }
      } else {
        if (key !== "officeId") {
          const value =
            ["productId", "status", "partnerCode", "officeName"].indexOf(key) === -1
              ? form[key]
              : form[key] === "" || !form[key]
              ? "ALL"
              : form[key];
          query = query + "&" + key + "=" + value;
        }
      }
    }

    this.transactionService.exportTransactionForPartner(query);
  }
}
