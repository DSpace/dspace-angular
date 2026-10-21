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
   * Tipo e motivo da última rejeição ou devolução para ajuste. Lê primeiro o `dc.description` público (marcado com
   * [DEVOLVIDO_AJUSTE] ou [REJEITADO], que o depositante comum consegue ler) e, se não achar, a proveniência
   * (que só administradores leem).
   */
  getReturnInfo(): { type: 'ADJUSTMENT' | 'REJECTED'; reason: string } | null {
    const item: Item = this.derivedSearchResult$.value?.indexableObject;
    if (!item?.metadata) {
      return null;
    }

    const descriptions = item.metadata['dc.description'] || [];
    for (let i = descriptions.length - 1; i >= 0; i--) {
      const value = descriptions[i].value || '';
      if (value.startsWith('[DEVOLVIDO_AJUSTE] ')) {
        return { type: 'ADJUSTMENT', reason: value.replace('[DEVOLVIDO_AJUSTE] ', '').trim() };
      }
      if (value.startsWith('[REJEITADO] ')) {
        return { type: 'REJECTED', reason: value.replace('[REJEITADO] ', '').trim() };
      }
    }

    const provenances = item.metadata['dc.description.provenance'] || [];
    for (let i = provenances.length - 1; i >= 0; i--) {
      const value = provenances[i].value || '';
      if (value.includes('Devolvido para ajuste')) {
        const parts = value.split('com o seguinte motivo:');
        return { type: 'ADJUSTMENT', reason: parts.length > 1 ? parts[1].trim() : value };
      }
      if (value.includes('Rejected by') && value.includes(', reason:')) {
        const parts = value.split(', reason:');
        return { type: 'REJECTED', reason: parts.length > 1 ? parts[1].trim() : value };
      }
    }
    return null;
  }
}
