import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { SearchManager } from '../../../../core/browse/search-manager';
import { NativeWindowService } from '../../../../core/services/window.service';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { NativeWindowMockFactory } from '../../../mocks/mock-native-window-ref';
import { CountersSectionComponent } from './counters-section.component';

xdescribe('CountersSectionComponent', () => {
  let component: CountersSectionComponent;
  let fixture: ComponentFixture<CountersSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CountersSectionComponent],
      providers: [
        { provide: SearchManager, useValue: {} },
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
      ],
    })
      .overrideComponent(CountersSectionComponent, { remove: { imports: [ThemedLoadingComponent] } }).compileComponents();
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
