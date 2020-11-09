/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

/** Custom Services */
import { GroupsService } from '../groups.service';
import { SettingsService } from 'app/settings/settings.service';
import { MatTableDataSource } from '@angular/material/table';
/**
 * Edit Group component.
 */
export interface PeriodicElements {
  cardType: string;
  cardDescription: string;
  minValue: number;
  maxValue: number;
}
export interface groupT {
  key: number;
  value: string;
}
@Component({
  selector: 'mifosx-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Edit Group form. */
  editGroupForm: FormGroup;
  /** Staff data. */
  staffData: any;
  /** Group Data */
  groupData: any;
  /** Submitted On Date */
  submittedOnDate: any;
  groupType: groupT[] = [
    {key: 0, value: 'Group lẻ, MGM'},
    {key: 1, value: 'Group sỉ'}
  ];

  groupTypeId : number;
  displayedColumns: string[] = ['cardDescription', 'minValue', 'maxValue'];
  dataSource = new MatTableDataSource<any>();
  cards : PeriodicElements[] = [];
  /**
   * Retrieves the offices data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {GroupsService} groupService GroupsService.
   * @param {DatePipe} datePipe Date Pipe to format date.
   * @param {SettingsService} settingsService SettingsService
   */
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private groupService: GroupsService,
              private datePipe: DatePipe,
              private settingsService: SettingsService) {
    this.route.data.subscribe( (data: { groupAndTemplateData: any, groupViewData: any } ) => {
      this.staffData = data.groupAndTemplateData.staffOptions;
      this.groupData = data.groupAndTemplateData;
      this.submittedOnDate = data.groupViewData.timeline.submittedOnDate && new Date(data.groupViewData.timeline.submittedOnDate);
    });
  }

  /**
   * Creates and sets the edit group form.
   */
  ngOnInit() {
    let name = String(this.groupData.name).trim().replace('(C)', ''); 
    name = String(name).trim().replace('(I)', '');
    if(this.groupData.name.search("(C)") > 0){
      this.groupTypeId = 1;
    }else{
      this.groupTypeId = 0;
    }
    let s =  {key: 1, value: 'Group sỉ'};
    this.createEditGroupForm();
    this.editGroupForm.patchValue({
      'name': name,
      'submittedOnDate': this.submittedOnDate,
      'staffId': this.groupData.staffId,
      'externalId': this.groupData.externalId,
      'groupTypeId':this.groupTypeId
    });

    this.groupService.getCartTypesByGroupId(this.groupData.id).subscribe( (data: any) => {
      data.result.listFeeGroup.forEach((item: any) =>{
         let fee = {
             cardType: item.cardType , 
             cardDescription: item.description ,
             minValue: item.minValue , 
             maxValue: item.maxValue ,
         };
         this.cards.push(fee);
      }); 
      this.dataSource.data = this.cards;
    });
  }

  /**
   * Creates the edit group form.
   */
  createEditGroupForm() {
    this.editGroupForm = this.formBuilder.group({
      'name': ['', [Validators.required, Validators.pattern('^([^!@#$%^&*()_+=<>,.?\/\-]*)$')]],
      'submittedOnDate': ['', Validators.required],
      'staffId': [''],
      'externalId': [''],
      'groupTypeId':['']
    });
    this.buildDependencies();
  }

  /**
   * Adds form control Activation Date if group is active.
   */
  buildDependencies() {
    if (this.groupData.active) {
      this.editGroupForm.addControl('activationDate', new FormControl('', Validators.required));
      this.editGroupForm.get('activationDate').patchValue(this.groupData.activationDate && new Date(this.groupData.activationDate));
    } else {
      this.editGroupForm.removeControl('activationDate');
    }
  }

  /**
   * Submits the group form and edits group,
   * if successful redirects to groups.
   */
  submit() {
    const submittedOnDate: Date = this.editGroupForm.value.submittedOnDate;
    const activationDate: Date = this.editGroupForm.value.activationDate;
    // TODO: Update once language and date settings are setup
    const dateFormat = this.settingsService.dateFormat;
    this.editGroupForm.patchValue({
      submittedOnDate: this.datePipe.transform(submittedOnDate, dateFormat),
      activationDate: activationDate && this.datePipe.transform(activationDate, dateFormat)
    });
    const group = this.editGroupForm.value;

    if (group.groupTypeId == 1) {
      let name = String(group.name).trim().replace('(C)', '');
      group.name = "(C) " + name;
    } else {
      let name = String(group.name).trim().replace('(I)', '');
      group.name = "(I) " + name;
    }
    
    delete group.groupTypeId;

    group.locale = this.settingsService.language.code;
    group.dateFormat = dateFormat;
 
    this.groupService.updateGroup(group, this.groupData.id).subscribe((response: any) => {
      //this.router.navigate(['../'], { relativeTo: this.route });
      this.updateFeeGroup(response);
    });
  }
  updateFeeGroup(groupObj:any){
    this.groupService.updateFeeGroup(groupObj.groupId,this.cards).subscribe((response: any) => {
       
      this.router.navigate(['../general'], { relativeTo: this.route });
    });
  }

  onKey(event: any, index:any) {
    
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && ((charCode < 45 ||  charCode == 47) || charCode > 57)) {
      return false;
    }
    let name_input = event.target.id;
    let value_input = event.target.value;
    this.cards.forEach((item: any) =>{
      if(item.cardType == index.cardType){ 
        Object.keys(item).forEach(function (key){
          console.log(item[key]);
          if(name_input.split("_")[1] == key){
            item[key] = Number(value_input);
          }
        });
      } 
    }); 
  }
}
