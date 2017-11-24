
import {
  AfterViewChecked,
  AfterViewInit, Component, ElementRef, Inject, Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NativeWindowRef, NativeWindowService } from '../window.service';

@Component({
  selector: 'ds-truncatable',
  templateUrl: './truncatable.component.html'
})
export class TruncatableComponent implements AfterViewChecked {

  @Input() lines: Observable<number>;
  @Input() innerHTML;
  @Input() height: Observable<number>;
  public constructor(private elementRef:ElementRef, @Inject(NativeWindowService) private _window: NativeWindowRef) { }

  ngAfterViewChecked(): void {
    const lineHeight = this._window.nativeWindow.getComputedStyle(this.elementRef.nativeElement).lineHeight.replace('px', '');
    this.height = this.lines.map((lines) => (lines * lineHeight)).startWith(0);
    this.height.subscribe((h) => console.log('height: ', h));
  }
}
