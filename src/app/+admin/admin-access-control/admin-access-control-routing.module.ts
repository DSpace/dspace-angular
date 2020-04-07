import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EPeopleRegistryComponent } from './epeople-registry/epeople-registry.component';
import { GroupFormComponent } from './group-registry/group-form/group-form.component';
import { GroupsRegistryComponent } from './group-registry/groups-registry.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'epeople', component: EPeopleRegistryComponent, data: { title: 'admin.access-control.epeople.title' } },
      { path: 'groups', component: GroupsRegistryComponent, data: { title: 'admin.access-control.groups.title' } },
      {
        path: 'groups/:groupId',
        component: GroupFormComponent,
        data: {title: 'admin.registries.schema.title'}
      },
      {
        path: 'groups/newGroup',
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
