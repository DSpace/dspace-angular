import { CrisLayoutPage } from './cris-layout-page.model';
import { Input } from '@angular/core';
import { Box } from 'src/app/core/layout/models/box.model';

/**
 * This class is a model to be extended for creating custom layouts for boxes
 */
export class CrisLayoutBox extends CrisLayoutPage {
  /**
   * Boxes list
   */
  @Input() box: Box;
}
