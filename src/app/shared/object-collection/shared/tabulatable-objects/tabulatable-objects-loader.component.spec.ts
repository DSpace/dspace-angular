import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulatableObjectsLoaderComponent } from './tabulatable-objects-loader.component';
import { ThemeService } from '../../../theme-support/theme.service';
import { provideMockStore } from '@ngrx/store/testing';
import { ListableObject } from '../listable-object.model';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { Context } from '../../../../core/shared/context.model';
import { TabulatableObjectsDirective } from './tabulatable-objects.directive';
import { ChangeDetectionStrategy } from '@angular/core';


import {
  TabulatableResultListElementsComponent
} from '../../../object-list/search-result-list-element/tabulatable-search-result/tabulatable-result-list-elements.component';
import { TestType } from '../listable-object/listable-object-component-loader.component.spec';

const testType = 'TestType';

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
      declarations: [ TabulatableObjectsLoaderComponent, TabulatableObjectsDirective ],
      providers: [
        provideMockStore({}),
        { provide: ThemeService, useValue: themeService },
      ]
    }).overrideComponent(TabulatableObjectsLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        entryComponents: [TabulatableResultListElementsComponent]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(TabulatableObjectsLoaderComponent);
    component = fixture.componentInstance;
    component.objects = new TestTypes();
    component.context = Context.Search;
    spyOn(component, 'getComponent').and.returnValue(TabulatableResultListElementsComponent as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
