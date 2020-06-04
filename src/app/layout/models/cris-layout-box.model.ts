import { CrisLayoutPage } from './cris-layout-page.model';
import { Input } from '@angular/core';
import { Box } from 'src/app/core/layout/models/box.model';

export class CrisLayoutBox extends CrisLayoutPage {
  /**
   * Boxes list
   */
  @Input() box: Box;
}
