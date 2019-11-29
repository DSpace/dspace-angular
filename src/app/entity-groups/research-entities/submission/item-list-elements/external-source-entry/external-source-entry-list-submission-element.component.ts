import { AbstractListableElementComponent } from '../../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ExternalSourceEntry } from '../../../../../core/shared/external-source-entry.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { Context } from '../../../../../core/shared/context.model';
import { Component } from '@angular/core';

@listableObjectComponent(ExternalSourceEntry, ViewMode.ListElement, Context.SubmissionModal)
@Component({
  selector: 'ds-external-source-entry-list-submission-element',
  styleUrls: ['./external-source-entry-list-submission-element.component.scss'],
  templateUrl: './external-source-entry-list-submission-element.component.html'
})
export class ExternalSourceEntryListSubmissionElementComponent extends AbstractListableElementComponent<ExternalSourceEntry> {

}
