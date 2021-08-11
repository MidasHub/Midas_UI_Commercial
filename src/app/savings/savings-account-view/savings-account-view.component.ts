/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

/** Custom Dialogs */
import { DeleteDialogComponent } from "app/shared/delete-dialog/delete-dialog.component";
import { CalculateInterestDialogComponent } from "./custom-dialogs/calculate-interest-dialog/calculate-interest-dialog.component";
import { PostInterestDialogComponent } from "./custom-dialogs/post-interest-dialog/post-interest-dialog.component";
import { ToggleWithholdTaxDialogComponent } from "./custom-dialogs/toggle-withhold-tax-dialog/toggle-withhold-tax-dialog.component";

/** Custom Buttons Configuration */
import { SavingsButtonsConfiguration } from "./savings-buttons.config";
import { SavingsService } from "../savings.service";
import { AuthenticationService } from "../../core/authentication/authentication.service";
import { I18nService } from "../../core/i18n/i18n.service";
import { ProductsService } from "../../products/products.service";
import { ClientsService } from "../../clients/clients.service";
import { AdvanceComponent } from "./form-dialog/advance/advance.component";
import { PartnerAdvanceCashComponent } from "./form-dialog/partner-advance-cash/partner-advance-cash.component";
import { AlertService } from "../../core/alert/alert.service";
import { TransferCrossOfficeComponent } from "./form-dialog/transfer-cross-office/transfer-cross-office.component";
import { GroupsService } from "app/groups/groups.service";
import { ConfirmDialogComponent } from "app/transactions/dialog/confirm-dialog/confirm-dialog.component";

/**
 * Savings Account View Component
 */
@Component({
  selector: "mifosx-savings-account-view",
  templateUrl: "./savings-account-view.component.html",
  styleUrls: ["./savings-account-view.component.scss"],
})
export class SavingsAccountViewComponent implements OnInit {
  /** Savings Account Data */
  savingsAccountData: any;
  /** Savings Data Tables */
  savingsDatatables: any;
  /** Button Configurations */
  buttonConfig: SavingsButtonsConfiguration;
  /** Entity Type */
  entityType: string;
  iconBank = "assets/images/savings_account_placeholder.png";
  isTeller = true;
  isBankAcccount = false;
  isCCA = false;
  isCash = false;

  currentUser: any;

  savingProduct: any;
  isIcAccount: boolean = false;

  /**
   * Fetches savings account data from `resolve`
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SavingsService} savingsService Savings Service
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private savingsService: SavingsService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private i18n: I18nService,
    private productsService: ProductsService,
    private alertService: AlertService,
    private groupsService: GroupsService,
    private clientsService: ClientsService
  ) {
    this.route.data.subscribe((data: { savingsAccountData: any; savingsDatatables: any }) => {
      if (data.savingsAccountData.result) {
        this.isIcAccount = true;
        this.savingsAccountData = data.savingsAccountData.result.savingInfo;
      } else {
        this.savingsAccountData = data.savingsAccountData;
      }
      this.savingsDatatables = data.savingsDatatables;
    });
    if (this.router.url.includes("clients")) {
      this.entityType = "Client";
    } else if (this.router.url.includes("groups")) {
      this.entityType = "Group";
    } else if (this.router.url.includes("centers")) {
      this.entityType = "Center";
    }
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.getCredentials();
    const { roles } = this.currentUser;
    const { savingsProductId, externalId } = this.savingsAccountData;

    if (savingsProductId === 2) {
      this.isCCA = true;
    }
    if (savingsProductId === 9) {
      this.isCash = true;
    }
    if (savingsProductId === 8) {
      this.isBankAcccount = true;
      if (externalId.indexOf("#") !== -1) {
        const name = externalId.split("#")[0];
        if (name) {
          this.iconBank = `assets/images/banks/${name}.png`;
        }
      }
      console.log("----------" + this.isBankAcccount);
    }
    this.productsService.getSavingProduct(savingsProductId).subscribe((data: any) => {
      this.savingProduct = data;
      if (["FCA0", "ICA1", "ACA0"].indexOf(this.savingProduct.shortName) === -1 && savingsProductId !== 2) {
        this.buttonConfig.addButton({
          name: "Công nợ khách hàng",
          icon: "fa fa-recycle",
          taskPermissionName: "POSTINTEREST_SAVINGSACCOUNT",
          action: "advanceCash",
        });

        this.buttonConfig.addButton({
          name: "Công nợ IC",
          icon: "fa fa-recycle",
          taskPermissionName: "POSTINTEREST_SAVINGSACCOUNT",
          action: "transferToIc",
        });
      }

      if (["CCA0"].indexOf(this.savingProduct.shortName) !== -1) {
        this.buttonConfig.addButton({
          name: this.i18n.getTranslate("Saving_Account_Component.ViewSavingAccount.buttonTransferFunds"),
          taskPermissionName: "CREATE_ACCOUNTTRANSFER",
          icon: "fa fa-paper-plane",
          action: "Transfer Funds",
        });
      }

      if (["CCA0", "ICA1", "ACA0"].indexOf(this.savingProduct.shortName) === -1) {
        this.buttonConfig.addButton({
          name: "Quản lý vốn đối tác",
          icon: "fas fa-comments-dollar",
          taskPermissionName: "POSTINTEREST_SAVINGSACCOUNT",
          action: "advanceCashPartnerTransaction",
        });

      }

      if (["CCA0", "ACA0"].indexOf(this.savingProduct.shortName) === -1) {

        this.buttonConfig.addButton({
          name: "Chuyển tiền nội bộ",
          icon: "fas fa-exchange-alt",
          taskPermissionName: "POSTINTEREST_SAVINGSACCOUNT",
          action: "transferCrossOfficeCash",
        });
      }

      if ("ICA1" === this.savingProduct.shortName) {
        this.buttonConfig.addButton({
          name: "Điều chuyển vốn",
          icon: "fas fa-exchange-alt",
          taskPermissionName: "POSTINTEREST_SAVINGSACCOUNT",
          action: "transferIc",
        });
      }

      if ("ICA0" === this.savingProduct.shortName) {
        this.buttonConfig = new SavingsButtonsConfiguration("NAN", this.isIcAccount);
      }
    });
    roles.map((role: any) => {
      if (role.id !== 3) {
        this.isTeller = false;
      }
    });
    this.setConditionalButtons();
  }

  displayDescription(type: string) {
    let typeAdvanceCashes: any[] = [
      {
        id: "19",
        value: "Ứng tiền phí",
      },
      {
        id: "62",
        value: "Thu hộ",
      },
      {
        id: "-62",
        value: "Chi hộ",
      },
    ];
    return typeAdvanceCashes.find((v) => v.id === type)?.value || "N/A";
  }

  checkHaveSavingAccountActive(
    entityAdvanceCash: string,
    clientAdvanceCash: any,
    noteAdvance: string,
    amountAdvance: string,
    typeAdvanceCash: string
  ) {
    if (entityAdvanceCash == "C") {
      this.clientsService.getClientAccountDataCross(clientAdvanceCash.id).subscribe((savings) => {
        let ListAccount = savings?.result?.clientAccount?.savingsAccounts;

        if (!ListAccount || ListAccount.length == 0) {
          this.alertService.alert({
            message: "Khách hàng chưa có tài khoản thanh toán, vui lòng thêm tài khoản trước!",
            msgClass: "cssWarning",
          });
          return;
        } else {
          let savingAccountId = null;
          for (let index = 0; index < ListAccount.length; index++) {
            if (ListAccount[index].status.id == 300) {
              savingAccountId = ListAccount[index].id;
            }
          }

          if (!savingAccountId) {
            this.alertService.alert({
              message: "Khách hàng chưa có tài khoản thanh toán còn hoạt động, vui lòng thêm tài khoản trước!",
              msgClass: "cssWarning",
            });
            return;
          } else {
            this.AdvanceCashAction(clientAdvanceCash, savingAccountId, amountAdvance, noteAdvance, typeAdvanceCash);
          }
        }
      });
    } else {
      this.groupsService.getGroupAccountsData(clientAdvanceCash.id).subscribe((savings: any) => {
        let ListAccount = savings?.savingsAccounts;
        if (!ListAccount || ListAccount.length == 0) {
          this.alertService.alert({
            message: "Đại lý chưa có tài khoản thanh toán, vui lòng thêm tài khoản trước!",
            msgClass: "cssWarning",
          });
          return;
        } else {
          let savingAccountId = null;
          for (let index = 0; index < ListAccount.length; index++) {
            if (ListAccount[index].status.id == 300) {
              savingAccountId = ListAccount[index].id;
            }
          }
          if (!savingAccountId) {
            this.alertService.alert({
              message: "Đại lý chưa có tài khoản thanh toán còn hoạt động, vui lòng thêm tài khoản trước!",
              msgClass: "cssWarning",
            });
            return;
          } else {
            this.AdvanceCashAction(clientAdvanceCash, savingAccountId, amountAdvance, noteAdvance, typeAdvanceCash);
          }
        }
      });
    }
  }

  advanceCash() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: "Ứng tiền cho khách hàng",
      currentUser: this.currentUser,
      disableUser: String(this.savingProduct.shortName).startsWith("CCA"),
      savingsAccountData: this.savingsAccountData,
    };
    dialogConfig.minWidth = 800;
    dialogConfig.disableClose = true;
    const refDialog = this.dialog.open(AdvanceComponent, dialogConfig);
    refDialog.afterClosed().subscribe((response: any) => {
      if (response) {
        const {
          entityAdvanceCash,
          clientAdvanceCash,
          noteAdvance,
          amountAdvance,
          typeAdvanceCash,
        } = response?.data?.value;

        this.checkHaveSavingAccountActive(
          entityAdvanceCash,
          clientAdvanceCash,
          noteAdvance,
          amountAdvance,
          typeAdvanceCash
        );
      }
    });
  }

  transferIc(ToIc: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      transferIc: true,
      transferToIc: ToIc,
      savingsAccountData: this.savingsAccountData,
    };
    dialogConfig.minWidth = 400;
    dialogConfig.disableClose = true;
    const refDialog = this.dialog.open(TransferCrossOfficeComponent, dialogConfig);
    refDialog.afterClosed().subscribe((response: any) => {
      if (response) {
        const { typeAdvanceCashes, savingAccountId, note, amount, partnerLocal } = response?.data?.value;

        this.savingsService
          .transferIcTransaction({
            buSavingAccount: this.savingsAccountData.id,
            clientSavingAccount: savingAccountId,
            note: note,
            routingCode: partnerLocal,
            amountAdvanceCash: amount,
            paymentTypeId: typeAdvanceCashes,
          })
          .subscribe((res: any) => {
            const message = `Thực hiện thành công!`;
            this.savingsService.handleResponseApiSavingTransaction(res, message, true );
        });
      }
    });
  }


  AdvanceCashAction(
    clientAdvanceCash: any,
    SavingClientId: string,
    amountAdvance: any,
    noteAdvance: string,
    typeAdvanceCash: string
  ) {
    if (!SavingClientId) {
      return;
    }
    this.savingsService
      .advanceCashTransaction({
        buSavingAccount: this.savingsAccountData.id,
        clientSavingAccount: SavingClientId,
        noteAdvance: clientAdvanceCash.displayName
          ? `${clientAdvanceCash.displayName} - ${noteAdvance}`
          : `${clientAdvanceCash.name} - ${noteAdvance}`,
        amountAdvanceCash: amountAdvance,
        typeAdvanceCash: typeAdvanceCash,
      })
      .subscribe((result: any) => {
        const message = ` ${this.displayDescription(typeAdvanceCash)} thành công cho : ${
          clientAdvanceCash.displayName
            ? ` khách hàng ${clientAdvanceCash.displayName} `
            : ` đại lý ${clientAdvanceCash.name} `
        } với số tiền ${String(amountAdvance).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") + " đ"}`;
        this.savingsService.handleResponseApiSavingTransaction(result, message, true);
      });
  }

  transferCrossOfficeCash() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {};
    dialogConfig.minWidth = 400;
    dialogConfig.disableClose = true;
    const refDialog = this.dialog.open(TransferCrossOfficeComponent, dialogConfig);
    refDialog.afterClosed().subscribe((response: any) => {
      if (response) {
        const { typeAdvanceCashes, savingAccountId, note, amount } = response?.data?.value;
        if (this.savingsAccountData.id == savingAccountId) {
          const dialog = this.dialog.open(ConfirmDialogComponent, {
            data: {
              message: "Giao dịch chọn không hợp lệ (tài khoản nguồn và đích trùng nhau!), tiếp tục thực hiện",
              title: "Hủy giao dịch",
            },
          });
          dialog.afterClosed().subscribe((data) => {
            if (data) {
              this.savingsService
                .transferCrossOfficeCashTransaction({
                  buSavingAccount: this.savingsAccountData.id,
                  clientSavingAccount: savingAccountId,
                  note: note,
                  amountAdvanceCash: amount,
                  paymentTypeId: typeAdvanceCashes,
                })
                .subscribe((result: any) => {
                  const message = `Thực hiện thành công!`;
                  this.savingsService.handleResponseApiSavingTransaction(result, message, true);
                });
            }
          });
        } else {
          this.savingsService
            .transferCrossOfficeCashTransaction({
              buSavingAccount: this.savingsAccountData.id,
              clientSavingAccount: savingAccountId,
              note: note,
              amountAdvanceCash: amount,
              paymentTypeId: typeAdvanceCashes,
            })
            .subscribe((result: any) => {
              const message = `Thực hiện thành công!`;
              this.savingsService.handleResponseApiSavingTransaction(result, message, true);
            });
        }
      }
    });
  }

  advanceCashPartnerTransaction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: "Điều chuyển tiền từ đối tác",
      currentUser: this.currentUser,
    };
    dialogConfig.minWidth = 500;
    dialogConfig.disableClose = true;
    const refDialog = this.dialog.open(PartnerAdvanceCashComponent, dialogConfig);
    refDialog.afterClosed().subscribe((response: any) => {
      if (response) {
        const {
          partnerPaymentType,
          partnerAdvanceCash,
          partnerClientVaultAdvanceCash,
          amountPartnerAdvance,
          notePartnerAdvance,
        } = response?.data?.value;
        this.savingsService
          .advanceCashPartnerTransaction({
            buSavingAccount: this.savingsAccountData.id,
            paymentTypeId: partnerPaymentType,
            amountAdvanceCash: amountPartnerAdvance,
            notePartnerAdvance: notePartnerAdvance,
            partnerAdvanceCash: partnerAdvanceCash?.code,
            partnerClientVaultAdvanceCash: partnerClientVaultAdvanceCash,
          })
          .subscribe((res) => {
            const message = `Điều chuyển tiền từ đối tác: ${partnerAdvanceCash.desc} với số tiền ${
              String(amountPartnerAdvance).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") + " đ"
            }`;
            // this.alertService.alertMsgTop({alertMsg: message});
            // this.alertService.alert({ message: message, msgClass: "cssInfo" });
            this.savingsService.handleResponseApiSavingTransaction(res, message, true);

          });
      }
    });
  }

  /**
   * Adds options to button config. conditionaly.
   */
  setConditionalButtons() {
    const status = this.savingsAccountData.status.value;
    this.buttonConfig = new SavingsButtonsConfiguration(status, this.isIcAccount);
    // if (this.savingsAccountData.clientId || this.savingsAccountData.groupId) {
    //   this.buttonConfig.addButton({
    //     name: this.i18n.getTranslate('Saving_Account_Component.ViewSavingAccount.buttonTransferFunds'),
    //     taskPermissionName: 'CREATE_ACCOUNTTRANSFER',
    //     icon: 'fa fa-paper-plane',
    //     action: 'Transfer Funds',
    //   });
    // }
    // if (!this.savingsAccountData.fieldOfficerId) {
    //   this.buttonConfig.addOption({
    //     name: 'Assign Staff',
    //     taskPermissionName: 'UPDATESAVINGSOFFICER_SAVINGSACCOUNT'
    //   });
    // } else {
    //   this.buttonConfig.addOption({
    //     name: 'Unassign Staff',
    //     taskPermissionName: 'REMOVESAVINGSOFFICER_SAVINGSACCOUNT'
    //   });
    // }
    // if (this.savingsAccountData.charges) {
    //   const charges: any[] = this.savingsAccountData.charges;
    //   charges.forEach((charge: any) => {
    //     if (charge.name === 'Annual fee - INR') {
    //       this.buttonConfig.addOption({
    //         name: 'Apply Annual Fees',
    //         taskPermissionName: 'APPLYANNUALFEE_SAVINGSACCOUNT'
    //       });
    //     }
    //   });
    // }
    // if (this.savingsAccountData.taxGroup) {
    //   if (this.savingsAccountData.withHoldTax) {
    //     this.buttonConfig.addOption({
    //       name: 'Disable Withhold Tax',
    //       taskPermissionName: 'UPDATEWITHHOLDTAX_SAVINGSACCOUNT'
    //     });
    //   } else {
    //     this.buttonConfig.addOption({
    //       name: 'Enable Withhold Tax',
    //       taskPermissionName: 'UPDATEWITHHOLDTAX_SAVINGSACCOUNT'
    //     });
    //   }
    // }
  }

  /**
   * Refetches data foe the component
   * TODO: Replace by a custom reload component instead of hard-coded back-routing.
   */
  private reload() {
    const url: string = this.router.url;
    const refreshUrl: string = this.router.url.slice(
      0,
      this.router.url.indexOf("savings-accounts") + "savings-accounts".length
    );
    this.router.navigateByUrl(refreshUrl, { skipLocationChange: true }).then(() => this.router.navigate([url]));
  }

  /**
   * Performs action button/option action.
   * @param {string} name action name.
   */
  doAction(name: string) {
    switch (name) {
      case "Approve":
      case "Reject":
      case "Deposit":
      case "Activate":
      case "Close":
      case "Undo Approval":
      case "Post Interest As On":
      case "Assign Staff":
      case "Add Charge":
      case "Unassign Staff":
      case "Withdraw By Client":
      case "Apply Annual Fees":
        if (this.isIcAccount) {
          this.router.navigate([`../actions/${name}`], { relativeTo: this.route });
        } else {
          this.router.navigate([`actions/${name}`], { relativeTo: this.route });
        }
        break;
      case "advanceCashPartnerTransaction":
        this.advanceCashPartnerTransaction();
        break;
      case "transferCrossOfficeCash":
        this.transferCrossOfficeCash();
        break;
      case "transferIc":
        this.transferIc(false);
        break;
      case "transferToIc":
        this.transferIc(true);
        break;
      case "Withdraw":
        if (this.isIcAccount) {
          this.router.navigate([`../actions/Withdrawal`], { relativeTo: this.route });
        } else {
          this.router.navigate([`actions/Withdrawal`], { relativeTo: this.route });
        }
        break;
      case "advanceCash":
        this.advanceCash();
        break;
      case "Modify Application":
        this.router.navigate(["edit"], { relativeTo: this.route });
        break;
      case "Delete":
        this.deleteSavingsAccount();
        break;
      case "Calculate Interest":
        this.calculateInterest();
        break;
      case "Post Interest":
        this.postInterest();
        break;
      case "Enable Withhold Tax":
        this.enableWithHoldTax();
        break;
      case "Disable Withhold Tax":
        this.disableWithHoldTax();
        break;
      case "Transfer Funds":
        const queryParams: any = { savingsId: this.savingsAccountData.id, accountType: "fromsavings" };
        this.router.navigate(["transfer-funds/make-account-transfer"], {
          relativeTo: this.route,
          queryParams: queryParams,
        });
        break;
    }
  }

  /**
   * Deletes Savings Account.
   */
  private deleteSavingsAccount() {
    const deleteSavingsAccountDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `savings account with id: ${this.savingsAccountData.id}` },
    });
    deleteSavingsAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.savingsService.deleteSavingsAccount(this.savingsAccountData.id).subscribe(() => {
          this.router.navigate(["../../"], { relativeTo: this.route });
        });
      }
    });
  }

  /**
   * Calculates savings account's interest
   */
  private calculateInterest() {
    const calculateInterestAccountDialogRef = this.dialog.open(CalculateInterestDialogComponent);
    calculateInterestAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        this.savingsService
          .executeSavingsAccountCommand(this.savingsAccountData.id, "calculateInterest", {})
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

  /**
   * Posts savings account's interest
   */
  private postInterest() {
    const postInterestAccountDialogRef = this.dialog.open(PostInterestDialogComponent);
    postInterestAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        this.savingsService
          .executeSavingsAccountCommand(this.savingsAccountData.id, "postInterest", {})
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

  /**
   * Enables withhold tax for savings account.
   */
  private enableWithHoldTax() {
    const deleteSavingsAccountDialogRef = this.dialog.open(ToggleWithholdTaxDialogComponent, {
      data: { isEnable: true },
    });
    deleteSavingsAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        this.savingsService
          .executeSavingsAccountUpdateCommand(this.savingsAccountData.id, "updateWithHoldTax", { withHoldTax: true })
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }

  /**
   * Disables withhold tac for savings account
   */
  private disableWithHoldTax() {
    const disableWithHoldTaxDialogRef = this.dialog.open(ToggleWithholdTaxDialogComponent, {
      data: { isEnable: false },
    });
    disableWithHoldTaxDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        this.savingsService
          .executeSavingsAccountUpdateCommand(this.savingsAccountData.id, "updateWithHoldTax", { withHoldTax: false })
          .subscribe(() => {
            this.reload();
          });
      }
    });
  }
}
