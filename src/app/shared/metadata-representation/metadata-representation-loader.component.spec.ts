import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, ComponentFactoryResolver, NO_ERRORS_SCHEMA } from '@angular/core';
import { Context } from '../../core/shared/context.model';
import { MetadataRepresentation, MetadataRepresentationType } from '../../core/shared/metadata-representation/metadata-representation.model';
import { MetadataRepresentationLoaderComponent } from './metadata-representation-loader.component';
import { PlainTextMetadataListElementComponent } from '../object-list/metadata-representation-list-element/plain-text/plain-text-metadata-list-element.component';
import { spyOnExported } from '../testing/utils.test';
import { MetadataRepresentationDirective } from './metadata-representation.directive';
import * as metadataRepresentationDecorator from './metadata-representation.decorator';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [MetadataRepresentationLoaderComponent, PlainTextMetadataListElementComponent, MetadataRepresentationDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ComponentFactoryResolver]
    }).overrideComponent(MetadataRepresentationLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        entryComponents: [PlainTextMetadataListElementComponent]
      }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MetadataRepresentationLoaderComponent);
    comp = fixture.componentInstance;

    comp.mdRepresentation = new TestType();
    comp.context = testContext;

    spyOnExported(metadataRepresentationDecorator, 'getMetadataRepresentationComponent').and.returnValue(PlainTextMetadataListElementComponent);
    fixture.detectChanges();

  }));

  describe('When the component is rendered', () => {
    it('should call the getMetadataRepresentationComponent function with the right entity type, representation type and context', () => {
      expect(metadataRepresentationDecorator.getMetadataRepresentationComponent).toHaveBeenCalledWith(testType, testRepresentationType, testContext);
    })
  });
});
