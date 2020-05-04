import { CommunityPageResolver } from '../community-page.resolver';
import { EditCommunityPageComponent } from './edit-community-page.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommunityMetadataComponent } from './community-metadata/community-metadata.component';
import { CommunityRolesComponent } from './community-roles/community-roles.component';
import { CommunityCurateComponent } from './community-curate/community-curate.component';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';

/**
 * Routing module that handles the routing for the Edit Community page administrator functionality
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { breadcrumbKey: 'community.edit' },
        component: EditCommunityPageComponent,
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
              hideReturnButton: true,
              showBreadcrumbs: true
            }
          },
          {
            path: 'roles',
            component: CommunityRolesComponent,
            data: { title: 'community.edit.tabs.roles.title', showBreadcrumbs: true }
          },
          {
            path: 'curate',
            component: CommunityCurateComponent,
            data: { title: 'community.edit.tabs.curate.title', showBreadcrumbs: true }
          }
        ]
      }
    ])
  ],
})
export class EditCommunityPageRoutingModule {

}
