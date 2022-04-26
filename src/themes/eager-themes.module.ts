import { NgModule } from '@angular/core';
import { EagerThemeModule as DSpaceEagerThemeModule } from './dspace/eager-theme.module';

/**
 * This module only serves to ensure themed entry components are discoverable. It's kept separate
 * from the theme modules to ensure only the minimal number of theme components is loaded ahead of
 * time
 */
@NgModule({
  imports: [
    DSpaceEagerThemeModule
  ],
})
export class EagerThemesModule {
}
