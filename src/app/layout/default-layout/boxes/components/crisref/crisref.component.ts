import { Component, OnInit } from '@angular/core';

import { from as observableFrom, Observable, of as observableOf, Subscription } from 'rxjs';
import { concatMap, map, reduce } from 'rxjs/operators';

import { RenderingTypeModelComponent } from '../rendering-type.model';
import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { hasValue } from '../../../../../shared/empty.util';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../../../../core/shared/operators';
import { environment } from '../../../../../../environments/environment';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Item } from '../../../../../core/shared/item.model';

interface CrisRef {
  id: string;
  icon: string;
  value: string;
  orcidAuthenticated: string;
}

/**
 * This component renders the crisref metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-crisref]',
  templateUrl: './crisref.component.html',
  styleUrls: ['./crisref.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.CRISREF)
export class CrisrefComponent extends RenderingTypeModelComponent implements OnInit {

  private entity2icon: Map<string, string>;

  /**
   * List of cris references to show
   * created from metadata and its
   * authority
   */
  references: Observable<CrisRef[]>;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(private itemService: ItemDataService) {
    super();

    this.entity2icon = new Map();
    const confValue = environment.layout.crisRef;
    confValue.forEach( (config) => {
      this.entity2icon.set(config.entityType.toUpperCase(), config.icon);
    });
  }

  ngOnInit() {
    const itemMetadata: MetadataValue[] = this.item.allMetadata( this.field.metadata );
    let itemsToBeRendered = [];
    if (this.indexToBeRendered >= 0) {
      itemsToBeRendered.push(itemMetadata[this.indexToBeRendered]);
    } else {
      itemsToBeRendered = [...itemMetadata];
    }
    if (hasValue(itemsToBeRendered)) {
      this.references = observableFrom(itemsToBeRendered).pipe(
        concatMap((metadataValue: MetadataValue) => {
          if (hasValue(metadataValue.authority)) {
            return this.itemService.findById(metadataValue.authority).pipe(
              getFirstCompletedRemoteData(),
              map((itemRD: RemoteData<Item>) => {
                if (itemRD.hasSucceeded) {
                  return {
                    id: metadataValue.authority,
                    icon: this.getIcon( itemRD.payload.firstMetadataValue('dspace.entity.type')),
                    value: metadataValue.value,
                    orcidAuthenticated: this.getOrcid(itemRD.payload)
                  };
                } else {
                  return {
                    id: null,
                    icon: null,
                    value: metadataValue.value,
                    orcidAuthenticated: null
                  };
                }
              })
            );
          } else {
            return observableOf({
              id: null,
              icon: null,
              value: metadataValue.value,
              orcidAuthenticated: null
            });
          }
        }),
        reduce((acc: any, value: any) => [...acc, value], [])
      );
    }
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
   * Unsubscribes all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
