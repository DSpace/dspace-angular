import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditCommunityPageRoutingModule } from './edit-community-page.routing.module';
import { CommunityPageModule } from '../community-page.module';
import { EditCommunityPageComponent } from './edit-community-page.component';
import { CommunityCurateComponent } from './community-curate/community-curate.component';
import { CommunityMetadataComponent } from './community-metadata/community-metadata.component';
import { CommunityRolesComponent } from './community-roles/community-roles.component';

/**
 * Module that contains all components related to the Edit Community page administrator functionality
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditCommunityPageRoutingModule,
    CommunityPageModule
  ],
  declarations: [
    EditCommunityPageComponent,
    CommunityCurateComponent,
    CommunityMetadataComponent,
    CommunityRolesComponent
  ]
})
export class EditCommunityPageModule {

}
