/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";

/** Custom Services */
import { GroupsService } from "../groups.service";
import { SettingsService } from "app/settings/settings.service";
import { MatTableDataSource } from "@angular/material/table";
/**
 * Edit Group component.
 */
export interface PeriodicElements {
  cardType: string;
  cardDescription: string;
  minValue: number;
  maxValue: number;
}
interface groupT {
  value: string;
  viewValue: string;
}
@Component({
  selector: "mifosx-edit-group",
  templateUrl: "./edit-group.component.html",
  styleUrls: ["./edit-group.component.scss"],
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
    { value: "I", viewValue: "Group lẻ, MGM" },
    { value: "C", viewValue: "Group sỉ" },
  ];

  groupTypeId: any;
  displayedColumns: string[] = ["cardDescription", "minValue", "maxValue"];
  dataSource = new MatTableDataSource<any>();
  cards: PeriodicElements[] = [];
  /**
   * Retrieves the offices data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {GroupsService} groupService GroupsService.
   * @param {DatePipe} datePipe Date Pipe to format date.
   * @param {SettingsService} settingsService SettingsService
   */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupsService,
    private datePipe: DatePipe,
    private settingsService: SettingsService
  ) {
    this.route.data.subscribe((data: { groupAndTemplateData: any; groupViewData: any }) => {
      this.staffData = data.groupAndTemplateData.staffOptions;
      this.groupData = data.groupAndTemplateData;
      this.submittedOnDate =
        data.groupViewData.timeline.submittedOnDate && new Date(data.groupViewData.timeline.submittedOnDate);
    });
  }

  /**
   * Creates and sets the edit group form.
   */
  ngOnInit() {
    let name = String(this.groupData.name).trim().replace("(C)", "");
    name = String(name).trim().replace("(I)", "");

    if (this.groupData.name.indexOf("(C)") === -1) {
      this.groupTypeId = this.groupType[0].value;
    } else {
      this.groupTypeId = this.groupType[1].value;
    }

    this.createEditGroupForm();
    this.editGroupForm.patchValue({
      name: name,
      submittedOnDate: this.submittedOnDate,
      staffId: this.groupData.staffId,
      externalId: this.groupData.externalId,
      groupTypeId: this.groupTypeId,
    });

    this.groupService.getCartTypesByGroupId(this.groupData.id).subscribe((data: any) => {
      data.result.listFeeGroup.forEach((item: any) => {
        let fee = {
          cardType: item.cardType,
          cardDescription: item.description,
          minValue: item.minValue,
          maxValue: item.maxValue,
        };
        this.cards.push(fee);
      });

      data.result.listFeeRewardGroup?.forEach((item: any) => {
        this.editGroupForm.patchValue({
          feeReward: item.minValue,
        });
        return;
      });
      this.dataSource.data = this.cards;
    });
  }

  /**
   * Creates the edit group form.
   */
  createEditGroupForm() {
    this.editGroupForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^([^!@#$%^&*()+=<>,?/]*)$")]],
      submittedOnDate: ["", Validators.required],
      staffId: [""],
      externalId: [""],
      groupTypeId: [""],
      feeReward: [""],
    });
    this.buildDependencies();
  }

  /**
   * Adds form control Activation Date if group is active.
   */
  buildDependencies() {
    if (this.groupData.active) {
      this.editGroupForm.addControl("activationDate", new FormControl("", Validators.required));
      this.editGroupForm
        .get("activationDate")
        .patchValue(this.groupData.activationDate && new Date(this.groupData.activationDate));
    } else {
      this.editGroupForm.removeControl("activationDate");
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
      activationDate: activationDate && this.datePipe.transform(activationDate, dateFormat),
    });
    const group = this.editGroupForm.value;

    let name = String(group.name).trim().replace("(I)", "").replace("(C)", "");
    if (group.groupTypeId === "C") {
      group.name = "(C) " + name;
    } else {
      let name = String(group.name).trim().replace("(I)", "");
      group.name = "(I) " + name;
    }

    delete group.groupTypeId;
    delete group.feeReward;

    group.locale = this.settingsService.language.code;
    group.dateFormat = dateFormat;

    this.groupService.updateGroup(group, this.groupData.id).subscribe((response: any) => {
      //this.router.navigate(['../'], { relativeTo: this.route });
      this.updateFeeGroup(response);
    });
  }
  updateFeeGroup(groupObj: any) {
    this.groupService
      .updateFeeGroup(groupObj.groupId, this.cards, this.editGroupForm?.controls["feeReward"]?.value)
      .subscribe((response: any) => {
        this.router.navigate(["../general"], { relativeTo: this.route });
      });
  }

  onBlur(event: any, index: any) {
    console.log("value_input === ", event.target.value);
    console.log("value === === ", event.target.id);
    let name_input = event.target.id;
    this.cards.forEach((item: any) => {
      if (item.cardType == index.cardType) {
        Object.keys(item).forEach(function (key) {
          if (name_input.split("_")[1] == key) {
            item[key] = Number(event.target.value);
          }
        });
      }
    });
  }
}
