import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ListableObjectComponentLoaderComponent } from './listable-object-component-loader.component';
import { ListableObject } from '../listable-object.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import {
  ItemListElementComponent
} from '../../../object-list/item-list-element/item-types/item/item-list-element.component';
import { ListableObjectDirective } from './listable-object.directive';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { ThemeService } from '../../../theme-support/theme.service';

const testType = 'TestType';
const testContext = Context.Search;
const testViewMode = ViewMode.StandalonePage;

class TestType extends ListableObject {
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [testType];
  }
}

describe('ListableObjectComponentLoaderComponent', () => {
  let comp: ListableObjectComponentLoaderComponent;
  let fixture: ComponentFixture<ListableObjectComponentLoaderComponent>;

  let themeService: ThemeService;

  beforeEach(waitForAsync(() => {
    themeService = jasmine.createSpyObj('themeService', {
      getThemeName: 'dspace',
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ListableObjectComponentLoaderComponent, ItemListElementComponent, ListableObjectDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({}),
        { provide: ThemeService, useValue: themeService },
      ]
    }).overrideComponent(ListableObjectComponentLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        entryComponents: [ItemListElementComponent]
      }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ListableObjectComponentLoaderComponent);
    comp = fixture.componentInstance;

    comp.object = new TestType();
    comp.viewMode = testViewMode;
    comp.context = testContext;
    spyOn(comp, 'getComponent').and.returnValue(ItemListElementComponent as any);
    spyOn(comp as any, 'connectInputsAndOutputs').and.callThrough();
    fixture.detectChanges();

  }));

  describe('When the component is rendered', () => {
    it('should call the getListableObjectComponent function with the right types, view mode and context', () => {
      expect(comp.getComponent).toHaveBeenCalledWith([testType], testViewMode, testContext);
    });

    it('should connectInputsAndOutputs of loaded component', () => {
      expect((comp as any).connectInputsAndOutputs).toHaveBeenCalled();
    });
  });

  describe('When a reloadedObject is emitted', () => {
    let listableComponent;
    let reloadedObject: any;

    beforeEach(() => {
      spyOn((comp as any), 'instantiateComponent').and.returnValue(null);
      spyOn((comp as any).contentChange, 'emit').and.returnValue(null);

      listableComponent = fixture.debugElement.query(By.css('ds-item-list-element')).componentInstance;
      reloadedObject = 'object';
    });

    it('should re-instantiate the listable component', fakeAsync(() => {
      expect((comp as any).instantiateComponent).not.toHaveBeenCalled();

      (listableComponent as any).reloadedObject.emit(reloadedObject);
      tick(200);

      expect((comp as any).instantiateComponent).toHaveBeenCalledWith(reloadedObject, undefined);
    }));

    it('should re-emit it as a contentChange', fakeAsync(() => {
      expect((comp as any).contentChange.emit).not.toHaveBeenCalled();

      (listableComponent as any).reloadedObject.emit(reloadedObject);
      tick(200);

      expect((comp as any).contentChange.emit).toHaveBeenCalledWith(reloadedObject);
    }));

  });

});
