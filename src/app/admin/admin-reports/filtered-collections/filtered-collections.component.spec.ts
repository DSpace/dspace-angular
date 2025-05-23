import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
  NgbAccordion,
  NgbAccordionModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { DspaceRestService } from 'src/app/core/dspace-rest/dspace-rest.service';
import { RawRestResponse } from 'src/app/core/dspace-rest/raw-rest-response.model';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';

import { FilteredCollectionsComponent } from './filtered-collections.component';

describe('FiltersComponent', () => {
  let component: FilteredCollectionsComponent;
  let fixture: ComponentFixture<FilteredCollectionsComponent>;
  let formBuilder: FormBuilder;

  const expected = {
    payload: {
      collections: [],
      summary: {
        label: 'Test',
      },
    },
    statusCode: 200,
    statusText: 'OK',
  } as RawRestResponse;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [NgbAccordionModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        FilteredCollectionsComponent],
      providers: [
        FormBuilder,
        DspaceRestService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  }));

  beforeEach(waitForAsync(() => {
    formBuilder = TestBed.inject(FormBuilder);

    fixture = TestBed.createComponent(FilteredCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should be displaying the filters panel initially', () => {
    let accordion: NgbAccordion = component.accordionComponent;
    expect(accordion.isExpanded('filters')).toBeTrue();
  });

  describe('toggle', () => {
    beforeEach(() => {
      spyOn(component, 'getFilteredCollections').and.returnValue(of(expected));
      spyOn(component.results, 'deserialize');
      spyOn(component.accordionComponent, 'expand').and.callThrough();
      component.submit();
      fixture.detectChanges();
    });

    it('should be displaying the collections panel after submitting', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect(component.accordionComponent.expand).toHaveBeenCalledWith('collections');
        expect(component.accordionComponent.isExpanded('collections')).toBeTrue();
      });
    }));
  });
});
