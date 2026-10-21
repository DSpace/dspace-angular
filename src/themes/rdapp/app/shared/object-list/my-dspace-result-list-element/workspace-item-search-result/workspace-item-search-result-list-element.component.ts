import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { WorkspaceItemSearchResult } from '@dspace/core/shared/object-collection/workspace-item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { WorkspaceitemActionsComponent } from '../../../../../../../app/shared/mydspace-actions/workspaceitem/workspaceitem-actions.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ListableObjectComponentLoaderComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { WorkspaceItemSearchResultListElementComponent as BaseComponent } from '../../../../../../../app/shared/object-list/my-dspace-result-list-element/workspace-item-search-result/workspace-item-search-result-list-element.component';

/**
 * Card do rascunho no MyDSpace do depositante. Acrescenta o motivo da devolução para ajuste (HU009 D10, HU010 D1).
 */
@listableObjectComponent(WorkspaceItemSearchResult, ViewMode.ListElement, Context.Any, 'rdapp')
@Component({
  selector: 'ds-workspace-item-search-result-list-element',
  styleUrls: ['./workspace-item-search-result-list-element.component.scss'],
  templateUrl: './workspace-item-search-result-list-element.component.html',
  imports: [
    AsyncPipe,
    ListableObjectComponentLoaderComponent,
    NgClass,
    ThemedLoadingComponent,
    TranslateModule,
    WorkspaceitemActionsComponent,
  ],
})
export class WorkspaceItemSearchResultListElementComponent extends BaseComponent {

  /**
   * Motivo da devolução, lido da proveniência mais recente do item.
   */
  getReturnReason(): string {
    const derivedResult = this.derivedSearchResult$.value;
    const item: Item = derivedResult?.indexableObject;
    const provenances = item?.metadata?.['dc.description.provenance'];
    if (!provenances || provenances.length === 0) {
      return '';
    }

    // Procura a proveniência mais recente que contenha o texto de devolução
    for (let i = provenances.length - 1; i >= 0; i--) {
      const value = provenances[i].value;
      if (value && (value.includes('Devolvido para ajuste') || value.includes('com o seguinte motivo'))) {
        return value;
      }
    }
    return '';
  }
}
