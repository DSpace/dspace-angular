import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ItemComponent } from '../../../item-page/simple/item-types/shared/item.component';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from 'src/app/core/shared/context.model';

/**
 * Component that represents a resource type Item page
 */
@listableObjectComponent('ResourceType', ViewMode.StandalonePage, Context.Any, 'ul')
@Component({
  selector: 'ds-resource-type',
  styleUrls: ['./resource-type.component.scss'],
  templateUrl: './resource-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceTypeComponent extends ItemComponent {

}
