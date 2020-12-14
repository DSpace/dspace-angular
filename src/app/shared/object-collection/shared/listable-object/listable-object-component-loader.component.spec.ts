import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, ComponentFactoryResolver, NO_ERRORS_SCHEMA } from '@angular/core';
import { ListableObjectComponentLoaderComponent } from './listable-object-component-loader.component';
import { ListableObject } from '../listable-object.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import * as listableObjectDecorators from './listable-object.decorator';
import { ItemListElementComponent } from '../../../object-list/item-list-element/item-types/item/item-list-element.component';
import { ListableObjectDirective } from './listable-object.directive';
import { spyOnExported } from '../../../testing/utils.test';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { Item } from '../../../../core/shared/item.model';

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
      imports: [TranslateModule.forRoot()],
      declarations: [ListableObjectComponentLoaderComponent, ItemListElementComponent, ListableObjectDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ComponentFactoryResolver]
    }).overrideComponent(ListableObjectComponentLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        entryComponents: [ItemListElementComponent]
      }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListableObjectComponentLoaderComponent);
    comp = fixture.componentInstance;

    comp.object = new TestType();
    comp.viewMode = testViewMode;
    comp.context = testContext;
    spyOnExported(listableObjectDecorators, 'getListableObjectComponent').and.returnValue(ItemListElementComponent);
    fixture.detectChanges();

  }));

  describe('When the component is rendered', () => {
    it('should call the getListableObjectComponent function with the right types, view mode and context', () => {
      expect(listableObjectDecorators.getListableObjectComponent).toHaveBeenCalledWith([testType], testViewMode, testContext);
    })
  });

  describe('when the object is an item and viewMode is a list', () => {
    beforeEach(() => {
      comp.object = Object.assign(new Item());
      comp.viewMode = ViewMode.ListElement;
    });

    describe('when the item is not withdrawn', () => {
      beforeEach(() => {
        (comp.object as any).isWithdrawn = false;
        comp.initBadges();
        fixture.detectChanges();
      });

      it('should not show the withdrawn badge', () => {
        const badge = fixture.debugElement.query(By.css('div.withdrawn-badge'));
        expect(badge).toBeNull();
      });
    });

    describe('when the item is withdrawn', () => {
      beforeEach(() => {
        (comp.object as any).isWithdrawn = true;
        comp.initBadges();
        fixture.detectChanges();
      });

      it('should show the withdrawn badge', () => {
        const badge = fixture.debugElement.query(By.css('div.withdrawn-badge'));
        expect(badge).not.toBeNull();
      });
    });

    describe('when the item is not private', () => {
      beforeEach(() => {
        (comp.object as any).isDiscoverable = true;
        comp.initBadges();
        fixture.detectChanges();
      });
      it('should not show the private badge', () => {
        const badge = fixture.debugElement.query(By.css('div.private-badge'));
        expect(badge).toBeNull();
      });
    });

    describe('when the item is private', () => {
      beforeEach(() => {
        (comp.object as any).isDiscoverable = false;
        comp.initBadges();
        fixture.detectChanges();
      });

      it('should show the private badge', () => {
        const badge = fixture.debugElement.query(By.css('div.private-badge'));
        expect(badge).not.toBeNull();
      });
    });
  });

});
