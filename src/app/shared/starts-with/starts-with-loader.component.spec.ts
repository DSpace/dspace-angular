import { StartsWithLoaderComponent } from './starts-with-loader.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicComponentLoaderDirective } from '../abstract-component-loader/dynamic-component-loader.directive';
import { TranslateModule } from '@ngx-translate/core';
import { StartsWithTextComponent } from './text/starts-with-text.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterStub } from '../testing/router.stub';
import { ThemeService } from '../theme-support/theme.service';
import { getMockThemeService } from '../mocks/theme-service.mock';
import { StartsWithType } from './starts-with-decorator';
import { ActivatedRouteStub } from '../testing/active-router.stub';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../testing/pagination-service.stub';

describe('StartsWithLoaderComponent', () => {
  let comp: StartsWithLoaderComponent;
  let fixture: ComponentFixture<StartsWithLoaderComponent>;

  let paginationService: PaginationServiceStub;
  let route: ActivatedRouteStub;
  let themeService: ThemeService;

  const type: StartsWithType = StartsWithType.text;

  beforeEach(waitForAsync(() => {
    paginationService = new PaginationServiceStub();
    route = new ActivatedRouteStub();
    themeService = getMockThemeService('dspace');

    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        StartsWithLoaderComponent,
        StartsWithTextComponent,
        DynamicComponentLoaderDirective,
      ],
      providers: [
        { provide: PaginationService, useValue: paginationService },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: new RouterStub() },
        { provide: ThemeService, useValue: themeService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(StartsWithLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        entryComponents: [StartsWithTextComponent],
      }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(StartsWithLoaderComponent);
    comp = fixture.componentInstance;
    comp.type = type;
    comp.paginationId = 'bbm';
    comp.startsWithOptions = [];
    spyOn(comp, 'getComponent').and.returnValue(StartsWithTextComponent);

    fixture.detectChanges();
  }));

  describe('When the component is rendered', () => {
    it('should call the getComponent function', () => {
      expect(comp.getComponent).toHaveBeenCalled();
    });
  });
});
