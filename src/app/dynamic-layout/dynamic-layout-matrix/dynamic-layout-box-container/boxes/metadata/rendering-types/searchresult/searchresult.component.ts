import {
  AsyncPipe,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { Metadata } from '@dspace/core/shared/metadata.utils';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '@dspace/core/data/remote-data';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { ListableObjectComponentLoaderComponent } from '../../../../../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { FieldRenderingType } from '../field-rendering-type';
import { MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeStructuredDirective } from '../rendering-type-structured.directive';

/**
 * This component renders metadata values as search result items.
 * It resolves each metadata value's authority to an Item and displays it
 * using the ListableObjectComponentLoaderComponent in ListElement view mode,
 * similar to how related-items.component.html displays related items.
 */
@MetadataBoxFieldRendering(FieldRenderingType.SEARCHRESULT, true)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ds-searchresult',
  templateUrl: './searchresult.component.html',
  styleUrls: ['./searchresult.component.scss'],
  imports: [
    AsyncPipe,
    ListableObjectComponentLoaderComponent,
  ],
})
export class SearchresultComponent extends RenderingTypeStructuredDirective implements OnInit {

  /**
   * The resolved items from authority metadata values
   */
  resolvedItems$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  /**
   * The view mode to display items in
   */
  viewMode = ViewMode.ListElement;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected translateService: TranslateService,
    private itemService: ItemDataService,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

  ngOnInit(): void {
    this.resolveAuthorityItems();
  }

  /**
   * Resolves all metadata values that have a valid authority to Item objects.
   * Each authority value is used as an Item ID to fetch the related item.
   */
  private resolveAuthorityItems(): void {
    const metadataValues: MetadataValue[] = this.metadata;
    const items: Item[] = [];

    if (!metadataValues || metadataValues.length === 0) {
      this.resolvedItems$.next([]);
      return;
    }

    let completed = 0;
    const validMetadata = metadataValues.filter(mv => Metadata.hasValidAuthority(mv.authority));

    if (validMetadata.length === 0) {
      this.resolvedItems$.next([]);
      return;
    }

    validMetadata.forEach((metadataValue: MetadataValue) => {
      this.findItemByAuthority(metadataValue.authority).subscribe((item: Item | null) => {
        if (item) {
          items.push(item);
        }
        completed++;
        if (completed === validMetadata.length) {
          this.resolvedItems$.next(items);
        }
      });
    });
  }

  /**
   * Find an item by its authority (UUID).
   * @param authority The authority value (item UUID) to look up
   * @returns Observable of the found Item, or null if not found
   */
  private findItemByAuthority(authority: string): Observable<Item | null> {
    return this.itemService.findById(authority, true, false, followLink('thumbnail')).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<Item>) => rd.hasSucceeded ? rd.payload : null),
    );
  }
}
