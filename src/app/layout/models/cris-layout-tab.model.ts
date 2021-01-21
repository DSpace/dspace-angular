import { Component, Input } from '@angular/core';
import { Tab } from '../../core/layout/models/tab.model';
import { CrisLayoutPageModelComponent } from './cris-layout-page.model';

/**
 * This class is a model to be extended for creating custom layouts for tabs
 */
@Component({
  template: ''
})
export abstract class CrisLayoutTabModelComponent extends CrisLayoutPageModelComponent {
  /**
   * Tab
   */
  @Input() tab: Tab;
}
