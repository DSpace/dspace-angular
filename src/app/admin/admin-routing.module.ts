import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getAdminModulePath } from '../app-routing.module';

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
      }
    ])
  ]
})
export class AdminRoutingModule {

}
