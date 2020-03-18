import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, ComponentFactoryResolver, NO_ERRORS_SCHEMA } from '@angular/core';
import { ListableObjectComponentLoaderComponent } from './listable-object-component-loader.component';
import { ListableObject } from '../listable-object.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import * as listableObjectDecorators from './listable-object.decorator';
import { PublicationListElementComponent } from '../../../object-list/item-list-element/item-types/publication/publication-list-element.component';
import { ListableObjectDirective } from './listable-object.directive';
import { spyOnExported } from '../../../testing/utils.test';

const testType = 'TestType';
const testContext = Context.Search;
const testViewMode = ViewMode.StandalonePage;

class TestType extends ListableObject {
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [testType];
  }
}

describe('ListableObjectComponentLoaderComponent', () => {
  let comp: ListableObjectComponentLoaderComponent;
  let fixture: ComponentFixture<ListableObjectComponentLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ListableObjectComponentLoaderComponent, PublicationListElementComponent, ListableObjectDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ComponentFactoryResolver]
    }).overrideComponent(ListableObjectComponentLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        entryComponents: [PublicationListElementComponent]
      }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListableObjectComponentLoaderComponent);
    comp = fixture.componentInstance;

    comp.object = new TestType();
    comp.viewMode = testViewMode;
    comp.context = testContext;
    spyOnExported(listableObjectDecorators, 'getListableObjectComponent').and.returnValue(PublicationListElementComponent);
    fixture.detectChanges();

  }));

  describe('When the component is rendered', () => {
    it('should call the getListableObjectComponent function with the right types, view mode and context', () => {
      expect(listableObjectDecorators.getListableObjectComponent).toHaveBeenCalledWith([testType], testViewMode, testContext);
    })
  });
});
