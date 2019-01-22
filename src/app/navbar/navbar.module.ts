import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from '../core/core.module';
import { NavbarEffects } from './navbar.effects';
import { NavbarSectionComponent } from './navbar-section/navbar-section.component';
import { ExpandableNavbarSectionComponent } from './expandable-navbar-section/expandable-navbar-section.component';
import { NavbarComponent } from './navbar.component';

const effects = [
  NavbarEffects
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EffectsModule.forFeature(effects),
    CoreModule.forRoot()
  ],
  declarations: [
    NavbarComponent,
    NavbarSectionComponent,
    ExpandableNavbarSectionComponent
  ],
  providers: [

  ],
  entryComponents: [
    NavbarSectionComponent,
    ExpandableNavbarSectionComponent
  ],
  exports: [
    NavbarComponent,
    NavbarSectionComponent,
    ExpandableNavbarSectionComponent
  ]
})

/**
 * This module handles all components and pipes that are necessary for the horizontal navigation bar
 */
export class NavbarModule {
}
