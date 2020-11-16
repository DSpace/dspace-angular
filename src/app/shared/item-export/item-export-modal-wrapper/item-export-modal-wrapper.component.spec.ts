import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewContainerRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of as observableOf } from 'rxjs';

import { ItemExportModalWrapperComponent } from './item-export-modal-wrapper.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('ItemExportModalWrapperComponent', () => {
  let component: ItemExportModalWrapperComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ItemExportModalWrapperComponent>;

  const modalService = {
    open: () => {
      return {
        result: new Promise((res, rej) => {/****/
        })
      };
    }
  };

  const authServiceMock: any = jasmine.createSpyObj('AuthService', {
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemExportModalWrapperComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NgbModal, useValue: modalService },
        ViewContainerRef
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportModalWrapperComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    componentAsAny.authService.isAuthenticated.and.returnValue(observableOf(true))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
