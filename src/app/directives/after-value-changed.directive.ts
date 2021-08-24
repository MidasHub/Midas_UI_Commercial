import { Directive, Input, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { fromEvent, Subject, timer } from 'rxjs';
import { debounce, distinctUntilChanged, takeUntil } from 'rxjs/operators';
@Directive({
  selector: '[midasAfterValueChanged]',
})
export class AfterValueChangedDirective implements OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() delayTime = 300;
  @Output() delayedInput = new EventEmitter<Event>();

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    fromEvent(this.elementRef.nativeElement, 'input')
      .pipe(
        debounce(() => timer(this.delayTime)),
        // @ts-ignore
        distinctUntilChanged(null, (event: Event) => (event.target as HTMLInputElement).value),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => this.delayedInput.emit(e));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
