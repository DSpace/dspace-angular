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
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { SearchService } from '../core/shared/search/search.service';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
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

  describe('when you click on search icon', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'expand').and.callThrough();
      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(router, 'navigate');
      const searchIcon = fixture.debugElement.query(By.css('form .submit-icon'));
      searchIcon.triggerEventHandler('click', {
        preventDefault: () => {/**/
        },
      });
      tick();
      fixture.detectChanges();
    }));

    it('input expands', () => {
      expect(component.expand).toHaveBeenCalled();
    });

    describe('empty query', () => {
      describe('press submit button', () => {
        beforeEach(fakeAsync(() => {
          const searchIcon = fixture.debugElement.query(By.css('form .submit-icon'));
          searchIcon.triggerEventHandler('click', {
            preventDefault: () => {/**/
            },
          });
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
      describe('press submit button', () => {
        beforeEach(fakeAsync(() => {
          const searchIcon = fixture.debugElement.query(By.css('form .submit-icon'));
          searchIcon.triggerEventHandler('click', null);
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
