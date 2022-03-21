import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { VersionedItemComponent } from '../../../../item-page/simple/item-types/versioned-item/versioned-item.component';

@listableObjectComponent('OrgUnit', ViewMode.StandalonePage)
@Component({
  selector: 'ds-org-unit',
  styleUrls: ['./org-unit.component.scss'],
  templateUrl: './org-unit.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Organisation Unit
 */
export class OrgUnitComponent extends VersionedItemComponent {
}
