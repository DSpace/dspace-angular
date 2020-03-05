import { Component } from '@angular/core';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { isNotEmpty } from '../../../../shared/empty.util';
import { MetadataValue } from '../../../../core/shared/metadata.models';

@listableObjectComponent('Person', ViewMode.StandalonePage)
@Component({
  selector: 'ds-person',
  styleUrls: ['./person.component.scss'],
  templateUrl: './person.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Person
 */
export class PersonComponent extends ItemComponent {

  getPersonName(): MetadataValue[] {
    let personName: MetadataValue[] = [this.object.firstMetadata('dc.title')];
    if (isNotEmpty(this.object.firstMetadataValue('person.familyName')) && isNotEmpty(this.object.firstMetadataValue('person.givenName'))) {
      personName = [this.object.firstMetadata('person.familyName'), this.object.firstMetadata('person.givenName')]
    }

    return personName
  }
}
