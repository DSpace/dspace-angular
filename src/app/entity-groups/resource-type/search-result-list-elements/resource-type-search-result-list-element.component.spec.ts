import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { ItemSearchResult } from '../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../core/shared/item.model';
import { ResourceTypeSearchResultListElementComponent } from './resource-type-search-result-list-element.component';
import { TruncatePipe } from '../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../shared/mocks/dso-name.service.mock';
import { LocaleService } from '../../../core/locale/locale.service';


let resourceTypeSearchResultListElementComponent: ResourceTypeSearchResultListElementComponent;
let fixture: ComponentFixture<ResourceTypeSearchResultListElementComponent>;

const englishLabel = 'doctoral thesis';
const frenchLabel = 'thèse de doctorat';
const spanishLabel = 'tesis doctoral';
const englishDefinition = 'A thesis reporting the research undertaken during a period of graduate study leading to a doctoral degree.';

const localServiceStubSpanish: any = {
  getCurrentLanguageCode(): string { return 'es'; },
};

const mockItem: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bundles: observableOf({}),
      metadata: {
        'resourcetypes.preferredLabels': [
          {
            language: 'en',
            value: englishLabel
          },
          {
            language: 'fr',
            value: frenchLabel
          },
          {
            language: 'es',
            value: spanishLabel
          },
        ],
        'resourcetypes.definition': [
          {
            language: 'en',
            value: englishDefinition
          }
        ]
      }
    })
  });
  
describe('ResourceTypeSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceTypeSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: LocaleService, useValue: localServiceStubSpanish },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ResourceTypeSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ResourceTypeSearchResultListElementComponent);
    resourceTypeSearchResultListElementComponent = fixture.componentInstance;
    resourceTypeSearchResultListElementComponent.object = mockItem;
    fixture.detectChanges();
  }));

  it('should show the resource type prefered label of the current language code when availlable', () => {
    const innerHTML = fixture.nativeElement.innerHTML;
    expect(innerHTML).toContain(spanishLabel);
  });

  it('should show the resource type definition of the default language code when current language code is unavaillable', () => {
    const innerHTML = fixture.nativeElement.innerHTML;
    expect(innerHTML).toContain(englishDefinition);
  });

});
