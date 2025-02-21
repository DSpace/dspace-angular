import { ChangeDetectionStrategy } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../../environments/environment.test';
import { AuthService } from '../../../../../../modules/core/src/lib/core/auth/auth.service';
import { DSONameService } from '../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { APP_CONFIG } from '../../../../../../modules/core/src/lib/core/config/app-config.interface';
import { AuthorizationDataService } from '../../../../../../modules/core/src/lib/core/data/feature-authorization/authorization-data.service';
import { ListableObject } from '../../../../../../modules/core/src/lib/core/object-collection/listable-object.model';
import { Context } from '../../../../../../modules/core/src/lib/core/shared/context.model';
import { FileService } from '../../../../../../modules/core/src/lib/core/shared/file.service';
import { GenericConstructor } from '../../../../../../modules/core/src/lib/core/shared/generic-constructor';
import { ViewMode } from '../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { ActivatedRouteStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/active-router.stub';
import { AuthServiceStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/auth-service.stub';
import { AuthorizationDataServiceStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/authorization-service.stub';
import { FileServiceStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/file-service.stub';
import { TruncatableServiceStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/truncatable-service.stub';
import { XSRFService } from '../../../../../../modules/core/src/lib/core/xsrf/xsrf.service';
import { DynamicComponentLoaderDirective } from '../../../abstract-component-loader/dynamic-component-loader.directive';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
import { getMockThemeService } from '../../../mocks/theme-service.mock';
import { ListableModule } from '../../../modules/listable.module';
import { ItemListElementComponent } from '../../../object-list/item-list-element/item-types/item/item-list-element.component';
import { SearchResultListElementComponent } from '../../../object-list/search-result-list-element/search-result-list-element.component';
import { ThemeService } from '../../../theme-support/theme.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
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

  let activatedRoute: ActivatedRouteStub;
  let authService: AuthServiceStub;
  let authorizationService: AuthorizationDataServiceStub;
  let fileService: FileServiceStub;
  let themeService: ThemeService;
  let truncatableService: TruncatableServiceStub;

  beforeEach(waitForAsync(() => {
    activatedRoute = new ActivatedRouteStub();
    authService = new AuthServiceStub();
    authorizationService = new AuthorizationDataServiceStub();
    fileService = new FileServiceStub();
    themeService = getMockThemeService();
    truncatableService = new TruncatableServiceStub();

    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ListableObjectComponentLoaderComponent,
        ListableModule,
        ItemListElementComponent,
        DynamicComponentLoaderDirective,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: FileService, useValue: fileService },
        { provide: ThemeService, useValue: themeService },
        { provide: TruncatableService, useValue: truncatableService },
        { provide: XSRFService, useValue: {} },
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
    spyOn(comp, 'getComponent').and.returnValue(SearchResultListElementComponent as any);
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

      listableComponent = fixture.debugElement.query(By.css('ds-search-result-list-element')).componentInstance;
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
