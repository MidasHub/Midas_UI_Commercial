import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { TerminalsService } from "../terminals.service";
import { ErrorDialogComponent } from "app/shared/error-dialog/error-dialog.component";
import { MatDialog } from "@angular/material/dialog";

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { BanksService } from "app/banks/banks.service";
import { AlertService } from "app/core/alert/alert.service";
export interface PeriodicElements {
  officeId: number;
  officeName: string;
  cardCode: string;
  cardDescription: string;
  costPercentage: number;
  cogsPercentage: number;
  txnRateMin: number;
  txnRateMax: number;
  maxLimitAmount: number;
  levelLimit: number;
  limitAmount: number;
}
@Component({
  selector: "midas-edit-terminals",
  templateUrl: "./edit-terminals.component.html",
  styleUrls: ["./edit-terminals.component.scss"],
})
export class EditTerminalsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  editTerminalForm: FormGroup;
  officeSelect = new FormControl();
  offices: any;
  terminalData: any;
  merchants: any;
  isOwner: boolean = false;
  cardTypes: any;
  ItemPosLimitList: any;
  ItemPosBranch: any;
  ItemPos: any;
  banks: any[] = [];
  posLimits: any;
  posLimitDefault: PeriodicElements[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    "officeName",
    "CardType",
    "FeeCost",
    "FeeCOGS",
    "FeeMin",
    "FeeMax",
    "MaxLimitAmountTransaction",
    "LevelTransactionCard",
  ];

  typeOfTransactions: typeOfTransaction[] = [
    { value: "ALL", valueDesc: "khách hàng Sỉ & Lẻ" },
    { value: "SI", valueDesc: "khách hàng Sỉ" },
    { value: "LE", valueDesc: "khách hàng Lẻ" },
  ];
  commonCardBanks: any[] = this.bankService.documentCardBanks;
  commonCardTypes: any[] = this.bankService.documentCardTypes;
  commonOffices: any[] = this.bankService.documentOffices;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private terminalsService: TerminalsService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private bankService: BanksService
  ) {}

  showOfficeName(officeId: number) {
    let officeInfo = this.offices?.filter((o: any) => o.officeId == officeId);
    return officeInfo[0]?.name;
  }

  showCardName(cardCode: number) {
    let cardInfo = this.cardTypes?.filter((c: any) => c.code == cardCode);
    return cardInfo[0]?.description;
  }

  ngOnInit() {
    this.route.data.subscribe((data: { terminalData: any }) => {
      this.terminalData = data.terminalData.result;
      this.isOwner = this.terminalData.isOwner;
      this.merchants = data.terminalData.result.Merchants;
      // this.offices          = this.commonOffices;
      // this.cardTypes        = this.commonCardTypes;
      this.ItemPos = data.terminalData.result.ItemPos;
      this.ItemPosBranch = data.terminalData.result.ItemPosBranch;
      // this.banks =  this.commonCardBanks;
      this.ItemPosLimitList = data.terminalData.result.ItemPosLimitList;

      this.bankService.getListOfficeCommon().subscribe((offices: any) => {
        this.offices = offices.result.listOffice;
        this.ItemPosLimitList?.forEach((item: any) => {
          item.officeName = this.showOfficeName(item.officeId);
        });
      });

      this.bankService.gerListBank().subscribe((result) => {
        this.banks = result?.result?.listBank;
      });

      this.bankService.getCardType().subscribe((result) => {
        this.cardTypes = result?.result?.listCardType;
        this.ItemPosLimitList?.forEach((item: any) => {
          item.cardDescription = this.showCardName(item.cardCode);
        });
      });

      this.dataSource.data = this.ItemPosLimitList;
      this.posLimitDefault = this.ItemPosLimitList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.createEditTerminalForm();
    this.editTerminalForm.patchValue({
      terminalId: this.ItemPos.terminalId,
      terminalCode: this.ItemPos.terminalCode,
      terminalName: this.ItemPos.terminalName,
      limitAmount: this.ItemPos.limitAmount,
      officeId: this.ItemPosBranch.officeId,
      bankCode: this.ItemPos.bankCode,
      timeChargeValid: this.ItemPos.timeChargeValid,
      minFeeDefault: this.ItemPos.minFeeDefault,
      merchantId: this.ItemPosBranch.merchantId,
      status: this.ItemPos.status == "A" ? true : false,
      costPercentage: this.terminalData.isOwner ? this.ItemPos.rate : this.terminalData.reqTransfer.rate,
      cogsPercentage: this.ItemPosLimitList ? this.ItemPosLimitList[0]?.cogsPercentage : "",
      txnRateMin: this.ItemPosLimitList ? this.ItemPosLimitList[0]?.txnRateMin : "",
      txnRateMax: this.ItemPosLimitList ? this.ItemPosLimitList[0]?.txnRateMax : "",
      maxLimitAmount: this.ItemPos.maxLimitAmount,
      levelLimit: this.ItemPos.levelLimit,
      typeOfTransaction: this.ItemPos.typeOfTransaction,
      banksCheck: this.terminalData?.bankCheckEntitys?.map((bank: any) => bank.bankCode),
      cardsCheck: this.terminalData?.cardCheckEntitys?.map((card: any) => card.cardType),
    });
  }

  createEditTerminalForm() {
    this.editTerminalForm = this.formBuilder.group({
      terminalId: ["", [Validators.required, Validators.pattern("^([^!@#$%^&*()+=<>,.?/]*)$")]],
      terminalCode: ["", [Validators.required]],
      terminalName: ["", [Validators.required]],
      merchantId: ["", [Validators.required]],
      officeId: ["", [Validators.required]],
      bankCode: ["", [Validators.required]],
      timeChargeValid: ["", [Validators.required, Validators.min(1)]],
      status: [true],
      minFeeDefault: ["", [Validators.required, Validators.min(0), Validators.max(1000000)]],
      costPercentage: ["", [Validators.max(100), Validators.min(0)]],
      cogsPercentage: ["", [Validators.max(100), Validators.min(0)]],
      txnRateMin: ["", [Validators.max(100), Validators.min(0)]],
      txnRateMax: ["", [Validators.max(100), Validators.min(0)]],
      maxLimitAmount: ["", [Validators.required, Validators.min(1000000), Validators.max(100000000000)]],
      levelLimit: ["", [Validators.required, Validators.min(1)]],
      limitAmount: ["", [Validators.required, Validators.min(1000000), Validators.max(100000000000)]],
      typeOfTransaction: [""],
      banksCheck: [this.terminalData.bankCheckEntitys.map((bank: any) => bank.bankCode)],
      cardsCheck: [this.terminalData.cardCheckEntitys.map((card: any) => card.cardType)],
    });
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  setDefaultFeeSettingPos() {
    const costPercentage = this.editTerminalForm.value.costPercentage;
    const cogsPercentage = this.editTerminalForm.value.cogsPercentage;
    const txnRateMin = this.editTerminalForm.value.txnRateMin;
    const txnRateMax = this.editTerminalForm.value.txnRateMax;
    const maxLimitAmount = this.editTerminalForm.value.maxLimitAmount;
    const levelLimit = this.editTerminalForm.value.levelLimit;
    const limitAmount = this.editTerminalForm.value.limitAmount;
    this.posLimits = [];
    this.offices.forEach((office: any) => {
      this.cardTypes.forEach((card: any) => {
        const limit = {
          officeId: office.officeId,
          officeName: office.name,
          cardCode: card.code,
          cardDescription: card.description,
          costPercentage: costPercentage,
          cogsPercentage: cogsPercentage,
          txnRateMin: txnRateMin,
          txnRateMax: txnRateMax,
          maxLimitAmount: maxLimitAmount,
          levelLimit: levelLimit,
          limitAmount: limitAmount,
        };
        this.posLimits.push(limit);
      });
    });
    this.dataSource.data = this.posLimits;

    // this.cdr.detectChanges();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setDefaultFeeSettingPosForOffice() {
    const officeId = this.officeSelect.value;
    const costPercentage = this.editTerminalForm.value.costPercentage;
    const cogsPercentage = this.editTerminalForm.value.cogsPercentage;
    const txnRateMin = this.editTerminalForm.value.txnRateMin;
    const txnRateMax = this.editTerminalForm.value.txnRateMax;
    const maxLimitAmount = this.editTerminalForm.value.maxLimitAmount;
    const levelLimit = this.editTerminalForm.value.levelLimit;
    const limitAmount = this.editTerminalForm.value.limitAmount;
    this.posLimits = this.dataSource.data;

    const office = this.offices?.find((i: any) => i.officeId === officeId);
    this.cardTypes?.forEach((card: any) => {
      const limit = {
        officeId: office.officeId,
        officeName: office.name,
        cardCode: card.code,
        cardDescription: card.description,
        costPercentage: costPercentage,
        cogsPercentage: cogsPercentage,
        txnRateMin: txnRateMin,
        txnRateMax: txnRateMax,
        maxLimitAmount: maxLimitAmount,
        levelLimit: levelLimit,
        limitAmount: limitAmount,
      };
      const item = this.posLimits.findIndex((l: any) => l.officeId === limit.officeId && l.cardCode === limit.cardCode);
      if (item === -1) {
        this.posLimits.push(limit);
      } else {
        this.posLimits[item] = limit;
      }
    });
    this.dataSource.data = this.posLimits;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  reset() {
    this.dataSource.data = this.posLimitDefault;
    this.cdr.detectChanges();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  submit() {
    if (!this.editTerminalForm.valid) {
      return false;
    }
    const formData = this.editTerminalForm.value;
    formData.status = formData.status == true ? "A" : "D";
    const data = {
      ...this.editTerminalForm.value,
      dateFormat: "dd/MM/yyyy",
      listLimit: JSON.stringify(this.dataSource.data),
    };

    this.terminalsService.update(data).subscribe((response: any) => {
      if (response.status != "200") {
        this.alertService.alert({
          message: `Lỗi xảy ra : ${response.error}`,
          msgClass: "cssDanger",
          hPosition: "center",
        });
      } else {
        this.router.navigate(["terminals"]);
      }
      // this.router.navigate(['../terminals'], { relativeTo: this.route });
    });
  }

  validateNumberFoElement(event: any, element: any) {
    const name_input = event.target.id;
    let value_input = event.target.value;
    const index = name_input.split("_")[0];

    value_input = value_input.replace(/[^0-9\.]/g, "");
    if (value_input.split(".").length > 2) {
      value_input = value_input.replace(/\.+$/, "");
    }

    const dataCopy = this.dataSource.data;
    const e = element;
    Object.keys(element).forEach(function (key: any) {
      if (name_input.split("_")[1] === key) {
        e[key] = Number(value_input);
      }
    });
    dataCopy.splice(index - 1, 1, e);
    this.dataSource.data = dataCopy;
  }
}
interface typeOfTransaction {
  value: string;
  valueDesc: string;
}
