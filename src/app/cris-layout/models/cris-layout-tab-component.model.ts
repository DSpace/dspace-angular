import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CrisLayoutTab } from '../../core/layout/models/tab.model';
import { CrisLayoutPageModelComponent } from './cris-layout-page-component.model';

/**
 * This class is a model to be extended for creating custom layouts for tabs
 */
@Component({
  template: ''
})
export abstract class CrisLayoutTabModelComponent extends CrisLayoutPageModelComponent {
  /**
   * CrisLayoutTab
   */
  @Input() tab: CrisLayoutTab;

  /**
   * Emit a refresh tab request from within the CrisLayoutTab.
   */
  @Output() refreshTab: EventEmitter<void> = new EventEmitter<void>();

}
