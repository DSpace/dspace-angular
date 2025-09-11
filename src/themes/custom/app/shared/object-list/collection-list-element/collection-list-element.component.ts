import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Collection } from '../../../../../../app/core/shared/collection.model';
import { Context } from '../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../app/core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { CollectionListElementComponent as BaseComponent } from '../../../../../../app/shared/object-list/collection-list-element/collection-list-element.component';

@Component({
  selector: 'ds-collection-list-element',
  // styleUrls: ['./collection-list-element.component.scss'],
  styleUrls: ['../../../../../../app/shared/object-list/collection-list-element/collection-list-element.component.scss'],
  // templateUrl: './collection-list-element.component.html'
  templateUrl: '../../../../../../app/shared/object-list/collection-list-element/collection-list-element.component.html',
  standalone: true,
  imports: [
    RouterLink,
  ],
})
@listableObjectComponent(Collection, ViewMode.ListElement, Context.Any, 'custom')
export class CollectionListElementComponent extends BaseComponent {
}
