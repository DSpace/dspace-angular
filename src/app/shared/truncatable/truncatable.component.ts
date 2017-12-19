import {
  ChangeDetectorRef, Component, ElementRef, Inject, Input,
  OnInit
} from '@angular/core';
import { NativeWindowRef, NativeWindowService } from '../window.service';

@Component({
  selector: 'ds-truncatable',
  templateUrl: './truncatable.component.html'
})
export class TruncatableComponent implements OnInit {

  @Input() lines: number;
  @Input() innerHTML;
  height;
  styles: any;

  public constructor(private elementRef: ElementRef, @Inject(NativeWindowService) private _window: NativeWindowRef, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.styles = this._window.nativeWindow.getComputedStyle(this.elementRef.nativeElement);
    setTimeout(() => {
      this.height = this.styles.lineHeight.replace('px', '') * this.lines;
      this.changeDetectorRef.detectChanges();
    }, 0);
  }
}
