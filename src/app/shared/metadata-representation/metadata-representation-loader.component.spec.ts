import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { Context } from '../../core/shared/context.model';
import {
  MetadataRepresentation,
  MetadataRepresentationType
} from '../../core/shared/metadata-representation/metadata-representation.model';
import { MetadataRepresentationLoaderComponent } from './metadata-representation-loader.component';
import { DynamicComponentLoaderDirective } from '../abstract-component-loader/dynamic-component-loader.directive';
import { METADATA_REPRESENTATION_COMPONENT_FACTORY } from './metadata-representation.decorator';
import { ThemeService } from '../theme-support/theme.service';
import { PlainTextMetadataListElementComponent } from '../object-list/metadata-representation-list-element/plain-text/plain-text-metadata-list-element.component';
import { getMockThemeService } from '../mocks/theme-service.mock';

const testType = 'TestType';
const testContext = Context.Search;
const testRepresentationType = MetadataRepresentationType.Item;

class TestType implements MetadataRepresentation {
  get itemType(): string {
    return testType;
  }

  get representationType(): MetadataRepresentationType {
    return testRepresentationType;
  }

  getValue(): string {
    return '';
  }
}

describe('MetadataRepresentationLoaderComponent', () => {
  let comp: MetadataRepresentationLoaderComponent;
  let fixture: ComponentFixture<MetadataRepresentationLoaderComponent>;
  let themeService: ThemeService;
  const themeName = 'test-theme';

  beforeEach(waitForAsync(() => {
    themeService = getMockThemeService(themeName);
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        MetadataRepresentationLoaderComponent,
        PlainTextMetadataListElementComponent,
        DynamicComponentLoaderDirective,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: METADATA_REPRESENTATION_COMPONENT_FACTORY,
          useValue: jasmine.createSpy('getMetadataRepresentationComponent').and.returnValue(PlainTextMetadataListElementComponent)
        },
        {
          provide: ThemeService,
          useValue: themeService,
        }
      ]
    }).overrideComponent(MetadataRepresentationLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        entryComponents: [PlainTextMetadataListElementComponent]
      }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(MetadataRepresentationLoaderComponent);
    comp = fixture.componentInstance;
    spyOn(comp, 'getComponent').and.callThrough();

    comp.mdRepresentation = new TestType();
    comp.context = testContext;
    fixture.detectChanges();
  }));

  describe('When the component is rendered', () => {
    it('should call the getComponent function', () => {
      expect(comp.getComponent).toHaveBeenCalled();
    });
  });
});
