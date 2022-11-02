import { SubmissionImportExternalCollectionComponent } from './submission-import-external-collection.component';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { Component, Output, EventEmitter } from '@angular/core';
import { CollectionListEntry } from '../../../shared/collection-dropdown/collection-dropdown.component';

@Component({
  selector: 'ds-themed-submission-import-external-collection',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedSubmissionImportExternalCollectionComponent extends ThemedComponent<SubmissionImportExternalCollectionComponent> {

  @Output() public selectedEvent = new EventEmitter<CollectionListEntry>();

  protected inAndOutputNames: (keyof SubmissionImportExternalCollectionComponent & keyof this)[] = ['selectedEvent'];

  protected getComponentName(): string {
    return 'SubmissionImportExternalCollectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/submission/import-external/import-external-collection/themed-submission-import-external-collection.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./submission-import-external-collection.component`);
  }


}
