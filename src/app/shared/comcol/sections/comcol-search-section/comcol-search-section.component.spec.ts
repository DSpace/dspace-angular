import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComcolSearchSectionComponent } from './comcol-search-section.component';

describe('ComcolSearchSectionComponent', () => {
  let component: ComcolSearchSectionComponent;
  let fixture: ComponentFixture<ComcolSearchSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ComcolSearchSectionComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComcolSearchSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
