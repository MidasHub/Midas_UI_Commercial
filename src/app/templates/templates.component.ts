/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

/**
 * Templates component.
 */
@Component({
  selector: 'mifosx-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent implements OnInit {
  /** Templates data. */
  templatesData: any;
  /** Columns to be displayed in templates table. */
  displayedColumns: string[] = ['entity', 'type', 'name'];
  /** Data source for templates table. */
  dataSource!: MatTableDataSource<any>;

  /** Paginator for templates table. */
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  /** Sorter for templates table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;

  /**
   * Retrieves the templates data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { templates?: any }) => {
      this.templatesData = data.templates;
    });
  }

  /**
   * Filters data in templates table based on passed value.
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(e: Event) {
    // TODO: Chỗ này cần chuyển thành biết Event, rồi trong hàm filter mới check để làm filter
    const filterValue = (<HTMLInputElement>e.target).value || '';
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  /**
   * Sets the templates table.
   */
  ngOnInit() {
    this.setTemplates();
  }

  /**
   * Initializes the data source, paginator and sorter for templates table.
   */
  setTemplates() {
    this.dataSource = new MatTableDataSource(this.templatesData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
