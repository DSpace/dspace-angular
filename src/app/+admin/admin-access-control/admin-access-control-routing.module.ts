import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EPeopleRegistryComponent } from './epeople-registry/epeople-registry.component';
import { GroupFormComponent } from './group-registry/group-form/group-form.component';
import { GroupsRegistryComponent } from './group-registry/groups-registry.component';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getAccessControlModulePath } from '../admin-routing.module';

export const GROUP_EDIT_PATH = 'groups';

export function getGroupEditPath(id: string) {
  return new URLCombiner(getAccessControlModulePath(), GROUP_EDIT_PATH, id).toString();
}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'epeople', component: EPeopleRegistryComponent, data: { title: 'admin.access-control.epeople.title' } },
      { path: GROUP_EDIT_PATH, component: GroupsRegistryComponent, data: { title: 'admin.access-control.groups.title' } },
      {
        path: `${GROUP_EDIT_PATH}/:groupId`,
        component: GroupFormComponent,
        data: {title: 'admin.registries.schema.title'}
      },
      {
        path: `${GROUP_EDIT_PATH}/newGroup`,
        component: GroupFormComponent,
        data: {title: 'admin.registries.schema.title'}
      },
    ])
  ]
})
/**
 * Routing module for the AccessControl section of the admin sidebar
 */
export class AdminAccessControlRoutingModule {

}
