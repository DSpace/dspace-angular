import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrisLayoutRelationBoxComponent } from './cris-layout-relation-box.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { Item } from '../../../../../core/shared/item.model';
import { of as observableOf, of } from 'rxjs';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { Person } from '@angular/cli/utilities/package-json';
import { AuthService } from '../../../../../core/auth/auth.service';

describe('CrisLayoutRelationBoxComponent', () => {
  let component: CrisLayoutRelationBoxComponent;
  let fixture: ComponentFixture<CrisLayoutRelationBoxComponent>;

  const testItem = Object.assign(new Item(), {
    id: '1234-65487-12354-1235',
    bundles: of({}),
    metadata: {}
  });

  const testBox = Object.assign(new CrisLayoutBox(), {
    id: '1',
    collapsed: false,
    header: 'CrisLayoutBox Header',
    shortname: 'test-box',
    configuration: of({ configuration: 'box-configuration-id' })
  });

  const relationPublicationsBox = Object.assign(new CrisLayoutBox(), {
    id: '2',
    collapsed: false,
    header: 'Publications',
    shortname: 'publications',
    configuration: { configuration: 'RELATION.Person.researchoutputs' }
  });

  const personItem = Object.assign(new Item(), {
    id: '1234-65487-12354-1235',
    bundles: of({}),
    metadata: {
      'dspace.entity.type': [{ value: 'Person' }] as MetadataValue[],
      'dspace.object.owner': [{ value: 'Owner', authority: null }] as MetadataValue[],
    }
  });

  const authService = jasmine.createSpyObj('authService', {
    getAuthenticatedUserFromStore: observableOf(null)
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        CommonModule,
        SharedModule
      ],
      declarations: [ CrisLayoutRelationBoxComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: 'boxProvider', useValue: testBox },
        { provide: 'itemProvider', useValue: testItem },
        { provide: AuthService, useValue: authService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutRelationBoxComponent);
    component = fixture.componentInstance;
    component.box = testBox;
    component.item = testItem;
    fixture.detectChanges();
  });

  it('should create CrisLayoutRelationBoxComponent', () => {
    expect(component).toBeDefined();
  });

  it('should have set scope in searchFilter', () => {
    expect(component.searchFilter).toContain('scope=' + testItem.id);
  });

  describe('When a test box is shown', () => {
    beforeEach(() => {
      (authService.getAuthenticatedUserFromStore as jasmine.Spy).and.returnValue(observableOf({ id: personItem.id } as Person));
      fixture.detectChanges();
    });
    it('info message cannot be shown', waitForAsync(() => {
      component.showSearchResultNotice$.subscribe(value => expect(value).toBeFalse());
    }));
    it('info message has no value', waitForAsync(() => {
      component.searchResultNotice$.subscribe(value => expect(value).toBeUndefined());
    }));
  });

  describe('When relation-box of researchoutputs is shown', () => {
    beforeEach(() => {
      component.box = relationPublicationsBox;
      component.item = personItem;
      fixture.detectChanges();
    });

    describe('Whenever the personItem is the researcher profile of the logged user', () => {
      beforeEach(() => {
        (authService.getAuthenticatedUserFromStore as jasmine.Spy).and.returnValue(observableOf({ id: personItem.id } as Person));
        fixture.detectChanges();
      });
      it('info message can be shown', waitForAsync(() => {
        component.showSearchResultNotice$.subscribe(value => expect(value).toBeTrue());
      }));
      it('info message has value', waitForAsync(() => {
        component.searchResultNotice$.subscribe(value => expect(value).not.toBeFalsy());
      }));
    });

    describe('Whenever the personItem is not the researcher profile of the logged user', () => {
      beforeEach(() => {
        (authService.getAuthenticatedUserFromStore as jasmine.Spy).and.returnValue(observableOf({ id: 'fake-uuid' } as Person));
        fixture.detectChanges();
      });
      it('info message cannot be shown', waitForAsync(() => {
        component.showSearchResultNotice$.subscribe(value => expect(value).toBeFalse());
      }));
      it('info message has no value', waitForAsync(() => {
        component.searchResultNotice$.subscribe(value => expect(value).toBeUndefined());
      }));
    });

    describe('no one is logged', () => {
      beforeEach(() => {
        (authService.getAuthenticatedUserFromStore as jasmine.Spy).and.returnValue(observableOf(null as Person));
        fixture.detectChanges();
      });
      it('info message has no value', waitForAsync(() => {
        component.showSearchResultNotice$.subscribe(value => expect(value).toBeUndefined());
      }));
      it('info message has no value', waitForAsync(() => {
        component.searchResultNotice$.subscribe(value => expect(value).toBeUndefined());
      }));
    });

  });

});
