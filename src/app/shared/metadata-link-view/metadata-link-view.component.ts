import { Component, OnInit, Input } from '@angular/core';
import { hasValue, isNotEmpty } from '../empty.util';
import { Item } from '../../core/shared/item.model';
import { environment } from '../../../environments/environment';
import { MetadataValue } from '../../core/shared/metadata.models';
import { PLACEHOLDER_PARENT_METADATA } from '../form/builder/ds-dynamic-form-ui/ds-dynamic-form-constants';
import { RemoteData } from '../../core/data/remote-data';

import { from as observableFrom, Observable, of as observableOf, Subscription } from 'rxjs';
import { concatMap, map, reduce, tap } from 'rxjs/operators';

import { ItemDataService } from '../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';

interface MetadataOrcid {
  authority: string;
  icon: string;
  value: string;
  orcidAuthenticated: string;
}

@Component({
  selector: 'ds-metadata-link-view',
  templateUrl: './metadata-link-view.component.html',
  styleUrls: ['./metadata-link-view.component.scss']
})
export class MetadataLinkViewComponent implements OnInit {

  @Input('metadata') metadata;
  @Input('item') item : Item;

  private entity2icon: Map<string, string>;

  metadata$ : Observable<MetadataOrcid>;

  constructor(private itemService: ItemDataService,) { 
    this.entity2icon = new Map();
    const confValue = environment.layout.crisRef;
    confValue.forEach( (config) => {
      this.entity2icon.set(config.entityType.toUpperCase(), config.icon);
    });
  }

  ngOnInit(): void {
    this.metadata$ = observableOf(this.metadata).pipe(
        concatMap((metadataValue: MetadataValue) => {
          if (hasValue(metadataValue.authority)) {
            return this.itemService.findById(metadataValue.authority).pipe(
              getFirstCompletedRemoteData(),
              map((itemRD: RemoteData<Item>) => {
                if (itemRD.hasSucceeded) {
                  return {
                    authority: metadataValue.authority,
                    icon: this.getIcon( itemRD.payload.firstMetadataValue('dspace.entity.type')),
                    value: metadataValue.value,
                    orcidAuthenticated: this.getOrcid(itemRD.payload)
                  };
                } else {
                  return {
                    authority: null,
                    icon: null,
                    value: metadataValue.value,
                    orcidAuthenticated: null
                  };
                }
              }),
              // tap(res => console.log(res))
            );
          } else {
            return observableOf({
              authority: null,
              icon: null,
              value: metadataValue.value,
              orcidAuthenticated: null
            });
          }
        }),
      );
  }

  /**
   * Returns the icon configured for given entityType, or
   * default icon if configuration not exists
   * @param entityType entity type name, ex. Person
   */
  getIcon(entityType: string): string {
    return hasValue(entityType) && this.entity2icon.has(entityType.toUpperCase()) ?
      this.entity2icon.get(entityType.toUpperCase()) :
      this.entity2icon.get('DEFAULT');
  }

  getOrcid(referencedItem: Item): string {
    if (referencedItem.hasMetadata('cris.orcid.authenticated')) {
      return referencedItem.firstMetadataValue('person.identifier.orcid');
    }
    return null;
  }

  /**
   * Normalize value to display
   * @param value
   */
  normalizeValue(value: string): string {
    if (isNotEmpty(value) && value.includes(PLACEHOLDER_PARENT_METADATA)) {
      return '';
    } else {
      return value;
    }
  }

}
