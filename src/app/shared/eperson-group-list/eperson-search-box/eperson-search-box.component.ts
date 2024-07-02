import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { isNotNull } from '../../empty.util';
import { SearchEvent } from '../eperson-group-list-event-type';

/**
 * A component used to show a search box for epersons.
 */
@Component({
  selector: 'ds-eperson-search-box',
  templateUrl: './eperson-search-box.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule],
})
export class EpersonSearchBoxComponent {

  labelPrefix = 'admin.access-control.epeople.';

  /**
   * The search form
   */
  searchForm;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * An event fired when a search is triggred.
   * Event's payload is a SearchEvent.
   */
  @Output() search: EventEmitter<SearchEvent> = new EventEmitter<SearchEvent>();

  constructor(private formBuilder: UntypedFormBuilder) {
    this.searchForm = this.formBuilder.group(({
      scope: 'metadata',
      query: '',
    }));
  }

  /**
   * Reset the search form
   */
  reset() {
    this.searchForm = this.formBuilder.group(({
      scope: 'metadata',
      query: '',
    }));
  }

  /**
   * Emit a new search event
   * @param data  Form data
   */
  submit(data: any) {
    const event: SearchEvent = {
      scope: isNotNull(data) ? data.scope : 'metadata',
      query: isNotNull(data) ? data.query : '',
    };

    this.search.emit(event);
  }
}
