import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { focusShadow } from '../../../shared/animations/focus';
import { ItemSearchResultGridElementComponent } from '../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
import { TruncatableService } from '../../../shared/truncatable/truncatable.service';
import { MetadataTranslationService } from '../../../core/locale/metadata-translation/metadata-translation.service';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';

@listableObjectComponent('ResourceTypeSearchResult', ViewMode.GridElement)
@Component({
  selector: 'ds-resource-type-search-result-grid-element',
  styleUrls: ['./resource-type-search-result-grid-element.component.scss'],
  templateUrl: './resource-type-search-result-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item search result of the type ResourceType
 */
export class ResourceTypeSearchResultGridElementComponent extends ItemSearchResultGridElementComponent {

  public constructor(
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    protected metadataTranslationService: MetadataTranslationService) {
    super(truncatableService, bitstreamDataService);
  }

  currentLanguageValueOrDefault(keyOrKeys: string | string[]): string {
    return this.metadataTranslationService.currentLanguageValueOrDefault(this.dso, keyOrKeys);
  }

}
