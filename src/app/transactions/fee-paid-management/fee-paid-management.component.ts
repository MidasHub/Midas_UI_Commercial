import { Component, OnInit, ViewChild } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { TransactionService } from "../transaction.service";
import { DatePipe } from "@angular/common";
import { SettingsService } from "../../settings/settings.service";
import { AuthenticationService } from "../../core/authentication/authentication.service";
import { SavingsService } from "../../savings/savings.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ClientsService } from "../../clients/clients.service";
import { merge } from "rxjs";
import { tap } from "rxjs/operators";
import { ConfirmDialogComponent } from "../dialog/confirm-dialog/confirm-dialog.component";
import { UploadBillComponent } from "../dialog/upload-bill/upload-bill.component";
import { FormfieldBase } from "../../shared/form-dialog/formfield/model/formfield-base";
import { InputBase } from "../../shared/form-dialog/formfield/model/input-base";
import { FormDialogComponent } from "../../shared/form-dialog/form-dialog.component";
import { AddFeeDialogComponent } from "../dialog/add-fee-dialog/add-fee-dialog.component";
import { ViewFeePaidTransactionDialogComponent } from "../dialog/view-fee-paid-transaction-dialog/view-fee-paid-transaction-dialog.component";
import { MidasClientService } from "app/midas-client/midas-client.service";
import { AlertService } from "app/core/alert/alert.service";

@Component({
  selector: "midas-fee-paid-management",
  templateUrl: "./fee-paid-management.component.html",
  styleUrls: ["./fee-paid-management.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class FeePaidManagementComponent implements OnInit {
  expandedElement: any;
  transactionType: any[] = [
    {
      label: "Tất cả",
      shortName: "Tất cả",
      value: "",
    },
    {
      label: "Giao dịch Cash",
      shortName: "Cash",
      value: "CASH",
    },
    {
      label: "Giao dịch Advance",
      shortName: "Advance",
      value: "ROLLTERM",
    },
    {
      label: "Giao dịch lô",
      shortName: "Lô",
      value: "BATCH",
    }
  ];
  displayedColumns: string[] = [
    "txnDate",
    "officeName",
    "txnType",
    "batchNo",
    "customerName",
    "txnAmount",
    "DEAmount",
    "feeSum",
    "feePaid",
    "feeRemain",
    "actions",
  ];
  formDate: FormGroup;
  formFilter: FormGroup;
  dataSource: any[];
  isLoading: boolean = false;
  transactionsData: any[] = [];
  currentUser: any;


  paidPaymentType: any[] = [];

  paymentTypes: any[] = [
    {
      label: "Tất cả",
      value: "",
    },
    {
      label: "Thu",
      value: "IN",
    },
    {
      label: "Chi",
      value: "OUT",
    },
  ];
  statusOption: any[] = [
    {
      label: "Tất cả",
      value: "",
    },
    {
      label: "Chưa xong",
      value: "A",
    },
    {
      label: "Đã xong",
      value: "C",
    },
    {
      label: "Đã hủy",
      value: "V",
    },
  ];
  partners: any[];
  staffs: any[];
  offices: any[];
  totalFeeSum = 0;
  totalFeePaid = 0;
  totalFeePaidDE = 0;
  totalFeeRemain = 0;
  panelOpenState = true;
  filterData: any[];
  groupData: any;
  searchText = "";
  today = new Date();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private savingsService: SavingsService,
    private clientServices: ClientsService,
    private midasClientServices: MidasClientService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
    });
    this.formFilter = this.formBuilder.group({
      status: ["A"],
      txnType: [""],
      officeName: [""],
      createdByName: [""],
      agencyName: [""],
      customerName: [""],
      traceNo: [""],
      batchNo: [""],
      txnPaymentCode: [""],
      txnPaymentType: [""],
      RetailsChoose: [true],
      wholesaleChoose: [true],
      staffName: [""],
    });

    this.formFilter.valueChanges.subscribe((value) => {
      this.filterTransaction();
    });
  }

  colorOfType(type: string) {
    if (type === "IN") {
      return "color: green; font-weight: bold;";
    }
    if (type === "OUT") {
      return "color: red;  font-weight: bold;";
    }
    return "";
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    this.dataSource = this.transactionsData;
    this.savingsService.getListPartner().subscribe((partner) => {
      this.partners = partner?.result?.listPartner;
      // @ts-ignore
      this.partners.unshift({ code: "", desc: "Tất cả" });
    });
    this.clientServices.getListUserTeller(this.currentUser.officeId).subscribe((result: any) => {
      this.staffs = result?.result?.listStaff.filter((staff: any) => staff.displayName.startsWith("R"));
      this.staffs.unshift({
        id: "",
        displayName: "Tất cả",
      });
    });

    this.transactionService.getPaymentTypes().subscribe((result) => {
      this.paidPaymentType = result?.result?.listPayment;
      this.paidPaymentType.unshift({
        code: "",
        desc: "Tất cả",
      });
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
    if (fromDate) {
      fromDate = this.datePipe.transform(fromDate, dateFormat);
    }
    if (toDate) {
      toDate = this.datePipe.transform(toDate, dateFormat);
    }
    this.dataSource = [];
    this.isLoading = true;
    this.transactionService.getFeePaidTransactions(fromDate, toDate).subscribe((result) => {
      this.isLoading = false;
      this.transactionsData = result?.result?.listFeeTransaction;
      this.transactionsData.map((v) => {
        if (!v.agencyId) {
          v.agencyId = "#";
        }
        v.DEAmount = 0;

        v.customerName = v.txnType == "BATCH" ? v.txnCode : v.customerName;
        if (v.txnPaymentType === "OUT") {
          v.DEAmount = v.txnAmount - v.feeSum;
        }
      });
      this.filterTransaction();
    });
  }

  checkPermissions(key: string) {
    const { permissions } = this.currentUser;
    return permissions.includes(key);
  }

  filterTransaction() {
    const limit = this.paginator.pageSize;
    const offset = this.paginator.pageIndex * limit;
    const form = this.formFilter.value;
    const wholesaleChoose = form.wholesaleChoose;
    const RetailsChoose = form.RetailsChoose;
    const keys = Object.keys(form);
    this.filterData = this.transactionsData.filter((v) => {

      for (const key of keys) {
        if (["wholesaleChoose", "RetailsChoose"].indexOf(key) === -1) {
          if (form[key]) {
            if (!v[key]) {
              return false;
            }
            if ("customerName".indexOf(key) != -1) {
              if (!this.clientServices.preProcessText(String(v[key])).toUpperCase().includes(this.clientServices.preProcessText(String(form[key])).toUpperCase())) {
                return false;
              }
            }

            if ("customerName".indexOf(key) === -1) {
              if (!String(v[key])?.toLowerCase().includes(String(form[key])?.toLowerCase())) {
                return false;
              }
            }
          }
        }
      }
      const check_wholesaleChoose = wholesaleChoose ? v.txnType.startsWith("B") : false;
      const check_RetailsChoose = RetailsChoose ? v.txnType === "CASH" || v.txnType === "ROLLTERM" : false;
      if (!check_wholesaleChoose && !check_RetailsChoose) {
        return false;
      }
      return true;
    });
    if (this.searchText) {
      this.filterData = this.filterData.filter((v) => {
        const kes = Object.keys(v);
        for (const key of kes) {
          if (String(v[key]).toUpperCase().includes(this.searchText.toUpperCase())) {
            return true;
          }
        }
        return false;
      });
    }
    this.totalFeeSum = this.filterData.reduce((total: any, num: any) => {
      return total + Math.round(num?.feeSum);
    }, 0);
    this.totalFeePaid = this.filterData.reduce((total: any, num: any) => {
      return total + Math.round(num?.feePaid);
    }, 0);
    this.totalFeePaidDE = this.filterData.reduce((total: any, num: any) => {

      let  DEAmount = 0;
      if (num.txnPaymentCode == 'DE'){
          DEAmount = num?.txnAmount - num?.feeSum;
      }
      return total + Math.round(DEAmount);
    }, 0);
    this.totalFeeRemain = this.filterData.reduce((total: any, num: any) => {
      return total + Math.round(num?.feeRemain);
    }, 0);
    // @ts-ignore
    this.groupData = this.groupBy(this.filterData, (pet) => pet.txnCode);
    this.dataSource = Array.from(this.groupData.keys()).slice(offset, offset + limit);
  }

  getLengthSource() {
    return this.groupData ? Array.from(this.groupData.keys()).length : 0;
  }

  getDataOfGroupTxnCode(code: string) {
    return this.groupData?.get(code);
  }

  groupBy(list: any, keyGetter: any) {
    const map = new Map();
    list.forEach((item: any) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  get fromDateAndToDate() {
    const fromDate = this.formDate.get("fromDate").value;
    const toDate = this.formDate.get("toDate").value;
    if (fromDate && toDate) {
      return true;
    }
    return false;
  }

  menuOpened() {
    console.log("menuOpened");
  }

  menuClosed() {
    console.log("menuClosed");
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

  collectFeeGetAdvanceAutoByUserId(){
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Bạn chắc chắn muốn lưu giao dịch",
        title: "Hoàn thành giao dịch",
      },
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {

        let formDialogGet = this.formBuilder.group({
          paymentCodeGet: ["AM"],
          amountGet: [""],
          savingAccountGet: [""],
          noteGet: [""],
          paymentCode: ["FT"],
          savingAccountPaid: [""],
          routingCodePartner: [""],
          amountPaid: [0],
          notePaid: [""],
          txnCode: [""],
        });
        let countFee = 0;
        let countTransaction = 0;
        let filterDataIn = this.transactionsData.filter((v) => {
            return v.txnPaymentType == "IN" &&   v.txnType == "ROLLTERM" && v.status == "A"  && v.createdBy == this.currentUser.userId
        })
        for (let index = 0; index < filterDataIn.length; index++) {
          const element = filterDataIn[index];
          this.midasClientServices.getListSavingAccountByClientId(element.customerId).subscribe((result: any) => {
            let clientAccount = result?.result?.listSavingAccount;
            if (clientAccount.length > 0 ) {
              formDialogGet.get("savingAccountGet").setValue(clientAccount[0].id);
              formDialogGet.get("txnCode").setValue(element.txnCode);
              formDialogGet.get("amountGet").setValue(element.feeRemain);

              this.isLoading = true;
              this.transactionService.paidFeeForTransaction(formDialogGet.value).subscribe((res) => {
                this.isLoading = false;
                countTransaction += 1;
                if (res.error || !res?.result?.resultCommand) {
                  return;
                }else {
                  countFee += 1;
                }

                if (countTransaction == filterDataIn.length) {
                  let messageReceived = 'Thu phí thành công ' + countFee + " giao dịch"
                  this.alertService.alert({ message: messageReceived, msgClass: "cssSuccess" });
                  this.getTransaction();
                }
              });
            }
          });

       };

      }
    });


  }

  addFeeDialog(txnCode: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: {
        txnCode: txnCode,
      },
    };
    // dialogConfig.minWidth = 400;
    const dialog = this.dialog.open(AddFeeDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe((data) => {
      if (data && data.status) {
        this.getTransaction();
      }
    });
  }

  viewFeeDialog(txnCode: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: {
        txnCode: txnCode,
      },
    };
    dialogConfig.minWidth = 1000;
    const dialog = this.dialog.open(ViewFeePaidTransactionDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe((data) => {
      if (data && data.status) {
        this.getTransaction();
      }
    });
  }

  applyFilter(text: string) {
    this.searchText = text;
    this.filterTransaction();
  }

  checkShowButton(txnCode: string) {
    const txn = this.getDataOfGroupTxnCode(txnCode).find((v: any) => v.status == "A") || false;
    return txn;
  }

  checkFeePaid(txnCode: string) {
    const txn = this.getDataOfGroupTxnCode(txnCode).find((v: any) => v.feePaid > 0) || false;
    return txn;
  }

  exportTransactionFeePaid() {
    const refids = this.filterData.map((v) => {
      return v.refid;
    });
    const re = refids.toString().split(",").join("-");
    this.transactionService.exportTransactionFeePaid(re);
  }
}
