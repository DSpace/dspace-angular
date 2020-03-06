import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getAdminModulePath } from '../app-routing.module';
import { AdminSearchPageComponent } from './admin-search-page/admin-search-page.component';

const REGISTRIES_MODULE_PATH = 'registries';

export function getRegistriesModulePath() {
  return new URLCombiner(getAdminModulePath(), REGISTRIES_MODULE_PATH).toString();
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: REGISTRIES_MODULE_PATH,
        loadChildren: './admin-registries/admin-registries.module#AdminRegistriesModule'
      },
      { path: 'search', component: AdminSearchPageComponent, data: { title: 'admin.search.title' } },
    ])
  ]
})
export class AdminRoutingModule {

}
