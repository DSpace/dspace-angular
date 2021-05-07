import { CrisLayoutPageModelComponent } from './cris-layout-page.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Box } from '../../core/layout/models/box.model';
import { hasValue } from '../../shared/empty.util';

/**
 * This class is a model to be extended for creating custom layouts for boxes
 */
@Component({
  template: ''
})
export abstract class CrisLayoutBoxModelComponent extends CrisLayoutPageModelComponent implements OnInit {

  /**
   * Box.
   */
  @Input() box: Box;

  /**
   * Emit a refresh box request from within the Box.
   */
  @Output() refreshBox: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Emit a refresh tab request from within the Box.
   */
  @Output() refreshTab: EventEmitter<void> = new EventEmitter<void>();

  activeIds: string[] = [];

  random = Math.floor(Math.random() * 10000000);

  /**
   * Check if the current box is collapsed or not
   */
  ngOnInit(): void {
    if (!hasValue(this.box.collapsed) || !this.box.collapsed) {
      this.activeIds.push(this.box.shortname);
    }
  }
}
