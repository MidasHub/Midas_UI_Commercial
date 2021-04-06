import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthenticationService } from "../../../../core/authentication/authentication.service";

//**Logger */
import { Logger } from "../../../../core/logger/logger.service";
const log = new Logger("-Add card extra info-");
@Component({
  // tslint:disable-next-line:component-selector
  selector: "midas-add-identities-extra-info",
  templateUrl: "./add-identities-extra-info.component.html",
  styleUrls: ["./add-identities-extra-info.component.scss"],
})
export class AddIdentitiesExtraInfoComponent implements OnInit {
  form: FormGroup;
  documentTypes: any[];
  statusOptions: any[] = [{ value: "Active" }, { value: "Inactive" }];
  documentCardBanks: any[];
  documentCardTypes: any[];
  currentUser: any;
  isTeller = true;
  existBin = false;
  classCardEnum=["CLASSIC","GOLD","PLATINUM","SIGNATURE","INFINITY"];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authenticationService: AuthenticationService
  ) {
    log.debug(data);
    const { clientIdentifierTemplate } = data;
    this.documentTypes = clientIdentifierTemplate.allowedDocumentTypes;
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCredentials();
    const { roles } = this.currentUser;
    roles.map((role: any) => {
      if (role.id !== 3) {
        this.isTeller = false;
      }
    });
    if (this.data.cardInfo) {
      log.debug(this.data.cardInfo);
      this.form = this.formBuilder.group({
        dueDay: [this.data.cardInfo.cardExtraInfoEntity.dueDay, Validators.required],
        expiredDate: [
          this.data.cardInfo.cardExtraInfoEntity.expiredDate.slice(5, 7) +
            "/" +
            this.data.cardInfo.cardExtraInfoEntity.expiredDate.slice(2, 4),
          Validators.required,
        ],
        limitCard: [this.data.cardInfo.cardExtraInfoEntity.limit, Validators.required],
        classCard: [this.data.cardInfo.cardExtraInfoEntity.classCard, Validators.required],
      });

    } else {
      this.form = this.formBuilder.group({
        dueDay: ["", Validators.required],
        expiredDate: ["", Validators.required],
        limitCard: [0, Validators.required],
        classCard: ["", Validators.required],
      });
    }
  }
}
