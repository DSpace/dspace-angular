import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input } from '@angular/core';
import { ThemedComponent } from '../../../theme-support/themed.component';
import { ItemListPreviewComponent } from './item-list-preview.component';
import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SearchResult } from '../../../search/models/search-result.model';
import { WorkflowItem } from 'src/app/core/submission/models/workflowitem.model';
import { ThemeService } from 'src/app/shared/theme-support/theme.service';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { environment } from '../../../../../../src/environments/environment';

/**
 * Themed wrapper for ItemListPreviewComponent
 */
@Component({
  selector: 'ds-themed-item-list-preview',
  styleUrls: [],
  templateUrl: 'themed-item-list-preview.component.html'
})
export class ThemedItemListPreviewComponent extends ThemedComponent<ItemListPreviewComponent> {
  protected inAndOutputNames: (keyof ItemListPreviewComponent & keyof this)[] = ['item', 'object', 'status', 'showSubmitter'];

  @Input() item: Item;

  @Input() object: SearchResult<any>;

  @Input() status: MyDspaceItemStatusType;

  @Input() showSubmitter = false;

  @Input() workflowItem: WorkflowItem;

  collection: any = null;

  uiBaseUrl: string = environment.ui.baseUrl;

  constructor(
    protected resolver: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected themeService: ThemeService,
    protected collectionDataService: CollectionDataService
  ){
    super(resolver, cdr, themeService)
  }

  ngOnInit() {
    super.ngOnInit()
    this.getCollectionName()
  }

  protected getCollectionName(): void {

    if (!this.item) {
      return;
    }

    const collectionId = this.workflowItem?.sections.collection;

    if (!collectionId) {
      return;
    }

    this.collectionDataService.findByHref(`${environment.rest.baseUrl}/api/core/collections/${collectionId}`).subscribe(collection => {
      this.collection = collection?.payload;
      console.log("collection", this.collection)
    });
  }

  protected getComponentName(): string {
    return 'ItemListPreviewComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-list-preview.component');
  }
}