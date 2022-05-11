import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CrisLayoutMatrixComponent } from './cris-layout-matrix.component';

import { leadingTabs } from '../../shared/testing/layout-tab.mocks';

describe('CrisLayoutMatrixComponent', () => {
  let component: CrisLayoutMatrixComponent;
  let fixture: ComponentFixture<CrisLayoutMatrixComponent>;
  let de: DebugElement;

  const tab = leadingTabs[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrisLayoutMatrixComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutMatrixComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show rows', () => {
    expect(de.queryAll(By.css('.row')).length).toEqual(0);
  });
  describe('after inserting selected tab', () => {

    beforeEach(() => {
      component.tab = tab;
      fixture.detectChanges();
    });

    it('should have 2 rows', () => {
      expect(de.queryAll(By.css('.row')).length).toEqual(2);
    });

    it('should have 1 row with test-class', () => {
      expect(de.queryAll(By.css('.test-class')).length).toEqual(1);
    });

    it('should have 3 cells', () => {
      expect(de.queryAll(By.css('.cell')).length).toEqual(3);
    });

    it('should have 2 col-md-6 cells', () => {
      expect(de.queryAll(By.css('.col-md-6')).length).toEqual(2);
    });

    it('should have 1 col cell', () => {
      expect(de.queryAll(By.css('.col')).length).toEqual(1);
    });

    it('should have 4 boxes', () => {
      expect(de.queryAll(By.css('ds-cris-layout-box-container')).length).toEqual(4);
    });

  });
});
