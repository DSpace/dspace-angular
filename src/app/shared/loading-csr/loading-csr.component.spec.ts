import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingCsrComponent } from './loading-csr.component';
import { PLATFORM_ID } from '@angular/core';

describe('LoadingCsrComponent', () => {
  let component: LoadingCsrComponent;
  let fixture: ComponentFixture<LoadingCsrComponent>;

  const init = async (platformId) => {

    await TestBed.configureTestingModule({
      declarations: [ LoadingCsrComponent ],
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: platformId,
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingCsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('on the server', () => {
    beforeEach(async () => {
      await init('server');
    });

    it('should have loading=true', () => {
      expect(component.loading).toBe(true);
    });
  });

  describe('in the browser', () => {
    beforeEach(async () => {
      await init('browser');
    });

    it('should have loading=false', () => {
      expect(component.loading).toBe(false);
    });
  });
});
