import { SearchService } from '../../../../core/shared/search/search.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CountersSectionComponent } from './counters-section.component';
import { NativeWindowService } from '../../../../core/services/window.service';
import { NativeWindowMockFactory } from '../../../mocks/mock-native-window-ref';

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
});
