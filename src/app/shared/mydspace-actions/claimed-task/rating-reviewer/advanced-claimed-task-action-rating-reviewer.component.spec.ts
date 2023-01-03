import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdvancedClaimedTaskActionRatingReviewerComponent
} from './advanced-claimed-task-action-rating-reviewer.component';

describe('AdvancedClaimedTaskActionsRatingReviewerComponent', () => {
  let component: AdvancedClaimedTaskActionRatingReviewerComponent;
  let fixture: ComponentFixture<AdvancedClaimedTaskActionRatingReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdvancedClaimedTaskActionRatingReviewerComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedClaimedTaskActionRatingReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
