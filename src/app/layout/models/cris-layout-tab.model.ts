import { Input } from '@angular/core';
import { Tab } from 'src/app/core/layout/models/tab.model';
import { CrisLayoutPage } from './cris-layout-page.model';

/**
 * This class is a model to be extended for creating custom layouts for tabs
 */
export class CrisLayoutTab extends CrisLayoutPage {
  /**
   * Tab
   */
  @Input() tab: Tab;
}
