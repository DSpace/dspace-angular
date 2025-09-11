import {
  Component,
  SimpleChange,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { FlatBrowseDefinition } from '../../core/shared/flat-browse-definition.model';
import { NonHierarchicalBrowseDefinition } from '../../core/shared/non-hierarchical-browse-definition';
import { ValueListBrowseDefinition } from '../../core/shared/value-list-browse-definition.model';
import { DynamicComponentLoaderDirective } from '../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { BrowseByDataType } from './browse-by-data-type';
import { BrowseBySwitcherComponent } from './browse-by-switcher.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  standalone: true,
  template: '<span id="BrowseByTestComponent"></span>',
})
class BrowseByTestComponent {
}

describe('BrowseBySwitcherComponent', () => {
  let comp: BrowseBySwitcherComponent;
  let fixture: ComponentFixture<BrowseBySwitcherComponent>;

  const types = [
    Object.assign(
      new FlatBrowseDefinition(), {
        id: 'title',
        dataType: BrowseByDataType.Title,
      },
    ),
    Object.assign(
      new FlatBrowseDefinition(), {
        id: 'dateissued',
        dataType: BrowseByDataType.Date,
        metadataKeys: ['dc.date.issued'],
      },
    ),
    Object.assign(
      new ValueListBrowseDefinition(), {
        id: 'author',
        dataType: BrowseByDataType.Metadata,
      },
    ),
    Object.assign(
      new ValueListBrowseDefinition(), {
        id: 'subject',
        dataType: BrowseByDataType.Metadata,
      },
    ),
  ];

  let themeService: ThemeService;
  const themeName = 'dspace';

  beforeEach(waitForAsync(() => {
    themeService = getMockThemeService(themeName);

    void TestBed.configureTestingModule({
      imports: [
        BrowseBySwitcherComponent,
        DynamicComponentLoaderDirective,
      ],
      providers: [
        BrowseByTestComponent,
        { provide: ThemeService, useValue: themeService },
      ],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(BrowseBySwitcherComponent);
    comp = fixture.componentInstance;
    spyOn(comp, 'getComponent').and.returnValue(BrowseByTestComponent);
    spyOn(comp, 'connectInputsAndOutputs').and.callThrough();
  }));

  types.forEach((type: NonHierarchicalBrowseDefinition) => {
    describe(`when switching to a browse-by page for "${type.id}"`, () => {
      beforeEach(async () => {
        comp.browseByType = type as any;
        comp.ngOnChanges({
          browseByType: new SimpleChange(undefined, type.dataType, true),
        });
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it(`should call getComponent with type "${type.dataType}"`, () => {
        expect(comp.getComponent).toHaveBeenCalled();
        expect(comp.connectInputsAndOutputs).toHaveBeenCalled();
      });
    });
  });
});

export function createDataWithBrowseDefinition(browseDefinition) {
  return { browseDefinition: browseDefinition };
}
