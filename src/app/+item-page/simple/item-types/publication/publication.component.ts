import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ItemComponent } from '../shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent('Publication', ViewMode.StandalonePage)
@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent {

}
