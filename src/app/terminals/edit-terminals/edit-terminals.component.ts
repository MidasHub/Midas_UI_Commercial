import { Component, OnInit, ChangeDetectorRef ,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TerminalsService } from '../terminals.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
export interface PeriodicElements {
  officeId : number,
  officeName : string,
  cardCode : string,
  cardDescription : string,
  costPercentage : number,
  cogsPercentage :  number,
  txnRateMin :  number,
  txnRateMax :  number,
  maxLimitAmount : number,
  levelLimit : number,
  limitAmount :number
}
@Component({
  selector: 'midas-edit-terminals',
  templateUrl: './edit-terminals.component.html',
  styleUrls: ['./edit-terminals.component.scss']
})
export class EditTerminalsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  editTerminalForm:FormGroup;
  offices:any;
  terminalData: any;
  merchants:any; 
  cardTypes:any;
  posStatus:any;
  ItemPosLimitList:any;
  ItemPosBranch:any;
  ItemPos:any;
  posLimits : PeriodicElements[] = [];
  posLimitDefault : PeriodicElements[] = [];
  data_new:any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Office', 'CardType', 'FeePOS', 
    'FeeCost', 'FeeMin','FeeMax','MaxLimitAmountTransaction','LevelTransactionCard'];
  
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private terminalsService: TerminalsService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef
    ) {
    this.route.data.subscribe((data: { terminalData: any }) => {
      this.terminalData     = data.terminalData.result;
      this.merchants        = data.terminalData.result.Merchants;
      this.offices          = data.terminalData.result.listOffices;
      this.cardTypes        = data.terminalData.result.listCardType;
      this.posStatus        =  data.terminalData.result.posStatus;
      this.ItemPosLimitList = data.terminalData.result.ItemPosLimitList;
      this.ItemPos          = data.terminalData.result.ItemPos;
      this.ItemPosBranch    = data.terminalData.result.ItemPosBranch;
      this.dataSource.data = this.ItemPosLimitList;
      this.posLimitDefault = this.ItemPosLimitList;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(){ 
    this.createEditTerminalForm();
    this.editTerminalForm.patchValue({
      'terminalId': this.ItemPos.terminalId,
      'terminalCode': this.ItemPos.terminalCode,
      'terminalName': this.ItemPos.terminalName,
      'limitAmount': this.ItemPosLimitList[0].limitAmount,
      'officeId': this.ItemPosBranch.officeId,
      'minFeeDefault': this.ItemPos.minFeeDefault,
      'merchantId': this.ItemPosBranch.merchantId,
      'status': this.ItemPos.status == 'A' ? true : false,
      'costPercentage':this.ItemPosLimitList[0].costPercentage,
      'cogsPercentage':this.ItemPosLimitList[0].cogsPercentage,
      'txnRateMin':this.ItemPosLimitList[0].txnRateMin,
      'txnRateMax':this.ItemPosLimitList[0].txnRateMax,
      'maxLimitAmount':this.ItemPosLimitList[0].maxLimitAmount,
      'levelLimit': this.ItemPosLimitList[0].levelLimit,
    });
  }
   
  createEditTerminalForm() {
    this.editTerminalForm = this.formBuilder.group({
      'terminalId': ['', [Validators.required, Validators.pattern('^([^!@#$%^&*()+=<>,.?\/\]*)$')]],
      'terminalCode': ['', [Validators.required,]],
      'terminalName': ['', [Validators.required,]],
      'merchantId': ['',[Validators.required]],
      'officeId': ['',[Validators.required]],
      'status': [true],
      'minFeeDefault': ['',[Validators.required,Validators.min(0)]],
      'costPercentage':['',[Validators.max(100),Validators.min(0)]],
      'cogsPercentage': ['',[Validators.max(100),Validators.min(0)]],
      'txnRateMin': ['',[Validators.max(100),Validators.min(0)]],
      'txnRateMax': ['',[Validators.max(100),Validators.min(0)]],
      'maxLimitAmount': ['',[Validators.required,Validators.min(1000000)]],
      'levelLimit': ['',[Validators.required,Validators.min(1)]],
      'limitAmount': ['',[Validators.required,Validators.min(0)]],
    });
  }

  setDefaultFeeSettingPos() { 
    const costPercentage  = this.editTerminalForm.value.costPercentage;
    const cogsPercentage  = this.editTerminalForm.value.cogsPercentage;
    const txnRateMin      = this.editTerminalForm.value.txnRateMin;
    const txnRateMax      = this.editTerminalForm.value.txnRateMax;
    const maxLimitAmount  = this.editTerminalForm.value.maxLimitAmount;
    const levelLimit      = this.editTerminalForm.value.levelLimit;
    const limitAmount  = this.editTerminalForm.value.limitAmount;
    this.posLimits = [];
     this.offices.forEach ((office: any) =>{
      this.cardTypes.forEach((card: any) =>{
            let limit = {
                officeId : office.id,
                officeName : office.name,
                cardCode : card.code,
                cardDescription : card.description,
                costPercentage : costPercentage,
                cogsPercentage :  cogsPercentage,
                txnRateMin :  txnRateMin,
                txnRateMax :  txnRateMax,
                maxLimitAmount : maxLimitAmount,
                levelLimit : levelLimit,
                limitAmount : limitAmount,
            }
            this.posLimits.push(limit);
        })
      // this.dataSource.data = this.posLimits; 
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    })
    this.dataSource.data = this.posLimits;
    // this.cdr.detectChanges();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
}
  
 
applyFilter(filterValue: string) {
  filterValue = filterValue.trim();
  filterValue = filterValue.toLowerCase();
  this.dataSource.filter = filterValue;
}
   
  reset(){
    this.dataSource.data = this.posLimitDefault;
    this.cdr.detectChanges();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  submit(){
    if (!this.editTerminalForm.valid) {
      return false;
    }
    var formData = this.editTerminalForm.value;
    formData.status = formData.status == true ? "A":"D";
    const data = {
        ...this.editTerminalForm.value,
      "dateFormat": "dd/MM/yyyy",
      "listLimit" : JSON.stringify(this.dataSource.data),
    };
  
    this.terminalsService.update(data).subscribe((response: any) => {
        console.log("response",response);
        //this.router.navigate(['../terminals'], { relativeTo: this.route });
    });
  
  }

  validateNumberFoElement(event:any, element:any){
  
    let name_input = event.target.id;
    let value_input = event.target.value;
    const index = name_input.split("_")[0] ; 

    value_input = value_input.replace(/[^0-9\.]/g,'');
      if(value_input.split('.').length>2) 
        value_input =value_input.replace(/\.+$/,"");

    let dataCopy = this.dataSource.data;
    var e = element;
    Object.keys(element).forEach(function (key){
      if(name_input.split("_")[1] == key){
        e[key] = Number(value_input);
      }
    });
    dataCopy.splice(index, 1);
    dataCopy.splice(index, 0, e);
    this.dataSource.data = dataCopy;
  }

}
