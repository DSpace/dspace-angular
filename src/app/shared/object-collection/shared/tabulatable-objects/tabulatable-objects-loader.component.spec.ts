import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulatableObjectsLoaderComponent } from './tabulatable-objects-loader.component';
import { ThemeService } from "../../../theme-support/theme.service";
import { provideMockStore } from "@ngrx/store/testing";
import { ListableObject } from "../listable-object.model";
import { PaginatedList } from "../../../../core/data/paginated-list.model";
import { Context } from "../../../../core/shared/context.model";
import { GenericConstructor } from "../../../../core/shared/generic-constructor";

const testType = 'TestType';
class TestType extends ListableObject {
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [testType];
  }
}

class TestTypes extends PaginatedList<ListableObject> {
  page: TestType[]
}


describe('TabulatableObjectsLoaderComponent', () => {
  let component: TabulatableObjectsLoaderComponent;
  let fixture: ComponentFixture<TabulatableObjectsLoaderComponent>;

  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabulatableObjectsLoaderComponent ],
      providers: [
        provideMockStore({}),
        { provide: ThemeService, useValue: themeService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabulatableObjectsLoaderComponent);
    component = fixture.componentInstance;
    component.objects = new TestTypes();
    component.context = Context.Search;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
