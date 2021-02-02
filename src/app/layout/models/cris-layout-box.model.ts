import { CrisLayoutPageModelComponent } from './cris-layout-page.model';
import { Component, Input, OnInit } from '@angular/core';
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
   * Boxes list
   */
  @Input() box: Box;

  activeIds: string[] = [];

  ngOnInit(): void {
    /**
     * Check if the current box is collapsed or not
     */
    if (!hasValue(this.box.collapsed) || !this.box.collapsed) {
      this.activeIds.push(this.box.shortname);
    }
  }
}
