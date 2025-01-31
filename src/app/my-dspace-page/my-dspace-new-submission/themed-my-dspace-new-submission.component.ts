import {Component, EventEmitter, Output} from '@angular/core';
import {ThemedComponent} from '../../shared/theme-support/themed.component';
import {MyDSpaceNewSubmissionComponent} from './my-dspace-new-submission.component';
import {SearchResult} from '../../shared/search/models/search-result.model';
import {DSpaceObject} from '../../core/shared/dspace-object.model';

/**
 * Themed version of MyDSpaceNewSubmissionComponent
 */
@Component({
  selector: 'ds-themed-my-dspace-new-submission',
  templateUrl: './../../shared/theme-support/themed.component.html',
  styleUrls: []
})
export class ThemedMyDSpaceNewSubmissionComponent extends ThemedComponent<MyDSpaceNewSubmissionComponent> {

  /**
   * Output that emits the workspace item when the upload has completed
   */
  @Output() uploadEnd = new EventEmitter<SearchResult<DSpaceObject>[]>();

  /**
   * Properties to bind between the themed and unthemed components
   */
  protected inAndOutputNames: (keyof MyDSpaceNewSubmissionComponent & keyof this)[] = ['uploadEnd'];

  /**
   * The name of the unthemed component
   */
  protected getComponentName(): string {
    return 'MyDSpaceNewSubmissionComponent';
  }

  /**
   * Import the themed component for a specific theme
   * @param themeName The name of the theme
   */
  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission.component`);
  }

  /**
   * Import the default unthemed component
   */
  protected importUnthemedComponent(): Promise<any> {
    return import(`./my-dspace-new-submission.component`);
  }
}
