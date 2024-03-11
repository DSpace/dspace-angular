// eslint-disable-next-line max-classes-per-file
import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { BrowseDefinition } from '../../core/shared/browse-definition.model';
import { DynamicComponentLoaderDirective } from '../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { BrowseByDataType } from '../browse-by-switcher/browse-by-data-type';
import { rendersBrowseBy } from '../browse-by-switcher/browse-by-decorator';
import { BrowseBySwitcherComponent } from '../browse-by-switcher/browse-by-switcher.component';
import { BrowseByPageComponent } from './browse-by-page.component';

@rendersBrowseBy('BrowseByPageComponent' as BrowseByDataType)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: '<span id="BrowseByTestComponent"></span>',
})
class BrowseByTestComponent {
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
      declarations: [
        BrowseByPageComponent,
        BrowseBySwitcherComponent,
        DynamicComponentLoaderDirective,
      ],
      providers: [
        BrowseByTestComponent,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ThemeService, useValue: themeService },
      ],
    }).compileComponents();

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
