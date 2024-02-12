// eslint-disable-next-line max-classes-per-file
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseByPageComponent } from './browse-by-page.component';
import { BrowseBySwitcherComponent } from '../browse-by-switcher/browse-by-switcher.component';
import { DynamicComponentLoaderDirective } from '../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { rendersBrowseBy } from '../browse-by-switcher/browse-by-decorator';
import { Component } from '@angular/core';
import { BrowseDefinition } from '../../core/shared/browse-definition.model';
import { By } from '@angular/platform-browser';
import { BrowseByDataType } from '../browse-by-switcher/browse-by-data-type';

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
