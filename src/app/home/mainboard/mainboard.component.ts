import { AfterViewInit, Component, OnInit, ViewChild, } from '@angular/core';
import { MidasClientService } from './../../midas-client/midas-client.service';
import { Router } from '@angular/router';
import {FormControl,  Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'app/core/alert/alert.service';


@Component({
  selector: 'midas-mainboard',
  templateUrl: './mainboard.component.html',
  styleUrls: ['./mainboard.component.scss']
})
export class MainboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'status', 'officeName', 'displayName' , 'mobileNo', 'documentKey', 'bankName'];
  dataSource: MatTableDataSource<any>;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  isLoading = false;
  showSearchTable = false;
  matcher = new ErrorStateMatcher();

  @ViewChild(MatPaginator) paginator: MatPaginator |any;
  @ViewChild(MatSort) sort: MatSort |any;
  constructor(
    private midasClientService: MidasClientService,

    ) {
    this.dataSource = new MatTableDataSource();

   }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {

  }

  searchClientAndGroup(query: string): void {
    // if (query.length > 2){
    this.dataSource.data = [];
    this.showSearchTable = true;
    this.isLoading = true;
    this.midasClientService.searchClientByNameAndExternalIdAndPhoneAndDocumentKey(query).subscribe((data: any) => {
      this.isLoading = false;
      this.dataSource.data = data.result.listClientSearch;

    },
    error => this.isLoading = false
    );
  // }else{
  //   this.alertService.alert({message:'Từ khóa tìm kiếm phải có tối thiểu 3 kí tự.',msgClass:'cssWarning'})
  // }
  }

}
