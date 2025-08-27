import { ChangeDetectionStrategy } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';

import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { TabulatableResultListElementsComponent } from '../../../object-list/search-result-list-element/tabulatable-search-result/tabulatable-result-list-elements.component';
import { ThemeService } from '../../../theme-support/theme.service';
import { ListableObject } from '../listable-object.model';
import { TestType } from '../listable-object/listable-object-component-loader.component.spec';
import { TabulatableObjectsDirective } from './tabulatable-objects.directive';
import { TabulatableObjectsLoaderComponent } from './tabulatable-objects-loader.component';


const testType = 'TestType';
const testContext = Context.CoarNotify;
const testViewMode = ViewMode.Table;

class TestTypes extends PaginatedList<ListableObject> {
  page: TestType[] = [new TestType()];
}


describe('TabulatableObjectsLoaderComponent', () => {
  let component: TabulatableObjectsLoaderComponent;
  let fixture: ComponentFixture<TabulatableObjectsLoaderComponent>;

  let themeService: ThemeService;

  beforeEach(async () => {
    themeService = jasmine.createSpyObj('themeService', {
      getThemeName: 'dspace',
    });
    await TestBed.configureTestingModule({
      imports: [TabulatableObjectsLoaderComponent, TabulatableObjectsDirective],
      providers: [
        provideMockStore({}),
        { provide: ThemeService, useValue: themeService },
      ],
    }).overrideComponent(TabulatableObjectsLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
      },
    }).compileComponents();

    fixture = TestBed.createComponent(TabulatableObjectsLoaderComponent);
    component = fixture.componentInstance;
    component.objects = new TestTypes();
    component.context = Context.CoarNotify;
    spyOn(component, 'getComponent').and.returnValue(TabulatableResultListElementsComponent as any);
    spyOn(component as any, 'connectInputsAndOutputs').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When the component is rendered', () => {
    it('should call the getTabulatableObjectComponent function with the right types, view mode and context', () => {
      expect(component.getComponent).toHaveBeenCalledWith([testType], testViewMode, testContext);
    });

    it('should connectInputsAndOutputs of loaded component', () => {
      expect((component as any).connectInputsAndOutputs).toHaveBeenCalled();
    });
  });

  describe('When a reloadedObject is emitted', () => {
    let tabulatableComponent;
    let reloadedObject: any;

    beforeEach(() => {
      spyOn((component as any), 'instantiateComponent').and.returnValue(null);
      spyOn((component as any).contentChange, 'emit').and.returnValue(null);

      tabulatableComponent = fixture.debugElement.query(By.css('ds-search-result-table-element')).componentInstance;
      reloadedObject = 'object';
    });

    it('should re-instantiate the listable component', fakeAsync(() => {
      expect((component as any).instantiateComponent).not.toHaveBeenCalled();

      (tabulatableComponent as any).reloadedObject.emit(reloadedObject);
      tick(200);

      expect((component as any).instantiateComponent).toHaveBeenCalledWith(reloadedObject, undefined);
    }));

    it('should re-emit it as a contentChange', fakeAsync(() => {
      expect((component as any).contentChange.emit).not.toHaveBeenCalled();

      (tabulatableComponent as any).reloadedObject.emit(reloadedObject);
      tick(200);

      expect((component as any).contentChange.emit).toHaveBeenCalledWith(reloadedObject);
    }));

  });
});
