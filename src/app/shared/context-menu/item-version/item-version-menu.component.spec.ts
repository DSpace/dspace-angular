import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ItemVersionMenuComponent } from './item-version-menu.component';
import { SharedModule } from '../../shared.module';
import { DsoVersioningModalService } from '../../dso-page/dso-versioning-modal-service/dso-versioning-modal.service';

describe('ItemVersionMenuComponent', () => {
  let component: ItemVersionMenuComponent;
  let fixture: ComponentFixture<ItemVersionMenuComponent>;
  let de: DebugElement;
  let dso: DSpaceObject;
  let authorizationServiceStub: any;

  const ngbModal = jasmine.createSpyObj('modal', {
    open: jasmine.createSpy('open')
  });

  const versioningModalService = jasmine.createSpyObj('DsoVersioningModalService', {
    isNewVersionButtonDisabled: jasmine.createSpy('isNewVersionButtonDisabled'),
    openCreateVersionModal: jasmine.createSpy('openCreateVersionModal')
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
      declarations: [ItemVersionMenuComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]),
        SharedModule],
      providers: [
        { provide: NgbModal, useValue: ngbModal },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
        { provide: DsoVersioningModalService, useValue: versioningModalService }
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
      authorizationServiceStub.isAuthorized.and.returnValue(observableOf(true));

    });

    describe('and the button should not be disabled', () => {
      beforeEach(() => {
        versioningModalService.isNewVersionButtonDisabled.and.returnValue(observableOf(false));
        fixture.detectChanges();
      });

      it('should render a button', () => {
        const button = fixture.debugElement.query(By.css('.dropdown-item'));
        expect(button).not.toBeNull();
      });
    });

    describe('and the button should be disabled', () => {
      beforeEach(() => {
        versioningModalService.isNewVersionButtonDisabled.and.returnValue(observableOf(true));
        fixture.detectChanges();
      });

      it('should not render a button', () => {
        const button = fixture.debugElement.query(By.css('.dropdown-item'));
        expect(button).toBeNull();
      });
    });

  });

  describe('when the user is not authorized', () => {
    beforeEach(() => {
      versioningModalService.isNewVersionButtonDisabled.and.returnValue(observableOf(false));
      authorizationServiceStub.isAuthorized.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should not render a button', () => {
      const button = fixture.debugElement.query(By.css('.dropdown-item'));
      expect(button).toBeNull();
    });
  });
});
