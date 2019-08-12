import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowseByGuard } from './browse-by-guard';
import { BrowseBySwitcherComponent } from './+browse-by-switcher/browse-by-switcher.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':id', component: BrowseBySwitcherComponent, canActivate: [BrowseByGuard], data: { title: 'browse.title' } }
    ])
  ]
})
export class BrowseByRoutingModule {

}
