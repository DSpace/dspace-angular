import { waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { FormBuilder } from '@angular/forms';
import { FilteredCollectionsComponent } from './filtered-collections.component';
import { DspaceRestService } from 'src/app/core/dspace-rest/dspace-rest.service';
import { NgbAccordion, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of as observableOf } from 'rxjs';
import { RawRestResponse } from 'src/app/core/dspace-rest/raw-rest-response.model';

describe('FiltersComponent', () => {
  let component: FilteredCollectionsComponent;
  let fixture: ComponentFixture<FilteredCollectionsComponent>;
  let formBuilder: FormBuilder;

  const expected = {
    payload: {
      collections: [],
      summary: {
        label: 'Test'
      }
    },
    statusCode: 200,
    statusText: 'OK'
  } as RawRestResponse;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilteredCollectionsComponent],
      imports: [
        NgbAccordionModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        DspaceRestService
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
      spyOn(component, 'getFilteredCollections').and.returnValue(observableOf(expected));
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
