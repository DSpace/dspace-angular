import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NavigationExtras,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { SearchService } from '../shared/search/search.service';
import { SearchNavbarComponent } from './search-navbar.component';

describe('SearchNavbarComponent', () => {
  let component: SearchNavbarComponent;
  let fixture: ComponentFixture<SearchNavbarComponent>;
  let mockSearchService: any;
  let router: Router;

  beforeEach(waitForAsync(() => {
    mockSearchService = {
      getSearchLink() {
        return '/search';
      },
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        SearchNavbarComponent,
      ],
      providers: [
        { provide: SearchService, useValue: mockSearchService },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when collapsed', () => {
    it('should render only the toggle <button> with no surrounding <form>', () => {
      const form = fixture.debugElement.query(By.css('form'));
      const toggle = fixture.debugElement.query(By.css('button.search-toggle'));
      expect(form).toBeNull();
      expect(toggle).not.toBeNull();
      expect(toggle.nativeElement.tagName).toBe('BUTTON');
      expect(toggle.nativeElement.getAttribute('type')).toBe('button');
    });
  });

  describe('when you click on the search toggle', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'expand').and.callThrough();
      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(router, 'navigate');
      const toggle = fixture.debugElement.query(By.css('button.search-toggle'));
      toggle.triggerEventHandler('click', {
        preventDefault: () => {/**/
        },
      });
      tick();
      fixture.detectChanges();
    }));

    it('input expands', () => {
      expect(component.expand).toHaveBeenCalled();
      expect(component.searchExpanded).toBeTrue();
    });

    it('renders the form with a real submit button', () => {
      const form = fixture.debugElement.query(By.css('form'));
      const submit = fixture.debugElement.query(By.css('form button.submit-icon'));
      expect(form).not.toBeNull();
      expect(submit).not.toBeNull();
      expect(submit.nativeElement.getAttribute('type')).toBe('submit');
    });

    describe('empty query', () => {
      describe('press submit button', () => {
        beforeEach(fakeAsync(() => {
          const form = fixture.debugElement.query(By.css('form'));
          form.triggerEventHandler('submit', null);
          tick();
          fixture.detectChanges();
        }));
        it('to search page with empty query', () => {
          const extras: NavigationExtras = { queryParams: { query: '' } };
          expect(component.onSubmit).toHaveBeenCalledWith({ query: '' });
          expect(router.navigate).toHaveBeenCalledWith(['search'], extras);
        });
      });
    });

    describe('fill in some query', () => {
      let searchInput;
      beforeEach(async () => {
        await fixture.whenStable();
        fixture.detectChanges();
        searchInput = fixture.debugElement.query(By.css('form input'));
        searchInput.nativeElement.value = 'test';
        searchInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
      });
      describe('press Enter on the input (native submit)', () => {
        beforeEach(fakeAsync(() => {
          const form = fixture.debugElement.query(By.css('form'));
          form.triggerEventHandler('submit', null);
          tick();
          fixture.detectChanges();
        }));
        it('to search page with query', async () => {
          const extras: NavigationExtras = { queryParams: { query: 'test' } };
          expect(component.onSubmit).toHaveBeenCalledWith({ query: 'test' });
          expect(router.navigate).toHaveBeenCalledWith(['search'], extras);
        });
      });
    });

  });
});
