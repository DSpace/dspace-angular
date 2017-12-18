
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
export class TruncatableComponent implements OnInit {

  @Input() lines: Observable<number>;
  @Input() innerHTML;
  @Input() height: Observable<number>;
  styles: any;
  public constructor(private elementRef:ElementRef, @Inject(NativeWindowService) private _window: NativeWindowRef) { }

  ngOnInit(): void {
    const lineHeight = this._window.nativeWindow.getComputedStyle(this.elementRef.nativeElement).lineHeight.replace('px', '');
    this.styles =  this._window.nativeWindow.getComputedStyle(this.elementRef.nativeElement);
    this.height = this.lines.map((lines) => (lines * lineHeight)).startWith(0);
    this.print(this.styles);
  }

  print(styles) {
    console.log(styles);
  }
}
