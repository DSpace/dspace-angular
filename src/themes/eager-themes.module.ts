import { NgModule } from '@angular/core';

// import { EagerThemeModule as DSpaceEagerThemeModule } from './dspace/eager-theme.module';
// import { EagerThemeModule as CustomEagerThemeModule } from './custom/eager-theme.module';

// TAMU Customization - import custom theme modules
import { EagerThemeModule as CapstoneThemeModule } from './capstone/eager-theme.module';
import { EagerThemeModule as EnergySystemsLaboratoryEagerThemeModule } from './esl/eager-theme.module';
import { EagerThemeModule as ImageGalleryEagerThemeModule } from './image-gallery/eager-theme.module';
import { EagerThemeModule as PeriodicalsEagerThemeModule } from './periodicals/eager-theme.module';
import { EagerThemeModule as OaktrustEagerThemeModule } from './tamu/eager-theme.module';
// END TAMU Customization - import custom theme modules

/**
 * This module bundles the eager theme modules for all available themes.
 * Eager modules contain components that are present on every page (to speed up initial loading)
 * and entry components (to ensure their decorators get picked up).
 *
 * Themes that aren't in use should not be imported here so they don't take up unnecessary space in the main bundle.
 */
@NgModule({
  imports: [
    // TAMU Customization - disable remove dspace theme and enable tamu custom themes
    // DSpaceEagerThemeModule,
    // CustomEagerThemeModule,
    CapstoneThemeModule,
    EnergySystemsLaboratoryEagerThemeModule,
    ImageGalleryEagerThemeModule,
    OaktrustEagerThemeModule,
    PeriodicalsEagerThemeModule,
    // END TAMU Customization - disable remove dspace theme and enable tamu custom themes
  ],
})
export class EagerThemesModule {
}
