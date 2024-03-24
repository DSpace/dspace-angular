import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthRequestService } from 'src/app/core/auth/auth-request.service';
import { CookieService } from 'src/app/core/services/cookie.service';
import { HardRedirectService } from 'src/app/core/services/hard-redirect.service';
import { CookieServiceMock } from 'src/app/shared/mocks/cookie.service.mock';
import { getMockThemeService } from 'src/app/shared/mocks/theme-service.mock';
import { AuthRequestServiceStub } from 'src/app/shared/testing/auth-request-service.stub';

import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from '../../../../../config/app-config.interface';
import { Context } from '../../../../core/shared/context.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ListableModule } from '../../../../core/shared/listable.module';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { DynamicComponentLoaderDirective } from '../../../abstract-component-loader/dynamic-component-loader.directive';
import { ItemListElementComponent } from '../../../object-list/item-list-element/item-types/item/item-list-element.component';
import { ThemeService } from '../../../theme-support/theme.service';
import { ListableObject } from '../listable-object.model';
import { ListableObjectComponentLoaderComponent } from './listable-object-component-loader.component';

const testType = 'TestType';
const testContext = Context.Search;
const testViewMode = ViewMode.StandalonePage;

export class TestType extends ListableObject {
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [testType];
  }
  firstMetadataValue(): string {
    return '';
  }
  allMetadata() {
    return [];
  }
}

describe('ListableObjectComponentLoaderComponent', () => {
  let comp: ListableObjectComponentLoaderComponent;
  let fixture: ComponentFixture<ListableObjectComponentLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ListableObjectComponentLoaderComponent,
        ListableModule,
        ItemListElementComponent,
        DynamicComponentLoaderDirective,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: HardRedirectService, useValue: jasmine.createSpyObj('hardRedirectService', ['redirect']) },
        { provide: AuthRequestService, useValue: new AuthRequestServiceStub() },
        { provide: CookieService, useValue: new CookieServiceMock() },
        { provide: REQUEST, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: { data: of({ dso: { payload: {} } }), params: of({}) },
        },
        provideMockStore({}),
        { provide: ThemeService, useValue: getMockThemeService('dspace') },
        { provide: APP_CONFIG, useValue: { browseBy: { showThumbnails: true } } },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
      ],
    }).overrideComponent(ListableObjectComponentLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
      },
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
      expect(comp.getComponent).toHaveBeenCalled();
    });

    it('should connectInputsAndOutputs of loaded component', () => {
      expect((comp as any).connectInputsAndOutputs).toHaveBeenCalled();
    });
  });

  describe('When a reloadedObject is emitted', () => {
    let listableComponent;
    let reloadedObject: any;

    beforeEach(() => {
      spyOn(comp, 'instantiateComponent').and.returnValue(null);
      spyOn(comp.contentChange, 'emit').and.returnValue(null);

      listableComponent = fixture.debugElement.query(By.css('ds-item-list-element')).componentInstance;
      reloadedObject = 'object';
    });

    it('should re-instantiate the listable component', fakeAsync(() => {
      expect(comp.instantiateComponent).not.toHaveBeenCalled();

      listableComponent.reloadedObject.emit(reloadedObject);
      tick(200);

      expect(comp.instantiateComponent).toHaveBeenCalledWith();
    }));

    it('should re-emit it as a contentChange', fakeAsync(() => {
      expect(comp.contentChange.emit).not.toHaveBeenCalled();

      listableComponent.reloadedObject.emit(reloadedObject);
      tick(200);

      expect(comp.contentChange.emit).toHaveBeenCalledWith(reloadedObject);
    }));

  });

});
