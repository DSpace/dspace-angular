import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewContainerRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, of as observableOf } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { BrowserModule, By } from '@angular/platform-browser';
import { ItemExportComponent } from '../item-export/item-export.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { ItemExportModalLauncherComponent } from './item-export-modal-launcher.component';
import { ItemExportFormatMolteplicity } from '../../../core/itemexportformat/item-export-format.service';

describe('ItemExportModalWrapperComponent', () => {
  let component: ItemExportModalLauncherComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ItemExportModalLauncherComponent>;

  const modalService = jasmine.createSpyObj('modalService', ['open']);

  const authServiceMock: any = jasmine.createSpyObj('AuthService', {
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader,  useClass: TranslateLoaderMock }})
      ],
      declarations: [ItemExportModalLauncherComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NgbModal, useValue: modalService },
        ViewContainerRef
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportModalLauncherComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
  });

  // USER NOT AUTHENTICATED

  describe('when the user is not authenticated', () => {
    beforeEach(() => {
      authServiceMock.isAuthenticated.and.returnValue(observableOf(false));
    });

    it('should not display the open modal button', () => {
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('.btn'));
      expect(btn).toBeFalsy();
    });
  });

  // USER AUTHENTICATED

  describe('when the user is authenticated', () => {

    let btnDebugElement;

    beforeEach(() => {
      authServiceMock.isAuthenticated.and.returnValue(observableOf(true));
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
        component.open();
        fixture.detectChanges();
        btnDebugElement.triggerEventHandler('click', undefined);
        expect(component.open).toHaveBeenCalled();
      });

      describe('and an item is present', () => {

        beforeEach(() => {
          component.item = 'item' as any;
        });

        it('should configure the ItemExportComponent with the item and molteplicity SINGLE', () => {
          component.open();
          expect(modalService.open).toHaveBeenCalledWith(ItemExportComponent);
          expect(modalRef.componentInstance.item).toEqual('item');
          expect(modalRef.componentInstance.searchOptions).toBeFalsy();
          expect(modalRef.componentInstance.molteplicity).toEqual(ItemExportFormatMolteplicity.SINGLE);
        });

      });

      describe('and searchOptions$ are present', () => {

        beforeEach(() => {
          component.searchOptions$ = of('searchOptions') as any;
        });

        it('should configure the ItemExportComponent with the searchOptions$ and molteplicity MULTIPLE', () => {
          component.open();
          expect(modalService.open).toHaveBeenCalledWith(ItemExportComponent);
          expect(modalRef.componentInstance.item).toBeFalsy();
          expect(modalRef.componentInstance.searchOptions).toEqual('searchOptions');
          expect(modalRef.componentInstance.molteplicity).toEqual(ItemExportFormatMolteplicity.MULTIPLE);
        });

      });

    });


  });

});
