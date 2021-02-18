import { SearchService } from './../../../core/shared/search/search.service';
import { waitForAsync } from '@angular/core/testing';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CountersSectionComponent } from './counters-section.component';

xdescribe('CountersSectionComponent', () => {
  let component: CountersSectionComponent;
  let fixture: ComponentFixture<CountersSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CountersSectionComponent ],
      providers: [
        { provide: SearchService, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // FIXME complete tests
});
