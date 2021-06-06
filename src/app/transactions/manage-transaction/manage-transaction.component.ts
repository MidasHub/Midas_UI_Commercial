import { forEach, includes } from "lodash";
import { TransactionDatasource } from "../transaction.datasource";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
import { AlertService } from "../../core/alert/alert.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../dialog/confirm-dialog/confirm-dialog.component";
import { UploadBillComponent } from "../dialog/upload-bill/upload-bill.component";
import { ClientsService } from "../../clients/clients.service";
import { FormfieldBase } from "../../shared/form-dialog/formfield/model/formfield-base";
import { FormDialogComponent } from "../../shared/form-dialog/form-dialog.component";
import { InputBase } from "../../shared/form-dialog/formfield/model/input-base";
import { TerminalsService } from "app/terminals/terminals.service";
import { BanksService } from "app/banks/banks.service";
import { ConfirmHoldTransactionDialogComponent } from "../dialog/confirm-hold-transaction-dialog/confirm-hold-transaction-dialog.component";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SelectBase } from "app/shared/form-dialog/formfield/model/select-base";
import { AddSubmitTransactionDialogComponent } from "../dialog/add-submit-transaction-dialog/add-submit-transaction-dialog.component";
@Component({
  selector: "midas-manage-transaction",
  templateUrl: "./manage-transaction.component.html",
  styleUrls: ["./manage-transaction.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class ManageTransactionComponent implements OnInit {
  expandedElement: any;
  displayedColumns: string[] = [
    "productId",
    "txnDate",
    "officeName",
    "panHolderName",
    "panBank",
    "terminalAmount",
    "feeAmount",
    // "cogsAmount",
    "terminalAmount_feeAmount",
  ]; // pnlAmount
  formDate: FormGroup;
  formFilter: FormGroup;
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
      label: "Giao dịch Cash",
      shortName: "Cash",
      value: "CA01",
    },
    {
      label: "Giao dịch Advance lẻ",
      shortName: "Advance lẻ",
      value: "AL01",
    },
    {
      label: "Giao dịch Advance sỉ",
      shortName: "Advance sỉ",
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
    {
      label: "Giao dịch Cash - tiền chờ",
      shortName: "Cash-chờ",
      value: "CA03",
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
  today = new Date();
  transactionTerminals: any[];
  transactionTotalByBatchNo: any[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("htmlData") htmlData: ElementRef;

  public openPDF(): void {
    let DATA = document.getElementById("transactionData");
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL("image/png");
      let pdf = new jsPDF("p", "mm", "a4");
      let position = 0;
      pdf.addImage(FILEURI, "PNG", 0, position, fileWidth, fileHeight);
      pdf.save("angular-demo.pdf");
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private terminalsService: TerminalsService,
    private bankService: BanksService
  ) {
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
    });

    this.currentUser = this.authenticationService.getCredentials();
    const { permissions } = this.currentUser;
    const permit_userTeller = permissions.includes("POS_UPDATE");
    if (permit_userTeller) {
      this.displayedColumns.push("pnlAmount");
      this.displayedColumns.push("actions");
    } else {
      this.displayedColumns.push("actions");
    }
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
      holdTransaction: [false],
      agencyName: [""],
    });
    this.formFilter.get("officeId").valueChanges.subscribe((value) => {
      this.clientsService.getListUserTeller(value).subscribe((result: any) => {
        this.staffs = result?.result?.listStaff.filter((staff: any) => staff.displayName.startsWith("R"));
        this.staffs.unshift({
          id: "",
          displayName: "Tất cả",
        });
      });
    });
    this.formFilter.valueChanges.subscribe((value) => {
      this.filterTransaction();
    });
  }

  displayTerminalName(terminalId: string) {
    const terminalInfo = this.terminals?.filter((terminal: any) => terminal.terminalId == terminalId);
    return terminalInfo ? terminalInfo[0]?.terminalName : terminalId;
  }

  ngOnInit(): void {
    this.dataSource = this.transactionsData;
    this.terminalsService.getPartnersTerminalTemplate().subscribe((partner) => {
      this.partners = partner?.result?.partners;
      this.terminals = partner?.result?.listTerminal;
      // @ts-ignore
      this.partners?.unshift({ code: "", desc: "Tất cả" });
      this.terminals?.unshift({ terminalId: "", terminalName: "Tất cả" });
    });

    this.clientsService.getListUserTeller(this.currentUser.officeId).subscribe((result: any) => {
      this.staffs = result?.result?.listStaff.filter((staff: any) => staff.displayName.startsWith("R"));
      this.staffs.unshift({
        id: "",
        displayName: "Tất cả",
      });
    });

    this.bankService.getListOfficeCommon().subscribe((offices: any) => {
      this.offices = offices.result.listOffice;
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
    this.transactionService.getTransaction({ fromDate, toDate }).subscribe((result) => {
      this.isLoading = false;
      this.transactionsData = result?.result?.listPosTransaction.map((v: any) => {
        return {
          ...v,
          terminalAmount_feeAmount: Number(v.feePercentage),
        };
      });

      this.transactionTerminals = [];
      this.transactionTotalByBatchNo = [];
      this.transactionsData.forEach((element) => {
        if (element.isSubmit == 0) {
        const terminalInfo = this.terminals?.filter((terminal: any) => terminal.terminalId == element.terminalId);
        this.transactionTerminals.push(terminalInfo[0]);

        let transaction = {
          batchNo: element.batchNo,
          amount: element.terminalAmount,
          terminalId: element.terminalId,
        };

        if (this.transactionTotalByBatchNo.length == 0) {
          this.transactionTotalByBatchNo.push(transaction);
        } else {
          let isExisting = false;
          for (let index = 0; index < this.transactionTotalByBatchNo.length; index++) {
            const transaction = this.transactionTotalByBatchNo[index];
            if (transaction.batchNo == element.batchNo && transaction.terminalId == element.terminalId) {
              transaction.amount += element.terminalAmount;
              isExisting = true;
            }
          }

          if (!isExisting) {
            this.transactionTotalByBatchNo.push(transaction);
          }
        }

        }
      });

      this.filterTransaction();
    });
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
    const holdTransaction = form.holdTransaction;

    const keys = Object.keys(form);
    this.filterData = this.transactionsData?.filter((v) => {
      for (const key of keys) {
        if (["wholesaleChoose", "RetailsChoose", "holdTransaction"].indexOf(key) === -1) {
          if (form[key]) {
            if (!v[key]) {
              return false;
            }
            if (!String(v[key]).toUpperCase().includes(String(form[key]).toUpperCase())) {
              return false;
            }
          }
        }
      }
      const check_wholesaleChoose = wholesaleChoose ? v.type.startsWith("B") : false;
      const check_RetailsChoose = RetailsChoose ? v.type === "cash" || v.type === "rollTerm" : false;
      if (!check_wholesaleChoose && !check_RetailsChoose) {
        return false;
      }

      if ((!holdTransaction && v.isHold == 1) || (holdTransaction && v.isHold == 0)) {
        return false;
      }

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

  submitTransactionUpToNow() {
    const data = {
      title: "Thêm thông tin chốt số giao dịch đến thời điểm hiện tại",
      btnTitle: "Xác nhận",
      listTerminalTransaction: this.transactionTerminals,
      transactionTotalByBatchNo: this.transactionTotalByBatchNo,
    };
    const dialog = this.dialog.open(AddSubmitTransactionDialogComponent, { data });
    dialog.afterClosed().subscribe((data) => {

      if (data) {
        const value = data.data.value;

        let listObjectTransactionSubmit = data.listObjectTransactionSubmit;
        // check equal amount from cross check value
          for (let index = 0; index < listObjectTransactionSubmit.length; index++) {
          const transaction = listObjectTransactionSubmit[index];
          if (transaction.amountSubmitSuggest != transaction.amountSubmit) {

            let messageCheckSameAmountCrossCheck = `Số tiền chốt lô ${transaction.batchNoSubmit} nhập vào chưa đúng, vui lòng thử lại!`
            this.alertService.alert({
              msgClass: "cssDanger",
              message: messageCheckSameAmountCrossCheck,
            });

            return;
          }
        }

        let note = value.note;
        let terminalSubmit = value.terminalSubmit;
        let terminalNameSubmit = value.terminalSubmit;

        // get terminal name submit to server
        for (let index = 0; index < this.transactionTerminals.length; index++) {
          if (value.terminalSubmit == this.transactionTerminals[index].terminalId) {
            terminalNameSubmit = this.transactionTerminals[index].terminalName;
          }
        }

        this.transactionService
          .submitTransactionUpToiNow(listObjectTransactionSubmit, note, terminalSubmit, terminalNameSubmit)
          .subscribe((result) => {
            if (result.status === "200") {
              this.getTransaction();
              const message = "Chốt số giao dịch thành công";
              this.alertService.alert({
                msgClass: "cssInfo",
                message: message,
              });
              this.getTransaction();
            } else {
              this.alertService.alert({
                msgClass: "cssDanger",
                message: result.error,
              });
            }
          });
      }
    });
  }

  updateIsHoldTransaction(tranRefNo: string, transactionId: string) {
    const dialog = this.dialog.open(ConfirmHoldTransactionDialogComponent, {
      data: {
        message: "Cập nhật trạng thái cho giao dịch bị treo với mã " + tranRefNo,
        title: "Giao dịch treo",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data.isSuccess) {
        this.addPosInformation(tranRefNo, "", "");
      } else {
        if (!data.isSuccess && data) {
          this.revertTransaction(transactionId, tranRefNo);
        }
      }
    });
  }

  revertTransaction(transactionId: string, tranRefNo: string) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Bạn chắc chắn muốn hủy giao dịch " + tranRefNo,
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
      title: "Cập nhật thông tin hóa đơn",
      layout: { addButtonText: "Xác nhận" },
      formfields: formfields,
    };
    const dialog = this.dialog.open(FormDialogComponent, { data });
    dialog.afterClosed().subscribe((response: any) => {
      if (response.data) {
        const value = response.data.value;
        this.transactionService.uploadBosInformation(trnRefNo, value).subscribe((result) => {
          this.getTransaction();
        });
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

  exportAsXLSX(): void {
    let dataCopy = [];
    let i = -1;
    while (++i < this.transactionsData.length) {
      let element = this.transactionsData[i];
      let e: any = {
        createdDate: element.createdDate,
        terminalId: this.displayTerminalName(element.terminalId),
        batchNo: element.batchNo,
        traceNo: element.traceNo,
        panHolderName: element.panHolderName,
        panNumber: element.panNumber,
        cardType: element.cardType,
        panBank: element.panBank,
        staffName: element.createdByName,
        terminalAmount: element.terminalAmount,
      };
      dataCopy.push(e);
    }
    this.transactionService.exportAsExcelFile("Transaction", dataCopy);
  }

  //tratt
  exportData(): void {
    let dataCopy = [];
    let i = -1;

    while (++i < this.transactionsData.length) {
      let element = this.transactionsData[i];
      let e: any = {
        createdDate: this.datePipe.transform(element.createdDate, "dd-MM-yyyy HH:mm:ss"),
        terminalId: this.displayTerminalCode(element.terminalId),
        batchNo: element.batchNo,
        traceNo: element.traceNo,
        panHolderName: element.panHolderName,
        agencyName: element.agencyName,
        invoiceAmount: element.invoiceAmount,
        terminalAmount: element.terminalAmount,
        panNumber: element.panNumber,
        cardType: element.cardType,
        panBank: element.panBank,
        merchantNo: element.merchantNo,
        trnRefNo: element.trnRefNo,
        status: this.displayStatus(element.status),
        officeName: element.officeName,
        ext5: element.ext5,
        partnerCode: this.displayPartnerDesc(element.partnerCode),
        feeAmount: element.feeAmount,
        cogsAmount: element.cogsAmount,
        staffName: this.displayStaffName(element.createdBy),
        terminalFeeAmount: element.terminalFeeAmount,
      };
      dataCopy.push(e);
    }
    this.transactionService.exportDataFile("TransactionDaily", dataCopy);
  }

  displayTerminalCode(terminalId: string) {
    const terminalInfo = this.terminals?.filter((terminal: any) => terminal.terminalId == terminalId);
    return terminalInfo ? terminalInfo[0]?.terminalCode : terminalId;
  }

  displayPartnerDesc(partnerCode: string) {
    const partneInfo = this.partners?.filter((partner: any) => partner.code == partnerCode);
    return partneInfo ? partneInfo[0]?.desc : partnerCode;
  }

  displayStaffName(createdBy: string) {
    for (const staff of this.staffs) {
      if (staff.staffCode == createdBy) {
        return staff.displayName;
      }
    }
  }
  //end tratt
}
