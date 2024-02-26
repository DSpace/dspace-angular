import { Directive, OnChanges, OnInit, Input, ElementRef, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { MathService } from './math.service';
import { take, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[dsMath]'
})
export class MathDirective implements OnInit, OnChanges, OnDestroy {
  @Input() dsMath: string;
  private alive$ = new Subject<boolean>();
  private readonly el: HTMLElement;

  constructor(private mathService: MathService, private elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }

  ngOnInit() {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.dsMath?.currentValue) {
      this.render();
    }
  }

  private render() {
    this.mathService.ready().pipe(
      take(1),
      takeUntil(this.alive$)
    ).subscribe(() => {
      // if this.dsMath begins with "The observation of the"
      if (this.dsMath.startsWith('The observation of the')) {
        console.warn('rendering math after ready');
        console.warn('this.dsMath', this.dsMath);
        console.warn('this.el', this.el);
      }
      this.mathService.render(this.el, this.dsMath);
    });
  }

  ngOnDestroy() {
    this.alive$.next(false);
  }

}
