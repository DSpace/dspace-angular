// eslint-disable-next-line max-classes-per-file
import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { BrowseByDataType } from '../../../../browse-by/browse-by-switcher/browse-by-data-type';
import { rendersBrowseBy } from '../../../../browse-by/browse-by-switcher/browse-by-decorator';
import { BrowseBySwitcherComponent } from '../../../../browse-by/browse-by-switcher/browse-by-switcher.component';
import { BrowseDefinition } from '../../../../core/shared/browse-definition.model';
import { DynamicComponentLoaderDirective } from '../../../abstract-component-loader/dynamic-component-loader.directive';
import { getMockThemeService } from '../../../mocks/theme-service.mock';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';
import { ThemeService } from '../../../theme-support/theme.service';
import { ComcolBrowseByComponent } from './comcol-browse-by.component';

@rendersBrowseBy('ComcolBrowseByComponent' as BrowseByDataType)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: '<span id="ComcolBrowseByComponent"></span>',
})
class BrowseByTestComponent {
}

class TestBrowseByPageBrowseDefinition extends BrowseDefinition {
  getRenderType(): BrowseByDataType {
    return 'ComcolBrowseByComponent' as BrowseByDataType;
  }
}

describe('ComcolBrowseByComponent', () => {
  let component: ComcolBrowseByComponent;
  let fixture: ComponentFixture<ComcolBrowseByComponent>;

  let activatedRoute: ActivatedRouteStub;
  let themeService: ThemeService;

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();
    themeService = getMockThemeService();

    await TestBed.configureTestingModule({
      declarations: [
        ComcolBrowseByComponent,
        BrowseBySwitcherComponent,
        DynamicComponentLoaderDirective,
      ],
      providers: [
        BrowseByTestComponent,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ThemeService, useValue: themeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComcolBrowseByComponent);
    component = fixture.componentInstance;
  });

  it('should create the correct browse section based on the route browseDefinition', () => {
    activatedRoute.testData = {
      browseDefinition: new TestBrowseByPageBrowseDefinition(),
    };

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#ComcolBrowseByComponent'))).not.toBeNull();
  });
});
