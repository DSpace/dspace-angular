import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewContainerRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, of as observableOf } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { BrowserModule, By } from '@angular/platform-browser';
import { ItemExportComponent } from '../item-export/item-export.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { ItemExportModalLauncherComponent } from './item-export-modal-launcher.component';
import { ItemExportFormatMolteplicity } from '../../../../core/itemexportformat/item-export-format.service';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';

describe('ItemExportModalWrapperComponent', () => {
  let component: ItemExportModalLauncherComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ItemExportModalLauncherComponent>;

  const modalService = jasmine.createSpyObj('modalService', ['open']);

  let authorizationService: AuthorizationDataService;
  authorizationService = jasmine.createSpyObj('authorizationService', {
    isAuthorized: observableOf(true)
  });

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: jasmine.createSpy('findByPropertyName')
  });

  const authServiceMock: any = jasmine.createSpyObj('AuthService', {
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  });

  const itemType = Object.assign(new ItemType(),{
    'type': 'entitytype',
    'id': 1,
    'label': 'Person',
    'uuid': 'entitytype-1',
    '_links': {
        'self': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1'
        },
        'relationshiptypes': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/entitytypes/1/relationshiptypes'
        }
    }
  });

  const confResponseDisabled$ = createSuccessfulRemoteDataObject$({ values: ['0'] });
  const confResponseEnabled$ = createSuccessfulRemoteDataObject$({ values: ['100'] });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader,  useClass: TranslateLoaderMock }})
      ],
      declarations: [ItemExportModalLauncherComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NgbModal, useValue: modalService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        ViewContainerRef
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportModalLauncherComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
  });

  // EXPORT LIMIT IS 0

  describe('when export limit is 0', () => {
    beforeEach(() => {
      authServiceMock.isAuthenticated.and.returnValue(observableOf(false));
      configurationDataService.findByPropertyName.and.returnValues(confResponseDisabled$);
  });

    it('should not display the open modal button', () => {
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('.btn'));
      expect(btn).toBeFalsy();
    });
  });

  // EXPORT LIMIT IS NOT 0

  describe('when export limit is not 0', () => {

    let btnDebugElement;

    beforeEach(() => {
      authServiceMock.isAuthenticated.and.returnValue(observableOf(true));
      configurationDataService.findByPropertyName.and.returnValues(confResponseEnabled$);
      fixture.detectChanges();
      btnDebugElement = fixture.debugElement.query(By.css('.btn'));
    });

    it('should display the open modal button', () => {
      expect(btnDebugElement).toBeTruthy();
    });

    describe('and click on open modal', () => {

      let modalRef;

      beforeEach(() => {
        modalRef = { componentInstance: {}};
        modalService.open.and.returnValue(modalRef);
        spyOn(component, 'open').and.callThrough();
      });

      it('should invoke component.open method', () => {
        component.open(itemType);
        fixture.detectChanges();
        btnDebugElement.triggerEventHandler('click', undefined);
        expect(component.open).toHaveBeenCalled();
      });

      describe('and an item is present', () => {

        beforeEach(() => {
          component.item = 'item' as any;
        });

        it('should configure the ItemExportComponent with the item and molteplicity SINGLE', () => {
          component.open(itemType);
          expect(modalService.open).toHaveBeenCalledWith(ItemExportComponent, { size: 'xl' });
          expect(modalRef.componentInstance.item).toEqual('item');
          expect(modalRef.componentInstance.searchOptions).toBeFalsy();
        });

      });

      describe('and searchOptions$ are present', () => {

        beforeEach(() => {
          component.searchOptions$ = of('searchOptions') as any;
        });

        it('should configure the ItemExportComponent with the searchOptions$ and molteplicity MULTIPLE', () => {
          component.open(itemType);
          expect(modalService.open).toHaveBeenCalledWith(ItemExportComponent, { size: 'xl' });
          expect(modalRef.componentInstance.item).toBeFalsy();
          expect(modalRef.componentInstance.searchOptions).toEqual('searchOptions');
          expect(modalRef.componentInstance.molteplicity).toEqual(ItemExportFormatMolteplicity.MULTIPLE);
          expect(modalRef.componentInstance.showListSelection).toBeTrue();
        });

      });

    });


  });

});
