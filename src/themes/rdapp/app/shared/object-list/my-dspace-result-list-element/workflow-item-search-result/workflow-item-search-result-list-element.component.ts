import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { Context } from '@dspace/core/shared/context.model';
import { WorkflowItemSearchResult } from '@dspace/core/shared/object-collection/workflow-item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { WorkflowitemActionsComponent } from '../../../../../../../app/shared/mydspace-actions/workflowitem/workflowitem-actions.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedItemListPreviewComponent } from '../../../../../../../app/shared/object-list/my-dspace-result-list-element/item-list-preview/themed-item-list-preview.component';
import { WorkflowItemSearchResultListElementComponent as BaseComponent } from '../../../../../../../app/shared/object-list/my-dspace-result-list-element/workflow-item-search-result/workflow-item-search-result-list-element.component';

/**
 * Card do item em workflow no MyDSpace do curador. Usa o preview do item com o depositante e o título (HU010 D5).
 */
@listableObjectComponent(WorkflowItemSearchResult, ViewMode.ListElement, Context.Any, 'rdapp')
@Component({
  selector: 'ds-workflow-item-my-dspace-result-list-element',
  styleUrls: ['../../../../../../../app/shared/object-list/search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './workflow-item-search-result-list-element.component.html',
  imports: [
    AsyncPipe,
    NgClass,
    ThemedItemListPreviewComponent,
    ThemedLoadingComponent,
    WorkflowitemActionsComponent,
  ],
})
export class WorkflowItemSearchResultListElementComponent extends BaseComponent {
}
