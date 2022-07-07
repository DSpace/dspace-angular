import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { VersionedItemComponent } from '../../../../item-page/simple/item-types/versioned-item/versioned-item.component';
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
export class PersonComponent extends VersionedItemComponent {

  /**
   * Returns the metadata values to be used for the page title.
   */
  getTitleMetadataValues(): MetadataValue[] {
    const metadataValues = [];
    const familyName = this.object?.firstMetadata('person.familyName');
    const givenName = this.object?.firstMetadata('person.givenName');
    const title = this.object?.firstMetadata('dc.title');
    if (familyName) {
      metadataValues.push(familyName);
    }
    if (givenName) {
      metadataValues.push(givenName);
    }
    if (metadataValues.length === 0 && title) {
      metadataValues.push(title);
    }
    return metadataValues;
  }

}
