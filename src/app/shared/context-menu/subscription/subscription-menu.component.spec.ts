import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionMenuComponent } from './subscription-menu.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { By } from '@angular/platform-browser';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AuthServiceMock } from '../../mocks/auth.service.mock';
import { AuthService } from '../../../core/auth/auth.service';
import { EPersonMock } from '../../testing/eperson.mock';
import { DebugElement } from '@angular/core';




describe('SubscriptionMenuComponent', () => {
  let component: SubscriptionMenuComponent;
  let fixture: ComponentFixture<SubscriptionMenuComponent>;
  let de: DebugElement;

  let authorizationService: AuthorizationDataService;
  let dso: DSpaceObject;

  let modalService;
  let authServiceStub: any;

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });

    authServiceStub  = jasmine.createSpyObj('authorizationService', {
      getAuthenticatedUserFromStore: observableOf(EPersonMock)
    });

    TestBed.configureTestingModule({
      declarations: [ SubscriptionMenuComponent ],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionMenuComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.contextMenuObject = dso;
    fixture.detectChanges();
  });

  xit('should check the authorization of the current user', () => {
    expect(authorizationService.isAuthorized).toHaveBeenCalledWith(FeatureID.CanEditMetadata, dso.self);
  });

  describe('when the user is authorized', () => {
    beforeEach(() => {
      (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(observableOf(true));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render a button', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button).not.toBeNull();
    });

    it('when button is clicked open modal content', () => {
      modalService = (component as any).modalService;
      const modalSpy = spyOn(modalService, 'open');

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.click();

      expect(modalService.open).toHaveBeenCalled();

    });
  });

  xdescribe('when the user is not authorized', () => {
    beforeEach(() => {
      (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(observableOf(false));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not render a button', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button).toBeNull();
    });
  });
});
