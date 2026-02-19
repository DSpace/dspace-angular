import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedFileSectionComponent } from './extended-file-section.component';

describe('ExtendedFileSectionComponent', () => {
  let component: ExtendedFileSectionComponent;
  let fixture: ComponentFixture<ExtendedFileSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtendedFileSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendedFileSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
