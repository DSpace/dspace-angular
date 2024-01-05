import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulatableObjectsLoaderComponent } from './tabulatable-objects-loader.component';
import { ThemeService } from "../../../theme-support/theme.service";
import { provideMockStore } from "@ngrx/store/testing";
import { ListableObject } from "../listable-object.model";
import { PaginatedList } from "../../../../core/data/paginated-list.model";
import { Context } from "../../../../core/shared/context.model";
import { GenericConstructor } from "../../../../core/shared/generic-constructor";
import { TabulatableObjectsDirective } from "./tabulatable-objects.directive";
import { ListableObjectComponentLoaderComponent } from "../listable-object/listable-object-component-loader.component";
import { ChangeDetectionStrategy } from "@angular/core";
import {
  ItemListElementComponent
} from "../../../object-list/item-list-element/item-types/item/item-list-element.component";
import {
  TabulatableResultListElementsComponent
} from "../../../object-list/search-result-list-element/tabulatable-search-result/tabulatable-result-list-elements.component";

const testType = 'TestType';
class TestType extends ListableObject {
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [testType];
  }
}

class TestTypes extends PaginatedList<ListableObject> {
  page: TestType[] = [new TestType()]
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
