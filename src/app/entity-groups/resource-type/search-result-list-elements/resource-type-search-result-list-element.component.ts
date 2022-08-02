import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { ItemSearchResultListElementComponent } from '../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableService } from '../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { MetadataTranslationService } from '../../../core/locale/metadata-translation/metadata-translation.service';

@listableObjectComponent('ResourceTypeSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-resource-type-search-result-list-element',
  styleUrls: ['./resource-type-search-result-list-element.component.scss'],
  templateUrl: './resource-type-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type ResourceType
 */
export class ResourceTypeSearchResultListElementComponent extends ItemSearchResultListElementComponent {

  public constructor(
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService,
    protected metadataTranslationService: MetadataTranslationService) {
    super(truncatableService, dsoNameService);
  }

  currentLanguageValueOrDefault(keyOrKeys: string | string[]): string {
    return this.metadataTranslationService.currentLanguageValueOrDefault(this.dso, keyOrKeys);
  }

}
