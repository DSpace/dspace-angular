import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Item } from '@dspace/core/shared/item.model';
import { RouterMock } from '@dspace/core/testing/router.mock';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ThemedConfigurationSearchPageComponent } from '../../../../search-page/themed-configuration-search-page.component';
import { AuthorityRelatedEntitiesSearchComponent } from './authority-related-entities-search.component';


describe('AuthorityRelatedEntitiesSearchComponent', () => {
  let component: AuthorityRelatedEntitiesSearchComponent;
  let fixture: ComponentFixture<AuthorityRelatedEntitiesSearchComponent>;

  const mockItem = {
    id: 'test-id-123',
  } as Item;
  const router = new RouterMock();


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), AuthorityRelatedEntitiesSearchComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ tab: 'relations-configuration' }),
            snapshot: {
              queryParams: {
                scope: 'collection-uuid',
                query: 'test',
              },
            },
          },
        },
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AuthorityRelatedEntitiesSearchComponent, {
        remove: {
          imports: [
            ThemedConfigurationSearchPageComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityRelatedEntitiesSearchComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    component.configurations = ['relations-configuration'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set searchFilter on init', () => {
    component.item = mockItem;
    component.ngOnInit();

    expect(component.searchFilter).toBe('scope=test-id-123');
  });

  it('should render configuration search page when configuration is provided', () => {
    component.item = mockItem;
    component.configurations = ['test-config'];

    fixture.detectChanges();

    const searchPage = fixture.nativeElement.querySelector('ds-configuration-search-page');
    expect(searchPage).toBeTruthy();
  });

  it('should NOT render configuration search page when configuration is missing', () => {
    component.item = mockItem;
    component.configurations = [];

    fixture.detectChanges();

    const searchPage = fixture.nativeElement.querySelector('ds-configuration-search-page');
    expect(searchPage).toBeFalsy();
  });

});
