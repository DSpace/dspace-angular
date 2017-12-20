import {
  Directive,
  ElementRef,
  Input,
  OnChanges
} from '@angular/core';

import * as clampLib from 'text-overflow-clamp';

@Directive({selector: '[dsClamp]'})
export class TextOverflowClampDirective implements OnChanges {
    @Input('dsClamp') lines: number;

    constructor(private el: ElementRef) {
    }

    ngOnChanges(): void {
        clampLib(this.el.nativeElement, this.lines);
    }
}
