import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ListableObjectComponentLoaderComponent } from './listable-object-component-loader.component';
import { ListableObject } from '../listable-object.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { ListableObjectDirective } from './listable-object.directive';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { ThemeService } from '../../../theme-support/theme.service';
import { ItemSearchResultListElementComponent } from '../../../object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';
import { AuthServiceStub } from '../../../testing/auth-service.stub';
import { AuthorizationDataServiceStub } from '../../../testing/authorization-service.stub';
import { FileServiceStub } from '../../../testing/file-service.stub';
import { TruncatableServiceStub } from '../../../testing/truncatable-service.stub';
import { getMockThemeService } from '../../../mocks/theme-service.mock';
import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment.test';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
import { FileService } from '../../../../core/shared/file.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { SearchResultListElementComponent } from '../../../object-list/search-result-list-element/search-result-list-element.component';
import { XSRFService } from 'src/app/core/xsrf/xsrf.service';

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
      imports: [TranslateModule.forRoot()],
      declarations: [
        ItemSearchResultListElementComponent,
        ListableObjectComponentLoaderComponent,
        ListableObjectDirective,
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
      ]
    }).overrideComponent(ListableObjectComponentLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
      }
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

      listableComponent = fixture.debugElement.query(By.css('ds-search-result-list-element')).componentInstance;
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
