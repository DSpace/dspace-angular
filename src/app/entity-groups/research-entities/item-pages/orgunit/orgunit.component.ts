import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';

@rendersItemType('OrgUnit', ItemViewMode.Detail)
@Component({
  selector: 'ds-orgunit',
  styleUrls: ['./orgunit.component.scss'],
  templateUrl: './orgunit.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Organisation Unit
 */
export class OrgunitComponent extends ItemComponent {
}
