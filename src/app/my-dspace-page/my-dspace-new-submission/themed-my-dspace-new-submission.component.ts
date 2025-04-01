import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchResult } from '../../shared/search/models/search-result.model';
import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission.component';

/**
 * Themed wrapper for {@link MyDSpaceNewSubmissionComponent}
 */
@Component({
  selector: 'ds-my-dspace-new-submission',
  templateUrl: './../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [MyDSpaceNewSubmissionComponent],
})
export class ThemedMyDSpaceNewSubmissionComponent extends ThemedComponent<MyDSpaceNewSubmissionComponent> {

  @Output() uploadEnd: EventEmitter<SearchResult<DSpaceObject>[]> = new EventEmitter();

  protected inAndOutputNames: (keyof MyDSpaceNewSubmissionComponent & keyof this)[] = [
    'uploadEnd',
  ];

  protected getComponentName(): string {
    return 'MyDSpaceNewSubmissionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./my-dspace-new-submission.component');
  }
}
