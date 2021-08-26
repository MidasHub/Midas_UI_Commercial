/** Angular Imports */
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { DatePipe } from '@angular/common';

/** Custom Services */
import { GroupsService } from '../groups.service';
import { ClientsService } from '../../clients/clients.service';
import { SettingsService } from 'app/settings/settings.service';
import { MatTableDataSource } from '@angular/material/table';
import { I18nService } from 'app/core/i18n/i18n.service';
import { AlertService } from 'app/core/alert/alert.service';
import { SavingsService } from 'app/savings/savings.service';
/**
 * Create Group component.
 */
export interface PeriodicElement {
  cardType: string;
  cardDescription: string;
  minValue: number;
  maxValue: number;
}
@Component({
  selector: 'mifosx-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit, AfterViewInit {
  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Group form. */
  groupForm: FormGroup = new FormGroup({});
  /** Office data. */
  officeData: any;
  /** Client data. */
  clientsData: any = [];
  /** Staff data. */
  staffData: any;
  activateAndApproveAccountForm: FormGroup = new FormGroup({});
  /** Client Members. */
  clientMembers: any[] = [];
  /** ClientChoice. */
  clientChoice = new FormControl('');
  /** Go_back param */
  go_back: any;

  groupType: any[] = [
    { value: '1', viewValue: 'Group sỉ' },
    { value: '0', viewValue: 'Group lẻ, MGM' },
  ];
  groupTypeId!: number;
  displayedColumns: string[] = ['cardDescription', 'minValue', 'maxValue'];
  dataSource = new MatTableDataSource<any>();
  cards: PeriodicElement[] = [];
  /** Savings Account Details Form */
  savingsAccountDetailsForm: FormGroup = new FormGroup({});
  /**
   * Retrieves the offices data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {ClientsService} clientsService CentersService.
   * @param {GroupsService} groupService GroupsService.
   * @param {DatePipe} datePipe Date Pipe to format date.
   * @param {SettingsService} settingsService SettingsService
   */
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private groupService: GroupsService,
    private datePipe: DatePipe,
    private settingsService: SettingsService,
    private alertservice: AlertService,
    private savingsService: SavingsService,
    private i18n: I18nService
  ) {
    this.route.data.subscribe((data: { offices: any } | Data) => {
      this.officeData = data.offices;
    });
    /** Get go_back params */
    this.route.params.subscribe((params) => {
      const { go_back } = params;
      if (go_back) {
        this.go_back = go_back;
      }
    });
  }

  /**
   * Creates and sets the group form.
   */
  ngOnInit() {
    this.createGroupForm();
    this.groupService.getCartTypes().subscribe((data: any) => {
      data.result.listCardType.forEach((cardType: any) => {
        const fee = {
          cardType: cardType.code,
          cardDescription: cardType.description,
          minValue: 2.0,
          maxValue: 2.0,
        };
        this.cards.push(fee);
      });
      this.dataSource.data = this.cards;
    });
  }
  /**
   * Subscribes to Clients search filter:
   */
  ngAfterViewInit() {
    this.clientChoice.valueChanges.subscribe((value: string) => {
      if (value.length >= 2) {
        this.clientsService
          .getFilteredClients('displayName', 'ASC', true, value, this.groupForm.get('officeId')?.value)
          .subscribe((data: any) => {
            this.clientsData = data.pageItems;
          });
      }
    });
  }

  /**
   * Creates the group form.
   */
  createGroupForm() {
    this.groupTypeId = 0;
    this.groupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^([^!@#$%^&*()+=<>,?/]*)$')]],
      officeId: ['', Validators.required],
      submittedOnDate: [new Date(), Validators.required],
      staffId: [''],
      externalId: [''],
      active: [true],
      activationDate: [new Date(), Validators.required],
      groupTypeId: this.groupTypeId,
    });
    this.buildDependencies();
  }
  /**
   * Sets the staff and clients data each time the user selects a new office.
   * Adds form control Activation Date if active.
   */
  buildDependencies() {
    this.groupForm.get('officeId')?.valueChanges.subscribe((option: any) => {
      this.groupService.getStaff(option).subscribe((data) => {
        this.staffData = data['staffOptions'];
        if (this.staffData === undefined) {
          this.groupForm.controls['staffId'].disable();
        } else {
          this.groupForm.controls['staffId'].enable();
        }
      });
    });
    // this.groupForm.get('active').valueChanges.subscribe((bool: boolean) => {
    //   if (bool) {
    //     this.groupForm.addControl('activationDate', new FormControl('', Validators.required));
    //   } else {
    //     this.groupForm.removeControl('activationDate');
    //   }
    // });
  }

  /**
   * Add client.
   */
  addClient() {
    if (!this.clientMembers.includes(this.clientChoice.value)) {
      this.clientMembers.push(this.clientChoice.value);
    }
  }

  /**
   * Remove client.
   * @param index Client's array index.
   */
  removeClient(index: number) {
    this.clientMembers.splice(index, 1);
  }

  /**
   * Displays Client name in form control input.
   * @param {any} client Client data.
   * @returns {string} Client name if valid otherwise undefined.
   */
  displayClient(client: any): string  {
    return client ? client.displayName : '';
  }

  /**
   * Submits the group form and creates group,
   * if successful redirects to groups.
   */
  submit() {
    const submittedOnDate: Date = this.groupForm.value.submittedOnDate;
    const activationDate: Date = this.groupForm.value.activationDate;
    // TODO: Update once language and date settings are setup
    const dateFormat = this.settingsService.dateFormat;
    this.groupForm.patchValue({
      submittedOnDate: this.datePipe.transform(submittedOnDate, dateFormat),
      activationDate: this.datePipe.transform(activationDate, dateFormat),
    });
    const group = this.groupForm.value;
    group.locale = this.settingsService.language.code;
    group.dateFormat = dateFormat;
    group.clientMembers = [];
    this.clientMembers.forEach((client: any) => group.clientMembers.push(client.id));

    if (group.groupTypeId === 1) {
      const name = String(group.name).trim().replace('(C)', '');
      group.name = '(C) ' + name;
    } else {
      const name = String(group.name).trim().replace('(I)', '');
      group.name = '(I) ' + name;
    }
    delete group.groupTypeId;
    this.groupService.createGroup(group).subscribe((response: any) => {
      this.createGroupSavingAccountTemplate(response.groupId, '7');
      this.createFeeGroup(response);
    });
  }

  createFeeGroup(groupObj: any) {
    this.groupService.createFeeGroup(groupObj.groupId, this.cards).subscribe((response: any) => {
      /** Check if go_back is exist, then go back to home page */
      if (this.go_back === 'home') {
        this.alertservice.alert({
          message: this.i18n.getTranslate('Group_Component.Create_Group_Component.msgCreatedGroup'),
          msgClass: 'cssSuccess',
        });
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['../groups']);
      }
    });
  }

  onBlur(event: any, index: any) {
    console.log('value_input === ', event.target.value);
    console.log('value === === ', event.target.id);
    const name_input = event.target.id;
    this.cards.forEach((item: any) => {
      if (item.cardType === index.cardType) {
        Object.keys(item).forEach(function (key) {
          if (name_input.split('_')[1] === key) {
            item[key] = Number(event.target.value);
          }
        });
      }
    });
  }

  createGroupSavingAccountTemplate(groupId: string, productId: string) {
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;

    this.savingsService.getSavingsAccountTemplate(groupId, productId, true).subscribe((response: any) => {
      this.savingsService.createGroupSavingsAccount(groupId, productId, response).subscribe((savingsAccount: any) => {
        this.activateAndApproveAccountForm = this.formBuilder.group({
          approvedOnDate: [new Date(), Validators.required],
        });
        this.activateAndApproveAccountForm.patchValue({
          approvedOnDate: this.datePipe.transform(new Date(), dateFormat),
        });
        const data = {
          ...this.activateAndApproveAccountForm.value,
          dateFormat,
          locale,
        };

        this.savingsService.executeSavingsAccountCommand(savingsAccount.savingsId, 'approve', data).subscribe(() => {
          this.activateAndApproveAccountForm = this.formBuilder.group({
            activatedOnDate: [new Date(), Validators.required],
          });
          this.activateAndApproveAccountForm.patchValue({
            activatedOnDate: this.datePipe.transform(new Date(), dateFormat),
          });
          const dataG = {
            ...this.activateAndApproveAccountForm.value,
            dateFormat,
            locale,
          };
          this.savingsService.executeSavingsAccountCommand(savingsAccount.savingsId, 'activate', dataG).subscribe(() => {
            this.groupService
              .updateDefaultSavingAccount({ groupId: groupId, savingAccountId: savingsAccount.savingsId })
              .subscribe((result: any) => {
                if (result.result.status) {
                  // successfully update default saving account
                } else {
                  this.alertservice.alert({
                    message: result.result.message,
                    msgClass: 'cssWarning',
                  });
                }
              });
          });
        });
      });
    });
  }
}
