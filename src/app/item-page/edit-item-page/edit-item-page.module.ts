import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { EditItemPageRoutingModule } from './edit-item-page.routing.module';
import { EditItemPageComponent } from './edit-item-page.component';
import { ItemStatusComponent } from './item-status/item-status.component';
import { ItemOperationComponent } from './item-operation/item-operation.component';
import { ItemWithdrawComponent } from './item-withdraw/item-withdraw.component';
import { ItemReinstateComponent } from './item-reinstate/item-reinstate.component';
import { AbstractSimpleItemActionComponent } from './simple-item-action/abstract-simple-item-action.component';
import { ItemPrivateComponent } from './item-private/item-private.component';
import { ItemPublicComponent } from './item-public/item-public.component';
import { ItemDeleteComponent } from './item-delete/item-delete.component';
import { ItemMetadataComponent } from './item-metadata/item-metadata.component';
import { ThemedItemMetadataComponent } from './item-metadata/themed-item-metadata.component';
import { EditInPlaceFieldComponent } from './item-metadata/edit-in-place-field/edit-in-place-field.component';
import { ItemBitstreamsComponent } from './item-bitstreams/item-bitstreams.component';
import { ItemEditBitstreamComponent } from './item-bitstreams/item-edit-bitstream/item-edit-bitstream.component';
import { SearchPageModule } from '../../search-page/search-page.module';
import { ItemCollectionMapperComponent } from './item-collection-mapper/item-collection-mapper.component';
import { ItemRelationshipsComponent } from './item-relationships/item-relationships.component';
import { EditRelationshipComponent } from './item-relationships/edit-relationship/edit-relationship.component';
import { EditRelationshipListComponent } from './item-relationships/edit-relationship-list/edit-relationship-list.component';
import { AbstractItemUpdateComponent } from './abstract-item-update/abstract-item-update.component';
import { ItemMoveComponent } from './item-move/item-move.component';
import { ItemEditBitstreamBundleComponent } from './item-bitstreams/item-edit-bitstream-bundle/item-edit-bitstream-bundle.component';
import { BundleDataService } from '../../core/data/bundle-data.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ItemEditBitstreamDragHandleComponent } from './item-bitstreams/item-edit-bitstream-drag-handle/item-edit-bitstream-drag-handle.component';
import { PaginatedDragAndDropBitstreamListComponent } from './item-bitstreams/item-edit-bitstream-bundle/paginated-drag-and-drop-bitstream-list/paginated-drag-and-drop-bitstream-list.component';
import { VirtualMetadataComponent } from './virtual-metadata/virtual-metadata.component';
import { ItemVersionHistoryComponent } from './item-version-history/item-version-history.component';
import { ItemAuthorizationsComponent } from './item-authorizations/item-authorizations.component';
import { ObjectValuesPipe } from '../../shared/utils/object-values-pipe';
import { ResourcePoliciesModule } from '../../shared/resource-policies/resource-policies.module';


/**
 * Module that contains all components related to the Edit Item page administrator functionality
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbTooltipModule,
    EditItemPageRoutingModule,
    SearchPageModule,
    DragDropModule,
    ResourcePoliciesModule,
    NgbModule
  ],
  declarations: [
    EditItemPageComponent,
    ItemOperationComponent,
    AbstractSimpleItemActionComponent,
    AbstractItemUpdateComponent,
    ItemWithdrawComponent,
    ItemReinstateComponent,
    ItemPrivateComponent,
    ItemPublicComponent,
    ItemDeleteComponent,
    ItemStatusComponent,
    ItemMetadataComponent,
    ThemedItemMetadataComponent,
    ItemRelationshipsComponent,
    ItemBitstreamsComponent,
    ItemVersionHistoryComponent,
    EditInPlaceFieldComponent,
    ItemEditBitstreamComponent,
    ItemEditBitstreamBundleComponent,
    PaginatedDragAndDropBitstreamListComponent,
    EditInPlaceFieldComponent,
    EditRelationshipComponent,
    EditRelationshipListComponent,
    ItemCollectionMapperComponent,
    ItemMoveComponent,
    ItemEditBitstreamDragHandleComponent,
    VirtualMetadataComponent,
    ItemAuthorizationsComponent
  ],
  providers: [
    BundleDataService,
    ObjectValuesPipe
  ],
  exports: [
    EditInPlaceFieldComponent,
    ThemedItemMetadataComponent,
  ]
})
export class EditItemPageModule {

}
