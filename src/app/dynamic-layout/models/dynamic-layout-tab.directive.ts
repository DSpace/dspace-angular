import {
  Directive,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { DynamicLayoutTab } from '../../core/layout/models/tab.model';
import { DynamicLayoutPageDirective } from './dynamic-layout-page.directive';

/**
 * This class is a model to be extended for creating custom layouts for tabs
 */
@Directive()
export abstract class DynamicLayoutTabModelDirective extends DynamicLayoutPageDirective {
  /**
   * DynamicLayoutTab
   */
  @Input() tab: DynamicLayoutTab;

  /**
   * Emit a refresh tab request from within the DynamicLayoutTab.
   */
  @Output() refreshTab: EventEmitter<void> = new EventEmitter<void>();

}
