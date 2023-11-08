import { Component } from '@angular/core';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import {
  PersonComponent as BaseComponent
} from '../../../../../../../app/entity-groups/research-entities/item-pages/person/person.component';
import { Context } from '../../../../../../../app/core/shared/context.model';

@listableObjectComponent('Person', ViewMode.StandalonePage, Context.Any, 'custom')
@Component({
  selector: 'ds-person',
  // styleUrls: ['./person.component.scss'],
  styleUrls: ['../../../../../../../app/entity-groups/research-entities/item-pages/person/person.component.scss'],
  // templateUrl: './person.component.html',
  templateUrl: '../../../../../../../app/entity-groups/research-entities/item-pages/person/person.component.html',
})
export class PersonComponent extends BaseComponent {
}
