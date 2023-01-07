import { Component, OnInit, ViewChild } from '@angular/core';
import { MidasClientService } from './../../midas-client/midas-client.service';
import {FormControl,  Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'midas-mainboard',
  templateUrl: './mainboard.component.html',
  styleUrls: ['./mainboard.component.scss']
})
export class MainboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'displayName' , 'documentKey', 'status', 'officeName',  'mobileNo'];
  dataSource: MatTableDataSource<any>;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  isLoading = false;
  showSearchTable =false;
  matcher = new ErrorStateMatcher();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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
    this.midasClientService.searchClientByNameAndExternalIdAndPhoneAndDocumentKey(query).subscribe((data: any) =>{
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
