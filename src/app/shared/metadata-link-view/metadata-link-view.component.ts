import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { PLACEHOLDER_PARENT_METADATA } from '@dspace/core/shared/form/ds-dynamic-form-constants';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import {
  NgbPopoverModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { Metadata } from '../../core/shared/metadata.utils';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { EntityIconDirective } from '../entity-icon/entity-icon.directive';
import { VarDirective } from '../utils/var.directive';
import { MetadataLinkViewPopoverComponent } from './metadata-link-view-popover/metadata-link-view-popover.component';
import { MetadataView } from './metadata-view.model';
import { StickyPopoverDirective } from './sticky-popover.directive';

@Component({
  selector: 'ds-metadata-link-view',
  templateUrl: './metadata-link-view.component.html',
  styleUrls: ['./metadata-link-view.component.scss'],
  imports: [
    AsyncPipe,
    EntityIconDirective,
    MetadataLinkViewPopoverComponent,
    NgbPopoverModule,
    NgbTooltipModule,
    NgTemplateOutlet,
    RouterLink,
    StickyPopoverDirective,
    VarDirective,
  ],
})
export class MetadataLinkViewComponent implements OnInit {

  /**
   * Metadata value that we need to show in the template
   */
  @Input() metadata: MetadataValue;

  /**
   * Processed metadata to create MetadataOrcid with the information needed to show
   */
  metadataView$: Observable<MetadataView>;

  /**
   * Position of the Icon before/after the element
   */
  iconPosition = 'after';

  /**
   * Related item of the metadata value
   */
  relatedItem: Item;

  /**
   * Route of related item page
   */
  relatedDsoRoute: string;

  /**
   * Map all entities with the icons specified in the environment configuration file
   */
  constructor(private itemService: ItemDataService) { }

  /**
   * On init process metadata to get the information and form MetadataOrcid model
   */
  ngOnInit(): void {
    this.metadataView$ = of(this.metadata).pipe(
      switchMap((metadataValue: MetadataValue) => this.getMetadataView(metadataValue)),
      take(1),
    );
  }


  /**
   * Retrieves the metadata view for a given metadata value.
   * If the metadata value has a valid authority, it retrieves the item using the authority and creates a metadata view.
   * If the metadata value does not have a valid authority, it creates a metadata view with null values.
   *
   * @param metadataValue The metadata value for which to retrieve the metadata view.
   * @returns An Observable that emits the metadata view.
   */
  private getMetadataView(metadataValue: MetadataValue): Observable<MetadataView> {
    const linksToFollow = [followLink('thumbnail')];

    if (Metadata.hasValidAuthority(metadataValue.authority)) {
      return this.itemService.findById(metadataValue.authority, true, false, ...linksToFollow).pipe(
        getFirstCompletedRemoteData(),
        map((itemRD: RemoteData<Item>) => this.createMetadataView(itemRD, metadataValue)),
      );
    } else {
      return of({
        authority: null,
        value: metadataValue.value,
        orcidAuthenticated: null,
        entityType: null,
        entityStyle: null,
      });
    }
  }

  /**
   * Creates a MetadataView object based on the provided itemRD and metadataValue.
   * @param itemRD - The RemoteData object containing the item information.
   * @param metadataValue - The MetadataValue object containing the metadata information.
   * @returns The created MetadataView object.
   */
  private createMetadataView(itemRD: RemoteData<Item>, metadataValue: MetadataValue): MetadataView {
    if (itemRD.hasSucceeded && itemRD.payload) {
      this.relatedItem = itemRD.payload;
      this.relatedDsoRoute = this.getItemPageRoute(this.relatedItem);
      return {
        authority: metadataValue.authority,
        value: metadataValue.value,
        orcidAuthenticated: this.getOrcid(itemRD.payload),
        entityType: (itemRD.payload as Item)?.entityType,
      };
    } else {
      return {
        authority: null,
        value: metadataValue.value,
        orcidAuthenticated: null,
        entityType: 'PRIVATE',
      };
    }
  }

  /**
   * Returns the orcid for given item, or null if there is no metadata authenticated for person
   *
   * @param referencedItem Item of the metadata being shown
   */
  getOrcid(referencedItem: Item): string {
    if (referencedItem?.hasMetadata('dspace.orcid.authenticated')) {
      return referencedItem.firstMetadataValue('person.identifier.orcid');
    }
    return null;
  }

  /**
   * Normalize value to display
   *
   * @param value
   */
  normalizeValue(value: string): string {
    if (isNotEmpty(value) && value.includes(PLACEHOLDER_PARENT_METADATA)) {
      return '';
    } else {
      return value;
    }
  }

  getItemPageRoute(item: Item): string {
    return getItemPageRoute(item);
  }

}
