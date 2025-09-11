import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrowseEntry, Context, ViewMode } from '@dspace/core'

import {
  listableObjectComponent,
} from '../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import {
  BrowseEntryListElementComponent as BaseComponent,
} from '../../../../../../app/shared/object-list/browse-entry-list-element/browse-entry-list-element.component';

@Component({
  selector: 'ds-browse-entry-list-element',
  // styleUrls: ['./browse-entry-list-element.component.scss'],
  styleUrls: ['../../../../../../app/shared/object-list/browse-entry-list-element/browse-entry-list-element.component.scss'],
  // templateUrl: './browse-entry-list-element.component.html',
  templateUrl: '../../../../../../app/shared/object-list/browse-entry-list-element/browse-entry-list-element.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
  ],
})
@listableObjectComponent(BrowseEntry, ViewMode.ListElement, Context.Any, 'custom')
export class BrowseEntryListElementComponent extends BaseComponent {
}
