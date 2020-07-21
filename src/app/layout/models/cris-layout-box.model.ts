import { CrisLayoutPage } from './cris-layout-page.model';
import { Input, OnInit } from '@angular/core';
import { Box } from 'src/app/core/layout/models/box.model';

/**
 * This class is a model to be extended for creating custom layouts for boxes
 */
export class CrisLayoutBox extends CrisLayoutPage implements OnInit {
  /**
   * Boxes list
   */
  @Input() box: Box;

  activeIds: string[] = [];

  ngOnInit(): void {
    if (this.box.collapsed) {
      this.activeIds.push(this.box.shortname);
    }
  }
}
