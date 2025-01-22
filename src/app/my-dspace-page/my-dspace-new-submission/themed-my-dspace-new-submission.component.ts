/*
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {Component, EventEmitter, Input, Output} from '@angular/core';
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
   * Input properties to be passed to the unthemed component
   */
  @Input() uploadFilesOptions: any;

  /**
   * Properties to bind between the themed and unthemed components
   */
  protected inAndOutputNames: (keyof MyDSpaceNewSubmissionComponent & keyof this)[] = ['uploadEnd', 'uploadFilesOptions'];

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
