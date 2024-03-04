import { Component } from '@angular/core';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../core/shared/view-mode.model';
import {
  AbstractListableElementComponent
} from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { Context } from '../../../core/shared/context.model';


@listableObjectComponent(Bitstream, ViewMode.ListElement, Context.Bitstream)
@Component({
    selector: 'ds-bitstream-list-item',
    template: ` {{object.name}} `,
    styleUrls: ['./bitstream-list-item.component.scss'],
    standalone: true
})
export class BitstreamListItemComponent extends AbstractListableElementComponent<Bitstream>{}
