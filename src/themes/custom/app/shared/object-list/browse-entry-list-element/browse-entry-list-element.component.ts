import { Component } from '@angular/core';
import { BrowseEntry } from '../../../../../../app/core/shared/browse-entry.model';
import { ViewMode } from '../../../../../../app/core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../../app/core/shared/context.model';
import {
  BrowseEntryListElementComponent as BaseComponent
} from '../../../../../../app/shared/object-list/browse-entry-list-element/browse-entry-list-element.component';

@Component({
  selector: 'ds-browse-entry-list-element',
  // styleUrls: ['./browse-entry-list-element.component.scss'],
  styleUrls: ['../../../../../../app/shared/object-list/browse-entry-list-element/browse-entry-list-element.component.scss'],
  // templateUrl: './browse-entry-list-element.component.html',
  templateUrl: '../../../../../../app/shared/object-list/browse-entry-list-element/browse-entry-list-element.component.html',
})
@listableObjectComponent(BrowseEntry, ViewMode.ListElement, Context.Any, 'custom')
export class BrowseEntryListElementComponent extends BaseComponent {
}
