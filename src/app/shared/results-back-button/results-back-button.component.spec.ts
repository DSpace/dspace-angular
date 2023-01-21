import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResultsBackButtonComponent } from './results-back-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginationServiceStub } from '../testing/pagination-service.stub';

describe('ResultsBackButtonComponent', () => {

  let component: ResultsBackButtonComponent;
  let fixture: ComponentFixture<ResultsBackButtonComponent>;
  let router;


  router = jasmine.createSpyObj('router', {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  });

  const translate = jasmine.createSpyObj('TranslateService', ['get']);

  const paginationService = new PaginationServiceStub();

  describe('back to results', () => {


    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ResultsBackButtonComponent],
        imports: [TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          { provide: TranslateService, useValue: translate }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    }));

    describe('from a metadata browse list', () => {

      beforeEach(waitForAsync(() => {
        fixture = TestBed.createComponent(ResultsBackButtonComponent);
        component = fixture.componentInstance;
        component.buttonType = 'metadata-browse';
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

    });

  });

});

