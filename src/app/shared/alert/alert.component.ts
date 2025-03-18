import { trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import {
  fadeOutLeave,
  fadeOutState,
} from '../animations/fade';
import { AlertType } from './alert-type';

/**
 * This component allow to create div that uses the Bootstrap's Alerts component.
 */
@Component({
  selector: 'ds-alert',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('enterLeave', [
      fadeOutLeave, fadeOutState,
    ]),
  ],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [NgIf, TranslateModule],
})
export class AlertComponent {

  /**
   * The alert content
   */
  @Input() content: string;

  /**
   * A boolean representing if alert is dismissible
   */
  @Input() dismissible = false;

  /**
   * The alert type
   */
  @Input() type: AlertType | string;

  /**
   * An event fired when alert is dismissed.
   */
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The initial animation name
   */
  public animate = 'fadeIn';

  /**
   * A boolean representing if alert is dismissed or not
   */
  public dismissed = false;

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} cdr
   */
  constructor(private cdr: ChangeDetectorRef) {
  }

  /**
   * Dismiss div with animation
   */
  dismiss() {
    if (this.dismissible) {
      this.animate = 'fadeOut';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.dismissed = true;
        this.close.emit();
        this.cdr.detectChanges();
      }, 300);

    }
  }
}
