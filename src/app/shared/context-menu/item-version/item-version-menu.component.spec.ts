import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { AuthService } from '../../../core/auth/auth.service';
import { EPersonMock } from '../../testing/eperson.mock';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ItemVersionMenuComponent } from './item-version-menu.component';
import { SharedModule } from '../../shared.module';

describe('ItemVersionMenuComponent', () => {
  let component: ItemVersionMenuComponent;
  let fixture: ComponentFixture<ItemVersionMenuComponent>;
  let de: DebugElement;
  let dso: DSpaceObject;

  let authServiceStub: any;
  let authorizationServiceStub: any;

  const ngbModal = jasmine.createSpyObj('modal', {
    open: jasmine.createSpy('open')
  });

  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    authServiceStub = jasmine.createSpyObj('authorizationService', {
      getAuthenticatedUserFromStore: jasmine.createSpy('getAuthenticatedUserFromStore'),
      isAuthenticated: jasmine.createSpy('isAuthenticated')
    });

    authorizationServiceStub = jasmine.createSpyObj('authorizationService', {
      isAuthorized: jasmine.createSpy('isAuthorized')
    });

    TestBed.configureTestingModule({
      declarations: [ItemVersionMenuComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]),
        SharedModule],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: NgbModal, useValue: ngbModal },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: AuthorizationDataService, useValue: authorizationServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionMenuComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.contextMenuObject = dso;
  });

  describe('when the user is authorized', () => {
    beforeEach(() => {
      authServiceStub.getAuthenticatedUserFromStore.and.returnValue(observableOf(EPersonMock));
      (authServiceStub.isAuthenticated as jasmine.Spy).and.returnValue(observableOf(true));
      authorizationServiceStub.isAuthorized.and.returnValue(observableOf(true));
      fixture.detectChanges();
    });

    it('should check the authorization of the current user', fakeAsync(() => {
      flush();
      expect(authorizationServiceStub.isAuthorized).toHaveBeenCalled();
    }));

    it('should render a button', () => {
      const button = fixture.debugElement.query(By.css('ds-item-version-container'));
      expect(button).not.toBeNull();
    });

  });

  describe('when the user is not authorized', () => {
    beforeEach(() => {
      (authServiceStub.isAuthenticated as jasmine.Spy).and.returnValue(observableOf(false));
      authorizationServiceStub.isAuthorized.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should not render a button', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('ds-item-version-container'));
      flush();
      expect(button).toBeNull();
    }));
  });
});
