import { Directive } from '@angular/core';

@Directive({
  selector: '[dsBox]',
  exportAs: 'boxRef'
})
export class BoxDirective {

  panelState = false;

  public panelChange(event) {
    this.panelState = event.nextState;
  }

  public isOpen() {
    return (this.panelState) ? true : false;
  }

  public isAnimationsActive() {
    return false;
  }
}
