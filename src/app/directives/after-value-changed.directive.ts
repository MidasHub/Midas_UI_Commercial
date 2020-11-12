import {Directive, Input, HostListener, OnDestroy, Output, EventEmitter, ElementRef} from '@angular/core';
import {fromEvent, Subject, Subscription, timer} from 'rxjs';
import {debounce, debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
@Directive({
  selector: '[midasAfterValueChanged]'
})
export class AfterValueChangedDirective implements OnDestroy {

  private destroy$ = new Subject<void>(); // 0️⃣

  @Input() delayTime = 300; // 1️⃣
  @Output() delayedInput = new EventEmitter<Event>();  // 2️⃣

  constructor(private elementRef: ElementRef<HTMLInputElement>) { // 3️⃣
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    fromEvent(this.elementRef.nativeElement, 'input') // 4️⃣
      .pipe(
        debounce(() => timer(this.delayTime)),  // 5️⃣
        distinctUntilChanged(
          null,
          (event: Event) => (event.target as HTMLInputElement).value
        ), // 6️⃣
        takeUntil(this.destroy$), // 7️⃣
      )
      .subscribe(e => this.delayedInput.emit(e)); // 8️⃣
  }

  ngOnDestroy() {
    this.destroy$.next(); // 9️⃣
  }
}
