import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditItemRelationshipsComponent } from './edit-item-relationships.component';
import { EditItemRelationshipsResolver } from './edit-item-relationships.resolver';
import { EditItemRelationsGuard } from './guards/edit-item-relationships.guard';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
        {
          path: ':id/:type',
          component: EditItemRelationshipsComponent,
          resolve: {
            info: EditItemRelationshipsResolver,
          },
          canActivate: [AuthenticatedGuard, EditItemRelationsGuard],
        }
      ]
    )
  ],
  providers: [
    EditItemRelationshipsResolver
  ]
})
export class EditItemRelationshipsRoutingModule {
}
