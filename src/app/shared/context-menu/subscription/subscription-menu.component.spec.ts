import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubscriptionMenuComponent } from './subscription-menu.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';

describe('SubscriptionMenuComponent', () => {
  let component: SubscriptionMenuComponent;
  let fixture: ComponentFixture<SubscriptionMenuComponent>;
  let de: DebugElement;
  let dso: DSpaceObject;

  let modalService;
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

    authorizationServiceStub = jasmine.createSpyObj('authorizationService', {
      isAuthorized: jasmine.createSpy('isAuthorized')
    });

    TestBed.configureTestingModule({
      declarations: [SubscriptionMenuComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: NgbModal, useValue: ngbModal },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: AuthorizationDataService, useValue: authorizationServiceStub}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionMenuComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.contextMenuObject = dso;
  });

  describe('when the user is authorized', () => {
    beforeEach(() => {
      authorizationServiceStub.isAuthorized.and.returnValue(observableOf(true));
      fixture.detectChanges();
    });

    it('should check the authorization of the current user', fakeAsync(() => {
      flush();
      expect(authorizationServiceStub.isAuthorized).toHaveBeenCalled();
    }));

    it('should render a button', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button).not.toBeNull();
    });

    it('when button is clicked open modal content', () => {
      modalService = (component as any).modalService;

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.click();

      expect(modalService.open).toHaveBeenCalled();

    });
  });

  describe('when the user is not authorized', () => {
    beforeEach(() => {
      authorizationServiceStub.isAuthorized.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should not render a button', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('button'));
      flush();
      expect(button).toBeNull();
    }));
  });
});
