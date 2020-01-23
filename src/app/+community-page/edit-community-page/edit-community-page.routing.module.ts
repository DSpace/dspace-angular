import { CommunityPageResolver } from '../community-page.resolver';
import { EditCommunityPageComponent } from './edit-community-page.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommunityMetadataComponent } from './community-metadata/community-metadata.component';
import { CommunityRolesComponent } from './community-roles/community-roles.component';
import { CommunityCurateComponent } from './community-curate/community-curate.component';

/**
 * Routing module that handles the routing for the Edit Community page administrator functionality
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EditCommunityPageComponent,
        resolve: {
          dso: CommunityPageResolver
        },
        children: [
          {
            path: '',
            redirectTo: 'metadata',
            pathMatch: 'full'
          },
          {
            path: 'metadata',
            component: CommunityMetadataComponent,
            data: {
              title: 'community.edit.tabs.metadata.title',
              hideReturnButton: true
            }
          },
          {
            path: 'roles',
            component: CommunityRolesComponent,
            data: { title: 'community.edit.tabs.roles.title' }
          },
          {
            path: 'curate',
            component: CommunityCurateComponent,
            data: { title: 'community.edit.tabs.curate.title' }
          }
        ]
      }
    ])
  ],
  providers: [
    CommunityPageResolver,
  ]
})
export class EditCommunityPageRoutingModule {

}
