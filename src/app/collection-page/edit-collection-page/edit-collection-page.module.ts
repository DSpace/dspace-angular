import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccessControlFormModule } from '../../shared/access-control-form-container/access-control-form.module';
import { ComcolModule } from '../../shared/comcol/comcol.module';
import { FormModule } from '../../shared/form/form.module';
import { ResourcePoliciesModule } from '../../shared/resource-policies/resource-policies.module';
import { SharedModule } from '../../shared/shared.module';
import { CollectionFormModule } from '../collection-form/collection-form.module';
import { CollectionAccessControlComponent } from './collection-access-control/collection-access-control.component';
import { CollectionAuthorizationsComponent } from './collection-authorizations/collection-authorizations.component';
import { CollectionCurateComponent } from './collection-curate/collection-curate.component';
import { CollectionMetadataComponent } from './collection-metadata/collection-metadata.component';
import { CollectionRolesComponent } from './collection-roles/collection-roles.component';
import { CollectionSourceComponent } from './collection-source/collection-source.component';
import { CollectionSourceControlsComponent } from './collection-source/collection-source-controls/collection-source-controls.component';
import { EditCollectionPageComponent } from './edit-collection-page.component';
import { EditCollectionPageRoutingModule } from './edit-collection-page.routing.module';

/**
 * Module that contains all components related to the Edit Collection page administrator functionality
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditCollectionPageRoutingModule,
    CollectionFormModule,
    ResourcePoliciesModule,
    FormModule,
    ComcolModule,
    AccessControlFormModule,
  ],
  declarations: [
    EditCollectionPageComponent,
    CollectionMetadataComponent,
    CollectionRolesComponent,
    CollectionCurateComponent,
    CollectionSourceComponent,
    CollectionAccessControlComponent,
    CollectionSourceControlsComponent,
    CollectionAuthorizationsComponent,
  ],
})
export class EditCollectionPageModule {

}
