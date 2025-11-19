// eslint-disable-next-line max-classes-per-file
import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BrowseByDataType } from '@dspace/core/browse/browse-by-data-type';
import { BrowseDefinition } from '@dspace/core/shared/browse-definition.model';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';

import { DynamicComponentLoaderDirective } from '../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { getMockThemeService } from '../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { BrowseBySwitcherComponent } from '../browse-by-switcher/browse-by-switcher.component';
import { BrowseByPageComponent } from './browse-by-page.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  standalone: true,
  template: '<span id="BrowseByTestComponent"></span>',
})
class BrowseByTestComponent {
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ds-browse-by-switcher',
  template: `<ng-template #DynamicComponentLoader dsDynamicComponentLoader></ng-template>`,
  standalone: true,
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
class TestBrowseBySwitcherComponent extends BrowseBySwitcherComponent {
  getComponent(): GenericConstructor<Component> {
    return BrowseByTestComponent;
  }
}

class TestBrowseByPageBrowseDefinition extends BrowseDefinition {
  getRenderType(): BrowseByDataType {
    return 'BrowseByPageComponent' as BrowseByDataType;
  }
}

describe('BrowseByPageComponent', () => {
  let component: BrowseByPageComponent;
  let fixture: ComponentFixture<BrowseByPageComponent>;

  let activatedRoute: ActivatedRouteStub;
  let themeService: ThemeService;

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();
    themeService = getMockThemeService();

    await TestBed.configureTestingModule({
      imports: [TestBrowseBySwitcherComponent, BrowseByPageComponent, DynamicComponentLoaderDirective],
      providers: [
        BrowseByTestComponent,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ThemeService, useValue: themeService },
      ],
    })
      .overrideComponent(BrowseByPageComponent, {
        remove: {
          imports: [BrowseBySwitcherComponent],
        },
        add: {
          imports: [TestBrowseBySwitcherComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BrowseByPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the correct browse section based on the route browseDefinition', () => {
    activatedRoute.testData = {
      browseDefinition: new TestBrowseByPageBrowseDefinition(),
    };

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#BrowseByTestComponent'))).not.toBeNull();
  });
});
