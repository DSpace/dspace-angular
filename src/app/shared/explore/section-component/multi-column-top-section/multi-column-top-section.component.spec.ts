import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { MultiColumnTopSectionComponent } from './multi-column-top-section.component';

xdescribe('MultiColumnTopSectionComponent', () => {
  let component: MultiColumnTopSectionComponent;
  let fixture: ComponentFixture<MultiColumnTopSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MultiColumnTopSectionComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiColumnTopSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
