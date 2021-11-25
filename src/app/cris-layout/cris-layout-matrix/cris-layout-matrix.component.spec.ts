import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CrisLayoutMatrixComponent } from './cris-layout-matrix.component';

import { leadingTabs } from '../../shared/testing/new-layout-tabs';

describe('CrisLayoutMatrixComponent', () => {
  let component: CrisLayoutMatrixComponent;
  let fixture: ComponentFixture<CrisLayoutMatrixComponent>;
  let de: DebugElement;

  const tab = leadingTabs[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutMatrixComponent ]
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

  it('after inserting slected tab should have 2 rows', () => {
    component.tab = tab;
    fixture.detectChanges();
    expect(de.queryAll(By.css('.row')).length).toEqual(2);
  });
});
