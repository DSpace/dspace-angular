import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { of as observableOf } from 'rxjs';
import { getTestScheduler } from 'jasmine-marbles';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { BulkImportMenuComponent } from './bulk-import-menu.component';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Collection } from '../../../core/shared/collection.model';

describe('BulkImportMenuComponent', () => {
  let component: BulkImportMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<BulkImportMenuComponent>;
  let scheduler: TestScheduler;

  let dso: DSpaceObject;
  let authorizationService: any;

  beforeEach(async(() => {
    dso = Object.assign(new Collection(), {
      id: 'test-collection',
      _links: {
        self: { href: 'test-collection-selflink' }
      }
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: jasmine.createSpy('isAuthorized')
    });

    TestBed.configureTestingModule({
      declarations: [ BulkImportMenuComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.COLLECTION },
        { provide: AuthorizationDataService, useValue: authorizationService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(BulkImportMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
  });

  it('should create', () => {
    expect(component).toBeTruthy()
  });

  describe('when the user is collection admin', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(true));
      fixture.detectChanges();
    });

    it('should render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).not.toBeNull();
    });

  });

  describe('when the user is not collection admin', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should not render a link', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });
  });

});
