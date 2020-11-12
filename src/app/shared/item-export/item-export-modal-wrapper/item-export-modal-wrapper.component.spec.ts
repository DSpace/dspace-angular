import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemExportModalWrapperComponent } from './item-export-modal-wrapper.component';
import { AuthService } from '../../../core/auth/auth.service';
import { ViewContainerRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('ItemExportModalWrapperComponent', () => {
  let component: ItemExportModalWrapperComponent;
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
        { provide: AuthService, useClass: authServiceMock },
        { provide: NgbModal, useValue: modalService },
        ViewContainerRef
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
