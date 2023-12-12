import { Component, Input, OnDestroy } from '@angular/core';
import { BrowseByDataType } from './browse-by-switcher/browse-by-data-type';
import { Context } from '../core/shared/context.model';
import { Subscription } from 'rxjs';
import { hasValue } from '../shared/empty.util';

@Component({
  selector: 'ds-abstract-browse-by-type',
  template: '',
})
export abstract class AbstractBrowseByTypeComponent implements OnDestroy {

  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * The {@link BrowseByDataType} of this Component
   */
  @Input() browseByType: BrowseByDataType;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  ngOnDestroy(): void {
    this.subs.filter((sub: Subscription) => hasValue(sub)).forEach((sub: Subscription) => sub.unsubscribe());
  }

}
