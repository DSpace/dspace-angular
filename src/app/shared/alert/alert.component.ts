import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger } from '@angular/animations';

import uniqueId from 'lodash/uniqueId';

import { AlertType } from './alert-type';
import { fadeOutLeave, fadeOutState } from '../animations/fade';

/**
 * This component allow to create div that uses the Bootstrap's Alerts component.
 */
@Component({
  selector: 'ds-alert',
  animations: [
    trigger('enterLeave', [
      fadeOutLeave, fadeOutState,
    ])
  ],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  /**
   * The alert content
   */
  @Input() content: string;

  /**
   * A boolean representing if alert is collapsible
   */
  @Input() collapsible = false;

  /**
   * A boolean representing if alert is rendered already collapsed
   */
  @Input() collapsed = true;

  /**
   * A boolean representing if alert is dismissible
   */
  @Input() dismissible = false;

  /**
   * The alert type
   */
  @Input() type: AlertType|string;

  /**
   * A string used as id for trunctable-part
   */
  @Input() truncatableId: string;

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
  public isDismissed = false;

  /**
   * A boolean representing if alert is collapsed or not
   */
  public isCollapsed = false;

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} cdr
   */
  constructor(private cdr: ChangeDetectorRef) {
  }

  /**
   * Initialize the component
   */
  ngOnInit() {
    this.isCollapsed = this.collapsed;
    if (this.truncatableId == null) {
      this.truncatableId = uniqueId('alert-trunc-id-');
    }
  }

  /**
   * Dismiss div with animation
   */
  dismiss() {
    if (this.dismissible) {
      this.animate = 'fadeOut';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.isDismissed = true;
        this.close.emit();
        this.cdr.detectChanges();
      }, 300);

    }
  }

  /**
   * Toggle collapsible text
   */
  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
