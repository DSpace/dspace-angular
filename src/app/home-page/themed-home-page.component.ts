import { Component } from '@angular/core';

import { ThemedComponent } from '../shared/theme-support/themed.component';
import { HomePageComponent } from './home-page.component';

@Component({
  selector: 'ds-home-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    HomePageComponent,
  ],
})
export class ThemedHomePageComponent extends ThemedComponent<HomePageComponent> {

  protected getComponentName(): string {
    return 'HomePageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/home-page/home-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./home-page.component`);
  }

}
