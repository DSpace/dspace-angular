import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Context } from '../../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { JournalIssueComponent as BaseComponent } from '../../../../../../../app/entity-groups/journal-entities/item-pages/journal-issue/journal-issue.component';
import { GenericItemPageFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { RelatedItemsComponent } from '../../../../../../../app/item-page/simple/related-items/related-items-component';
import { DsoEditMenuComponent } from '../../../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedResultsBackButtonComponent } from '../../../../../../../app/shared/results-back-button/themed-results-back-button.component';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';

@listableObjectComponent('JournalIssue', ViewMode.StandalonePage, Context.Any, 'custom')
@Component({
  selector: 'ds-journal-issue',
  // styleUrls: ['./journal-issue.component.scss'],
  styleUrls: ['../../../../../../../app/entity-groups/journal-entities/item-pages/journal-issue/journal-issue.component.scss'],
  // templateUrl: './journal-issue.component.html',
  templateUrl: '../../../../../../../app/entity-groups/journal-entities/item-pages/journal-issue/journal-issue.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    DsoEditMenuComponent,
    GenericItemPageFieldComponent,
    MetadataFieldWrapperComponent,
    RelatedItemsComponent,
    RouterLink,
    ThemedItemPageTitleFieldComponent,
    ThemedResultsBackButtonComponent,
    ThemedThumbnailComponent,
    TranslateModule,
  ],
})
export class JournalIssueComponent extends BaseComponent {
}
