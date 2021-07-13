import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/core/alert/alert.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { TransactionService } from 'app/transactions/transaction.service';

@Component({
  selector: 'midas-manage-transfer',
  templateUrl: './manage-transfer.component.html',
  styleUrls: ['./manage-transfer.component.scss'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "100px" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class ManageTransferComponent implements OnInit {
  dataSource: any[] = [];
  cardFilter = new FormControl("");
  shipperFilter = new FormControl("");
  deliverFilter = new FormControl("");
  staffFilter = new FormControl("");
  displayedColumns: any[] = ["transferDate", "transferRefNo", "senderStaffName", "actionStaffName", "receiverStaffName", "action"];

  currentUser: any;
  officeId: any;
  today = new Date();
  fromDate: any;
  toDate: any;
  isExported: any;
  formDate: FormGroup;

  constructor(
    private authenticationService: AuthenticationService,
    private transactionServices: TransactionService,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  )
  {
    this.currentUser = this.authenticationService.getCredentials();
    this.officeId = this.currentUser.officeId;
    this.formDate = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
    });
  }

  ngOnInit(): void {

  }

  get fromDateAndToDate() {
    const fromDate = this.formDate.get("fromDate").value;
    const toDate = this.formDate.get("toDate").value;
    if (fromDate && toDate) {
      return true;
    }
    return false;
  }

  reset(){
    this.cardFilter.setValue("");
    this.shipperFilter.setValue("");
    this.deliverFilter.setValue("");
    this.staffFilter.setValue("");
  }

  getListTransfer(){
    this.fromDate = this.datePipe.transform(this.formDate.get("fromDate").value, 'dd/MM/yyyy');
    this.toDate = this.datePipe.transform(this.formDate.get("toDate").value, 'dd/MM/yyyy');
    this.transactionServices.getListTransfer(this.fromDate, this.toDate, this.officeId).subscribe((data) => {
      let statusCode = data.statusCode;
      this.dataSource = data.result.listRequest;
      console.log("this.dataSource: ", this.dataSource);
    });
  }

  deleteCardTransferRequest(form: any) {
    if (form.isExported==1) {
      this.alertService.alert({message: 'Biên bản đã in, không thể chỉnh sửa.', msgClass: 'cssError'});
    }
    else{
      let dataResult: any[] = [];
      let listCardId: any[] = [];
      //delete card transfer request by transferRefNo
      this.transactionServices.deleteCardTransferRequest(form.transferRefNo, this.officeId).subscribe((dataDelete) => {
      if (dataDelete.statusCode=="success") {
        this.alertService.alert({message: 'Xóa thành công.', msgClass: 'cssSuccess'});
        this.dataSource = this.dataSource.filter((v) => v.transferRefNo !== form.transferRefNo);
      }
      else{
        this.alertService.alert({message: 'Xóa thất bại.', msgClass: 'cssError'});
      }
    });
    }
  }

  createTransfer() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

  editCardTransferRequest(form: any) {
    if (form.isExported==1) {
      this.alertService.alert({message: 'Biên bản đã in, không thể chỉnh sửa.', msgClass: 'cssError'});
    }
    else{
      const queryParams: any = {
        transferRefNo: form.transferRefNo
      };
      this.router.navigate(['../create'], { relativeTo: this.route, queryParams: queryParams });
    }
  }

  searchByTransferRefNo(query: any): void {
    this.searchByParam(query, "transferRefNo");
  }

  searchByShipper(query: any): void {
    this.searchByParam(query, "actionStaffName");
  }

  searchByDeliver(query: any): void {
    this.searchByParam(query, "senderStaffName");
  }

  searchByStaff(query: any): void {
    this.searchByParam(query, "receiverStaffName");
  }

  searchByParam(query: string, queryType: string){
    let dataTemp: any[] = [];
    this.transactionServices.getListTransfer(this.fromDate, this.toDate, this.officeId).subscribe((data) => {
      dataTemp = data.result.listRequest;
      if (queryType=="transferRefNo") {
        this.dataSource = dataTemp.filter((v) => v.transferRefNo.trim().toLowerCase().indexOf(query.trim().toLowerCase()) > -1);
      }
      if (queryType=="actionStaffName") {
        this.dataSource = dataTemp.filter((v) => v.actionStaffName.trim().toLowerCase().indexOf(query.trim().toLowerCase()) > -1);
      }
      if (queryType=="senderStaffName") {
        this.dataSource = dataTemp.filter((v) => v.senderStaffName.trim().toLowerCase().indexOf(query.trim().toLowerCase()) > -1);
      }
      if (queryType=="receiverStaffName") {
        this.dataSource = dataTemp.filter((v) => v.receiverStaffName.trim().toLowerCase().indexOf(query.trim().toLowerCase()) > -1);
      }

    });
  }
}
