import { Input } from '@angular/core';
import { Tab } from 'src/app/core/layout/models/tab.model';
import { CrisLayoutPage } from './cris-layout-page.model';

export class CrisLayoutTab extends CrisLayoutPage {
  /**
   * Tab
   */
  @Input() tab: Tab;
}
