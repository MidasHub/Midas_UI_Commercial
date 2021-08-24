import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {map, mapTo, takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[midasTableResponsive]'
})
export class TableResponsiveDirective implements OnInit, AfterViewInit, OnDestroy {

  private onDestroy$ = new Subject<boolean>();

  private thead?: HTMLTableSectionElement;
  private tbody?: HTMLTableSectionElement;

  private theadChanged$ = new BehaviorSubject(true);
  private tbodyChanged$ = new Subject<boolean>();

  private theadObserver = new MutationObserver(() => this.theadChanged$.next(true));
  private tbodyObserver = new MutationObserver(() => this.tbodyChanged$.next(true));

  constructor(private table: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.thead = this.table.nativeElement.querySelector('thead');
    this.tbody = this.table.nativeElement.querySelector('tbody');

    // @ts-ignore
    this.theadObserver.observe(this.thead, {characterData: true, subtree: true});
    // @ts-ignore
    this.tbodyObserver.observe(this.tbody, {childList: true});
  }

  ngAfterViewInit() {
    // @ts-ignore
    /**
     * Set the "data-column-name" attribute for every body row cell, either on
     * thead row changes (e.g. language changes) or tbody rows changes (add, delete).
     */
    combineLatest([this.theadChanged$, this.tbodyChanged$])
      .pipe(
        // @ts-ignore
        mapTo([this.thead.rows.item(0), this.tbody.rows]),
        map(
          ([headRow, bodyRows]: [HTMLTableRowElement, HTMLCollectionOf<HTMLTableRowElement>]) => [
            // @ts-ignore
            [...headRow.children].map(headerCell => headerCell.textContent),
            // @ts-ignore
            [...bodyRows].map(row => [...row.children])
          ]
        ),
        takeUntil(this.onDestroy$)
      )
      // @ts-ignore
      .subscribe(([columnNames, rows]: [string[], HTMLTableCellElement[][]]) =>
        rows.forEach(rowCells =>
          rowCells.forEach(cell => this.renderer.setAttribute(
            cell,
            'data-column-name',
            columnNames[cell.cellIndex]
            )
          )
        )
      );
  }

  ngOnDestroy(): void {
    this.theadObserver.disconnect();
    this.tbodyObserver.disconnect();

    this.onDestroy$.next(true);
  }
}
