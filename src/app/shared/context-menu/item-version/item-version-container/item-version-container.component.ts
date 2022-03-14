import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VersionedItemComponent } from '../../../../item-page/simple/item-types/versioned-item/versioned-item.component';

/**
 * Component that represents a publication Item page
 */

// @listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-item-version-container',
  styleUrls: ['./item-version-container.component.scss'],
  templateUrl: './item-version-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemVersionContainerComponent extends VersionedItemComponent {
  @Input() object;
}
