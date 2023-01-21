import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResultsBackButtonComponent } from './results-back-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteService } from '../../core/services/route.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../testing/pagination-service.stub';

describe('ResultsBackButtonComponent', () => {

  let component: ResultsBackButtonComponent;
  let fixture: ComponentFixture<ResultsBackButtonComponent>;
  let router;
  const paginationConfig = Object.assign(new PaginationComponentOptions(), {
    id: 'test-pagination',
    currentPage: 1,
    pageSizeOptions: [5, 10, 15, 20],
    pageSize: 15
  });

  const searchUrl = '/search?query=test&spc.page=2';
  const nonSearchUrl = '/item';

  function getMockRouteService(url) {
    return {
      getPreviousUrl(): Observable < string > {
        return of(url);
      }
    };
  }

  router = jasmine.createSpyObj('router', {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  });

  const translate = jasmine.createSpyObj('TranslateService', ['get']);

  const paginationService = new PaginationServiceStub();

  describe('back to results', () => {

    const mockRouteService = getMockRouteService(searchUrl);

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ResultsBackButtonComponent],
        imports: [TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          { provide: RouteService, useValue: mockRouteService },
          { provide: PaginationService, useValue: paginationService},
          { provide: Router, useValue: router },
          { provide: TranslateService, useValue: translate }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
      spyOn(mockRouteService, 'getPreviousUrl').and.callThrough();
    }));

    describe('from a metadata browse list', () => {

      beforeEach(waitForAsync(() => {
        fixture = TestBed.createComponent(ResultsBackButtonComponent);
        component = fixture.componentInstance;
        component.paginationConfig = paginationConfig;
        component.previousPage$ = new BehaviorSubject<string>('1');
        fixture.detectChanges();
      }));

      it('should have back from browse label', () => {
        expect(translate.get).toHaveBeenCalledWith('browse.back.all-results');
      });



    });

    describe('from an item', () => {

      beforeEach(waitForAsync(() => {
        fixture = TestBed.createComponent(ResultsBackButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));

      it('should have item label', () => {
        expect(translate.get).toHaveBeenCalledWith('search.browse.item-back');
      });

      it('should navigate to previous url', () => {
        component.back();
        expect(mockRouteService.getPreviousUrl).toHaveBeenCalled();
        expect(router.navigateByUrl).toHaveBeenCalledWith(searchUrl);
      });
    });

  });

});

