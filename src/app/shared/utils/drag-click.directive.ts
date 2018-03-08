import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dsDragClick]'
})
export class DragClickDirective {
  private start;
  @Output() actualClick = new EventEmitter();

  @HostListener('mousedown', ['$event'])
  mousedownEvent(event) {
    this.start = new Date();
  }

  @HostListener('mouseup', ['$event'])
  mouseupEvent(event) {
    const end: any = new Date();
    const clickTime = end - this.start;
    if (clickTime < 250) {
      this.actualClick.emit(event)
    }
  }
}
