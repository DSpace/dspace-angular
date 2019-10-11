import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CdkTreeModule} from '@angular/cdk/tree';

import {CommunityListPageComponent} from './community-list-page.component';
import {CommunityListAdapter} from './community-list-adapter';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CommunityListPageComponent, pathMatch: 'full', data: { title: 'communityList.tabTitle' } }
        ]),
        CdkTreeModule,
    ],
    providers: [CommunityListAdapter]
})
export class CommunityListPageRoutingModule { }
