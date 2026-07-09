import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { DynamicLayoutTab } from '../../core/layout/models/tab.model';
import { DynamicLayoutPageModelComponent } from './dynamic-layout-page-component.model';

/**
 * This class is a model to be extended for creating custom layouts for tabs
 */
@Component({
  template: '',
})
export abstract class CrisLayoutTabModelComponent extends DynamicLayoutPageModelComponent {
  /**
   * DynamicLayoutTab
   */
  @Input() tab: DynamicLayoutTab;

  /**
   * Emit a refresh tab request from within the DynamicLayoutTab.
   */
  @Output() refreshTab: EventEmitter<void> = new EventEmitter<void>();

}
