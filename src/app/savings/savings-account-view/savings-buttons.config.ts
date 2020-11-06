/** Savings Account Buttons Configuration */
export class SavingsButtonsConfiguration {

  optionArray: {
    name: string,
    taskPermissionName: string,
    action: string
  }[];

  buttonsArray: {
    name: string,
    icon: string,
    taskPermissionName: string,
    action: string
  }[];

  constructor(status: string) {
    this.setOptions(status);
    this.setButtons(status);
  }

  get singleButtons() {
    return this.buttonsArray;
  }

  get options() {
    return this.optionArray;
  }

  setButtons(status: string) {
    switch (status) {
      case 'Active':
        this.buttonsArray = [
          {
            name: 'Saving_Account_Component.ViewSavingAccount.buttonDeposit',
            icon: 'fa fa-arrow-up',
            taskPermissionName: 'DEPOSIT_SAVINGSACCOUNT',
            action: 'Deposit'
          },
          {
            name: 'Saving_Account_Component.ViewSavingAccount.buttonWithdraw',
            icon: 'fa fa-arrow-down',
            taskPermissionName: 'WITHDRAW_SAVINGSACCOUNT',
            action: 'Withdraw'
          },
          // {
          //   name: 'Calculate Interest',
          //   icon: 'fa fa-table',
          //   taskPermissionName: 'CALCULATEINTEREST_SAVINGSACCOUNT'
          // }
        ];
        break;
      // case 'Submitted and pending approval':
      //   this.buttonsArray = [
      //     {
      //       name: 'Modify Application',
      //       icon: 'fa fa-pencil ',
      //       taskPermissionName: 'UPDATE_SAVINGSACCOUNT'
      //     },
      //     {
      //       name: 'Approve',
      //       icon: 'fa fa-check',
      //       taskPermissionName: 'APPROVE_SAVINGSACCOUNT'
      //     }
      //   ];
      //   break;
      // case 'Approved':
      //   this.buttonsArray = [
      //     {
      //       name: 'Undo Approval',
      //       icon: 'fa fa-undo',
      //       taskPermissionName: 'APPROVALUNDO_SAVINGSACCOUNT'
      //     },
      //     {
      //       name: 'Activate',
      //       icon: 'fa fa-check',
      //       taskPermissionName: 'ACTIVATE_SAVINGSACCOUNT'
      //     },
      //     {
      //       name: 'Add Charge',
      //       icon: 'fa fa-plus',
      //       taskPermissionName: 'CREATE_SAVINGSACCOUNTCHARGE'
      //     }
      //   ];
      // break;
      default:
        this.buttonsArray = [];
    }
  }

  setOptions(status: string) {
    switch (status) {
      case 'Active':
        this.optionArray = [
          // {
          //   name: 'Post Interest',
          //   taskPermissionName: 'POSTINTEREST_SAVINGSACCOUNT'
          // },
          // {
          //   name: 'Add Charge',
          //   taskPermissionName: 'CREATE_SAVINGSACCOUNTCHARGE'
          // },
          {
            name: 'Close',
            taskPermissionName: 'CLOSE_SAVINGSACCOUNT',
            action: 'Close'
          }
        ];
        break;
      // case 'Submitted and pending approval':
      //   this.optionArray = [
      //     {
      //       name: 'Reject',
      //       taskPermissionName: 'REJECT_SAVINGSACCOUNT'
      //     },
      //     {
      //       name: 'Withdraw By Client',
      //       taskPermissionName: 'WITHDRAW_SAVINGSACCOUNT'
      //     },
      //     {
      //       name: 'Add Charge',
      //       taskPermissionName: 'CREATE_SAVINGSACCOUNTCHARGE'
      //     },
      //     {
      //       name: 'Delete',
      //       taskPermissionName: 'DELETE_SAVINGSACCOUNT'
      //     }
      //   ];
      //   break;
      case 'Approved':
      default:
        this.optionArray = [];
    }
  }

  addOption(option: { name: string, taskPermissionName: string, action: string }) {
    this.optionArray.push(option);
  }

  addButton(option: { name: string, icon: string, taskPermissionName: string, action: string }) {
    this.buttonsArray.unshift(option);
  }
}
