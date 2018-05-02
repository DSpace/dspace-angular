import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlertType } from './aletrs-type';
import { trigger } from '@angular/animations';
import { fadeOutLeave, fadeOutState } from '../animations/fade';

@Component({
  selector: 'ds-alert',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('enterLeave', [
      fadeOutLeave, fadeOutState,
    ])
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})

export class AlertsComponent {

  @Input() content: string;
  @Input() dismissible = false;
  @Input() type: AlertType;

  public animate = 'fadeIn';
  public dismissed = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  close() {
    if (this.dismissible) {
      this.animate = 'fadeOut';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.dismissed = true;
        this.cdr.detectChanges();
      }, 300);

    }
  }
}
