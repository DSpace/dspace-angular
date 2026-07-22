import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import { DynamicLayoutBox } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  EPersonMock,
  EPersonMock2,
} from '@dspace/core/testing/eperson.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import MetadataValue from '../../../../../core/shared/metadata.models';
import { ThemedConfigurationSearchPageComponent } from '../../../../../search-page/themed-configuration-search-page.component';
import { DynamicLayoutRelationBoxComponent } from './dynamic-layout-relation-box.component';

describe('DynamicLayoutRelationBoxComponent', () => {
  let component: DynamicLayoutRelationBoxComponent;
  let fixture: ComponentFixture<DynamicLayoutRelationBoxComponent>;

  const testItem = Object.assign(new Item(), {
    id: '1234-65487-12354-1235',
    bundles: of({}),
    metadata: {},
  });

  const testBox = Object.assign(new DynamicLayoutBox(), {
    id: '1',
    collapsed: false,
    header: 'DynamicLayoutBox Header',
    shortname: 'test-box',
    configuration: { 'discovery-configuration': 'box-configuration-id' },
  });

  const relationPublicationsBox = Object.assign(new DynamicLayoutBox(), {
    id: '2',
    collapsed: false,
    header: 'Publications',
    shortname: 'publications',
    configuration: { 'discovery-configuration': 'RELATION.Person.researchoutputs' },
  });

  const personItem = Object.assign(new Item(), {
    id: '1234-65487-12354-1235',
    bundles: of({}),
    metadata: {
      'dspace.entity.type': [{ value: 'Person' }] as MetadataValue[],
      'dspace.object.owner': [{ value: 'not Owner', authority:  EPersonMock2.id }] as MetadataValue[],
    },
  });

  const ownerItem = Object.assign(new Item(), {
    id: '1234-65487-12354-1235',
    bundles: of({}),
    metadata: {
      'dspace.entity.type': [{ value: 'Person' }] as MetadataValue[],
      'dspace.object.owner': [{ value: 'Owner', authority: EPersonMock.id }] as MetadataValue[],
    },
  });

  const authService = jasmine.createSpyObj('authService', {
    getAuthenticatedUserFromStore: of(null),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        CommonModule,
        DynamicLayoutRelationBoxComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: 'boxProvider', useValue: testBox },
        { provide: 'itemProvider', useValue: testItem },
        { provide: AuthService, useValue: authService },
      ],
    })
      .overrideComponent(DynamicLayoutRelationBoxComponent, { remove: { imports: [ThemedConfigurationSearchPageComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutRelationBoxComponent);
    component = fixture.componentInstance;
  });

  describe('When item is not a Person', () => {
    beforeEach(() => {
      component.box = testBox;
      component.item = testItem;
      fixture.detectChanges();
    });

    it('should create DynamicLayoutRelationBoxComponent', () => {
      expect(component).toBeDefined();
    });

    it('should have set scope in searchFilter', () => {
      expect(component.searchFilter).toContain('scope=' + testItem.id);
    });

    it('info message cannot be shown', fakeAsync(() => {
      expect(component.showSearchResultNotice$).toBeObservable(cold('a', { a: false }));
    }));

    it('info message has no value', fakeAsync(() => {
      expect(component.searchResultNotice).toBeUndefined();
    }));
  });

  describe('When item is a Person', () => {

    describe('When relation-box of researchoutputs is shown', () => {
      beforeEach(() => {
        component.box = relationPublicationsBox;
      });

      describe('Whenever the personItem is the researcher profile of the logged user', () => {
        beforeEach(() => {
          (authService.getAuthenticatedUserFromStore as jasmine.Spy).and.returnValue(of({ id: EPersonMock.id } as EPerson));
          component.item = ownerItem;
          fixture.detectChanges();
        });
        it('info message can be shown', fakeAsync(() => {
          expect(component.showSearchResultNotice$).toBeObservable(cold('a', { a: true }));
        }));
        it('info message has value', fakeAsync(() => {
          expect(component.searchResultNotice).not.toBeUndefined();
        }));
      });

      describe('Whenever the personItem is not the researcher profile of the logged user', () => {
        beforeEach(() => {
          (authService.getAuthenticatedUserFromStore as jasmine.Spy).and.returnValue(of({ id: 'fake-uuid' } as EPerson));
          component.item = personItem;
          fixture.detectChanges();
        });
        it('info message cannot be shown', fakeAsync(() => {
          expect(component.showSearchResultNotice$).toBeObservable(cold('a', { a: false }));
        }));
        it('info message has no value', fakeAsync(() => {
          expect(component.searchResultNotice).not.toBeUndefined();
        }));
      });

      describe('no one is logged', () => {
        beforeEach(() => {
          (authService.getAuthenticatedUserFromStore as jasmine.Spy).and.returnValue(of(null as EPerson));
          fixture.detectChanges();
        });
        it('info message has no value', fakeAsync(() => {
          // component.showSearchResultNotice$.subscribe(value => expect(value).toBeUndefined());
          expect(component.showSearchResultNotice$).toBeObservable(cold('a', { a: false }));
        }));
        it('info message has no value', fakeAsync(() => {
          expect(component.searchResultNotice).toBeUndefined();
        }));
      });

    });
  });

});
