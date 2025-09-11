import { Component } from '@angular/core';
import { Bitstream, Context, ViewMode } from '@dspace/core'

import {
  listableObjectComponent,
} from '../../object-collection/shared/listable-object/listable-object.decorator';
import {
  AbstractListableElementComponent,
} from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';


@listableObjectComponent(Bitstream, ViewMode.ListElement, Context.Bitstream)
@Component({
  selector: 'ds-bitstream-list-item',
  template: ` {{object.name}} `,
  styleUrls: ['./bitstream-list-item.component.scss'],
  standalone: true,
})
export class BitstreamListItemComponent extends AbstractListableElementComponent<Bitstream>{}
