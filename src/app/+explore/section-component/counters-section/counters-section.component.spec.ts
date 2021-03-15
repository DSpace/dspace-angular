import { SearchService } from './../../../core/shared/search/search.service';
import { waitForAsync } from '@angular/core/testing';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountersSectionComponent } from './counters-section.component';
import { NativeWindowService } from './../../../core/services/window.service';
// import { NativeWindowMockFactory } from 'src/app/shared/mocks/mock-native-window-ref';
import { NativeWindowMockFactory } from './../../../shared/mocks/mock-native-window-ref';

xdescribe('CountersSectionComponent', () => {
  let component: CountersSectionComponent;
  let fixture: ComponentFixture<CountersSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CountersSectionComponent ],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
      ]
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
